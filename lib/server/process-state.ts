import { prisma } from "@/lib/server/prisma";
import { SAMPLE_OVERVIEW } from "@/lib/server/sample-data";
import type { DashboardOverview } from "@/lib/server/types";

export async function getMerchantOverview(userId: string): Promise<DashboardOverview> {
  const merchant = await prisma.merchant.findFirst({
    where: { userId },
    include: {
      alerts: {
        where: { resolved: false }
      },
      transactions: true
    }
  });

  if (!merchant || merchant.transactions.length === 0 || merchant.processingStatus !== "ready") {
    return SAMPLE_OVERVIEW;
  }

  const totalVolume = merchant.transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const disputes = merchant.transactions.filter((tx) => tx.disputed).length;
  const refunds = merchant.transactions.filter((tx) => tx.refunded).length;
  const today = new Date().toISOString().slice(0, 10);
  const transactionsToday = merchant.transactions.filter(
    (tx) => tx.createdAt.toISOString().slice(0, 10) === today
  ).length;
  const averageRisk =
    merchant.transactions.reduce((sum, tx) => sum + tx.riskScore, 0) /
    merchant.transactions.length;

  return {
    totalVolume,
    chargebackRate: merchant.transactions.length ? (disputes / merchant.transactions.length) * 100 : 0,
    riskScore: Math.round(averageRisk),
    activeAlerts: merchant.alerts.length,
    transactionsToday,
    refundsIssued: refunds,
    processorRisk: Math.max(25, 100 - merchant.midHealthScore),
    disputeProbability: Math.min(92, Math.round((disputes / Math.max(merchant.transactions.length, 1)) * 100 * 3.1)),
    midHealth: merchant.midHealthScore,
    reserveAmount: merchant.reserveAmount,
    isSample: false
  };
}
