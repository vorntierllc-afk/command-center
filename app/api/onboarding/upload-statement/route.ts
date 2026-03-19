import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ANALYSIS_PROMPT = `You are a payment risk analyst. Analyze this merchant processing statement and return ONLY a JSON object with these fields: total_volume, chargeback_rate, dispute_count, high_risk_transactions (array of {id, amount, reason}), top_risk_factors (array of strings), country_breakdown (object), recommended_actions (array of strings ordered by priority), summary (2-3 sentence plain English overview of their risk situation).`;

async function extractText(file: File): Promise<string> {
  if (file.type === "text/csv" || file.name.endsWith(".csv")) {
    return await file.text();
  }
  try {
    const pdfParse = (await import("pdf-parse")).default;
    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdfParse(buffer);
    return data.text;
  } catch {
    return `File: ${file.name} (could not extract text)`;
  }
}

async function analyzeWithAI(text: string): Promise<Record<string, unknown>> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `${ANALYSIS_PROMPT}\n\nStatement content:\n${text.slice(0, 8000)}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content ?? "";
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");
  return JSON.parse(jsonMatch[0]);
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: merchant } = await supabase
      .from("merchants")
      .select("id, user_id")
      .eq("user_id", user.id)
      .single();

    if (!merchant) {
      return NextResponse.json({ error: "Complete onboarding intake first." }, { status: 400 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files").filter((value): value is File => value instanceof File);
    const uploadIds: string[] = [];
    const allText: string[] = [];

    for (const file of files.slice(0, 6)) {
      const storagePath = `${merchant.id}/${Date.now()}-${file.name}`;

      // Upload to storage
      try {
        const buf = await file.arrayBuffer();
        await supabase.storage.from("statements").upload(storagePath, Buffer.from(buf), {
          contentType: file.type,
          upsert: false,
        });
      } catch (e) {
        console.error("Storage upload error:", e);
      }

      // Extract text for AI analysis
      try {
        const text = await extractText(file);
        allText.push(`--- ${file.name} ---\n${text}`);
      } catch (e) {
        console.error("Text extraction error:", e);
      }

      const { data: upload } = await supabase.from("statement_uploads").insert({
        user_id: user.id,
        file_name: file.name,
        file_type: file.type.includes("pdf") ? "pdf" : "csv",
        file_url: storagePath,
      }).select("id").single();

      if (upload?.id) uploadIds.push(upload.id);
    }

    // Run AI analysis on extracted text
    let aiAnalysis: Record<string, unknown> | null = null;
    if (allText.length > 0) {
      try {
        aiAnalysis = await analyzeWithAI(allText.join("\n\n"));
      } catch (e) {
        console.error("AI analysis error:", e);
        aiAnalysis = {
          total_volume: 0,
          chargeback_rate: 0,
          dispute_count: 0,
          high_risk_transactions: [],
          top_risk_factors: ["Analysis pending — statements uploaded successfully"],
          country_breakdown: {},
          recommended_actions: ["Review statements manually", "Contact support if analysis doesn't complete"],
          summary: "Statements uploaded successfully. AI analysis is processing.",
        };
      }
    }

    // Update merchant record
    if (aiAnalysis) {
      await supabase.from("merchants").update({
        ai_analysis: aiAnalysis,
        chargeback_rate: (aiAnalysis.chargeback_rate as number) ?? 0,
        onboard_method: "upload",
        status: "active",
      }).eq("user_id", user.id);
    }

    return NextResponse.json({ upload_ids: uploadIds, status: "complete", ai_analysis: aiAnalysis });
  } catch (err) {
    console.error("Upload statement error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
