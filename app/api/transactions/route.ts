import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getCurrentSession } from "@/lib/server/session";

export async function GET(request: Request) {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || 1);
  const limit = Number(url.searchParams.get("limit") || 20);
  const riskFilter = Number(url.searchParams.get("risk_filter") || 0);
  const search = url.searchParams.get("search") || "";

  const merchant = await prisma.merchant.findFirst({ where: { userId: session.userId } });
  if (!merchant) {
    return NextResponse.json({ data: [], total: 0 });
  }

  const where = {
    merchantId: merchant.id,
    riskScore: riskFilter ? { gte: riskFilter } : undefined,
    txId: search ? { contains: search } : undefined
  };

  const [data, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.transaction.count({ where })
  ]);

  return NextResponse.json({ data, total, page, limit });
}
