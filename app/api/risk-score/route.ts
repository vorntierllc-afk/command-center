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
    country: body.country,
    cardBin: body.card_bin,
    email: body.email,
    ipVelocityCount: body.ip_address ? 1 : 0,
    createdAt: new Date()
  });

  return NextResponse.json({
    risk_score: result.riskScore,
    action: result.action,
    signals: result.signals,
    reason: result.reason
  });
}
