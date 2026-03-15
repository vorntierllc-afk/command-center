import { NextResponse } from "next/server";
import { z } from "zod";
import { extractResumeProfile, matchJobs } from "@/lib/job-bot/matching";
import { sampleJobs } from "@/lib/job-bot/sample-jobs";
import type { JobListing } from "@/lib/job-bot/types";

const requestSchema = z.object({
  resumeText: z.string().min(1),
  hoursPerWeek: z.number().min(1).max(80),
  preferredShift: z.enum(["day", "evening", "night", "flexible"]),
  workPreference: z.enum(["remote", "hybrid", "onsite", "any"]),
  preferredTitles: z.array(z.string()).default([]),
  jobs: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        company: z.string(),
        location: z.string(),
        workPreference: z.enum(["remote", "hybrid", "onsite"]),
        minHours: z.number().optional(),
        maxHours: z.number().optional(),
        shift: z.enum(["day", "evening", "night", "flexible"]).optional(),
        salary: z.string().optional(),
        applyUrl: z.string(),
        description: z.string(),
        requirements: z.array(z.string())
      })
    )
    .optional()
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const profile = extractResumeProfile(body.resumeText, body.preferredTitles);
    const jobs = (body.jobs?.length ? body.jobs : sampleJobs) as JobListing[];
    const matches = matchJobs(jobs, profile, {
      hoursPerWeek: body.hoursPerWeek,
      preferredShift: body.preferredShift,
      workPreference: body.workPreference
    });

    return NextResponse.json({ profile, jobs, matches });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to search jobs." },
      { status: 400 }
    );
  }
}
