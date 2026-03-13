import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import { getCurrentSession } from "@/lib/server/session";
import { encryptSecret } from "@/lib/server/crypto";
import { validateAdyenConnection } from "@/lib/processors/adyen";
import { validateAuthorizeConnection } from "@/lib/processors/authorize";
import { validateCheckoutConnection } from "@/lib/processors/checkout";
import { validateMxMerchantConnection } from "@/lib/processors/mxmerchant";
import { syncStripeTransactions, validateStripeConnection } from "@/lib/processors/stripe";
import { scoreTransaction } from "@/lib/risk-engine/scorer";

const schema = z.object({
  processor: z.string(),
  api_key: z.string(),
  merchant_id: z.string().optional(),
  extra_fields: z.record(z.string()).optional()
});

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = schema.parse(await request.json());
  const merchant = await prisma.merchant.findFirst({ where: { userId: session.userId } });
  if (!merchant) {
    return NextResponse.json({ error: "Complete onboarding intake first." }, { status: 400 });
  }

  switch (body.processor) {
    case "stripe":
      await validateStripeConnection(body.api_key);
      break;
    case "checkout":
      await validateCheckoutConnection(body.api_key);
      break;
    case "adyen":
      await validateAdyenConnection(body.api_key, body.extra_fields?.merchant_account || "");
      break;
    case "mxmerchant":
      await validateMxMerchantConnection(body.api_key);
      break;
    case "authorize":
      await validateAuthorizeConnection(body.extra_fields?.api_login_id || "", body.extra_fields?.transaction_key || "");
      break;
    default:
      return NextResponse.json({ error: "Unsupported processor." }, { status: 400 });
  }

  await prisma.merchant.update({
    where: { id: merchant.id },
    data: {
      processor: body.processor,
      processorKey: encryptSecret(body.api_key),
      processorMetadata: body.extra_fields as any,
      onboardMethod: "api",
      processingStatus: "processing"
    }
  });

  if (body.processor === "stripe") {
    const synced = await syncStripeTransactions(body.api_key).catch(() => []);
    if (synced.length > 0) {
      await prisma.transaction.createMany({
        data: synced.map((tx) => {
          const scored = scoreTransaction({
            amount: tx.amount,
            country: tx.country,
            cardBin: tx.cardBin,
            email: tx.email,
            createdAt: tx.createdAt
          });
          return {
            merchantId: merchant.id,
            txId: tx.txId,
            amount: tx.amount,
            currency: tx.currency || "USD",
            country: tx.country || "US",
            cardBin: tx.cardBin || "",
              processor: "stripe",
              status: tx.status || "approved",
              riskScore: scored.riskScore,
              riskSignals: scored.signals as any,
              email: tx.email,
              createdAt: tx.createdAt || new Date()
          };
        })
      }).catch(() => null);
    }
  }

  return NextResponse.json({ success: true, merchant_id: merchant.id });
}
