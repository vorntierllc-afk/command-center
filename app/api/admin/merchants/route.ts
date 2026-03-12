import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import { getCurrentSession } from "@/lib/server/session";

const schema = z.object({
  businessName: z.string().min(2),
  websiteUrl: z.string().optional(),
  merchantCategory: z.string().min(2),
  productsDescription: z.string().min(5),
  monthlyProcessingVolume: z.number(),
  averageTicket: z.number(),
  highestTicket: z.number(),
  countriesServed: z.array(z.string()).default([]),
  currentProcessor: z.string().optional(),
  approvalHistory: z.string().optional(),
  chargebackHistory: z.string().optional(),
  reserveHistory: z.string().optional(),
  processingModel: z.string().optional(),
  fulfillmentTimeline: z.string().optional(),
  method: z.enum(["api", "upload"]).default("api")
});

export async function POST(request: Request) {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = schema.parse(await request.json());
  const existingMerchant = await prisma.merchant.findFirst({
    where: { userId: session.userId }
  });

  const merchantPayload = {
    businessName: body.businessName,
    websiteUrl: body.websiteUrl,
    processor: body.currentProcessor,
    merchantCategory: body.merchantCategory,
    productsDescription: body.productsDescription,
    monthlyProcessing: body.monthlyProcessingVolume,
    averageTicket: body.averageTicket,
    highestTicket: body.highestTicket,
    countriesServed: body.countriesServed,
    approvalHistory: body.approvalHistory,
    chargebackHistory: body.chargebackHistory,
    reserveHistory: body.reserveHistory,
    processingModel: body.processingModel,
    fulfillmentTimeline: body.fulfillmentTimeline,
    onboardMethod: body.method,
    processingStatus: "processing"
  };

  const merchant = existingMerchant
    ? await prisma.merchant.update({
        where: { id: existingMerchant.id },
        data: merchantPayload
      })
    : await prisma.merchant.create({
        data: {
          userId: session.userId,
          ...merchantPayload
        }
      });

  await prisma.user.update({
    where: { id: session.userId },
    data: { onboarded: true, businessName: body.businessName }
  }).catch(() => null);

  return NextResponse.json({ merchant });
}
