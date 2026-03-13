import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getCurrentSession } from "@/lib/server/session";
import { getMerchantOverview } from "@/lib/server/process-state";
import { generateWeeklyReportSummary } from "@/lib/reports/generator";

export async function POST() {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const merchant = await prisma.merchant.findFirst({ where: { userId: session.userId } });
  if (!merchant) {
    return NextResponse.json({ error: "No merchant profile found." }, { status: 400 });
  }

  const overview = await getMerchantOverview(session.userId);
  const summary = generateWeeklyReportSummary(overview);
  const report = await prisma.report.create({
    data: {
      merchantId: merchant.id,
      week: new Date().toISOString().slice(0, 10),
      summary: summary as any
    }
  });

  return NextResponse.json({ report_url: report.fileUrl || null, report });
}
