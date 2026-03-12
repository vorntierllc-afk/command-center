import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getCurrentSession } from "@/lib/server/session";

export async function GET() {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const merchant = await prisma.merchant.findFirst({ where: { userId: session.userId } });
  if (!merchant) {
    return NextResponse.json([]);
  }

  const alerts = await prisma.alert.findMany({
    where: { merchantId: merchant.id },
    orderBy: [{ type: "asc" }, { createdAt: "desc" }]
  });

  return NextResponse.json(alerts);
}
