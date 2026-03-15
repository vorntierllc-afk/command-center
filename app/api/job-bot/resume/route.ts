import { NextResponse } from "next/server";
import { extractPdfText } from "@/lib/job-bot/resume-parser";
import { extractResumeProfile } from "@/lib/job-bot/matching";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Resume file is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractPdfText(buffer);
    const profile = extractResumeProfile(text);

    return NextResponse.json({ text, profile });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to parse resume." },
      { status: 500 }
    );
  }
}
