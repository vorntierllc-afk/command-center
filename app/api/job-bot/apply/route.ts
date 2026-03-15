import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  resumeText: z.string().min(1),
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  applyUrl: z.string().url(),
  whyFit: z.string().min(1),
  availability: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());

    return NextResponse.json({
      status: "prepared",
      message:
        "Application packet prepared. Direct auto-submission depends on the target job board or employer form and should be reviewed before sending.",
      submission: {
        applicant: {
          name: body.name,
          email: body.email,
          phone: body.phone
        },
        job: {
          title: body.jobTitle,
          company: body.company,
          applyUrl: body.applyUrl
        },
        answers: {
          whyFit: body.whyFit,
          availability: body.availability
        }
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to prepare application." },
      { status: 400 }
    );
  }
}
