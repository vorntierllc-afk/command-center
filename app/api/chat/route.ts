import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message } = await request.json();
  if (!message?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 });

  // Get merchant + ai_analysis
  const { data: merchant } = await supabase
    .from("merchants")
    .select("id, ai_analysis")
    .eq("user_id", user.id)
    .single();

  const aiAnalysis = merchant?.ai_analysis ?? null;

  // Get chat history (last 10 messages for context)
  const { data: history } = await supabase
    .from("chat_history")
    .select("role, message")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(10);

  const systemPrompt = `You are a payment risk analyst for HighRiskIntel. ${
    aiAnalysis
      ? `Here is the merchant's analysis: ${JSON.stringify(aiAnalysis)}.`
      : "The merchant has not yet connected their data."
  } Answer their questions concisely and practically. Max 3 sentences per response.`;

  const messages: Anthropic.MessageParam[] = [
    ...(history ?? []).map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.message,
    })),
    { role: "user" as const, content: message },
  ];

  const response = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 256,
    system: systemPrompt,
    messages,
  });

  const reply = response.content[0].type === "text" ? response.content[0].text : "";

  // Save both messages to chat_history
  await supabase.from("chat_history").insert([
    { user_id: user.id, role: "user", message },
    { user_id: user.id, role: "assistant", message: reply },
  ]);

  return NextResponse.json({ reply });
}
