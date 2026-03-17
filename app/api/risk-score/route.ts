import { NextResponse } from "next/server";
import { z } from "zod";
import { scoreTransaction } from "@/lib/risk-engine/scorer";
import { checkRateLimit } from "@/lib/server/rate-limit";

const schema = z.object({
  transaction_id: z.string().optional(),
  amount: z.number(),
  currency: z.string().optional(),
  card_bin: z.string().optional(),
  country: z.string().optional(),
  ip_address: z.string().optional(),
  email: z.string().optional()
});

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "local";
  const rate = checkRateLimit(forwardedFor, 100, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
  }

  const body = schema.parse(await request.json());
  const result = scoreTransaction({
    amount: body.amount,
    country: body.country ?? undefined,
    email: body.email ?? undefined,
  });

  return NextResponse.json({
    risk_score: result.score,
    action: result.action,
    signals: result.signals,
    reason: result.action === 'block'
      ? 'Risk exceeds automated acceptance threshold.'
      : result.action === 'review'
        ? 'Transaction requires manual review.'
        : 'Risk remains inside approval range.'
  });
}
