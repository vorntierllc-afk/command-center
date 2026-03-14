import { prisma } from "@/lib/server/prisma";
import { SAMPLE_OVERVIEW } from "@/lib/server/sample-data";
import { scoreMerchantRisk } from "@/lib/risk-engine/merchant-scorer";
import type { DashboardOverview } from "@/lib/server/types";

export async function getMerchantOverview(userId: string): Promise<DashboardOverview> {
  const merchant = await prisma.merchant.findFirst({
    where: { userId },
    include: {
      alerts: { where: { resolved: false } },
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

  const txCount = merchant.transactions.length;
  const disputeRatio = txCount ? (disputes / txCount) * 100 : 0;
  const refundRatio = txCount ? (refunds / txCount) * 100 : 0;

  const crossBorderTxs = merchant.transactions.filter(
    (tx) => tx.country && tx.country !== "US"
  ).length;
  const crossBorderRatio = txCount ? (crossBorderTxs / txCount) * 100 : 0;

  // Auth deviation: compare last 7 days to prior 7 days
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const last7 = merchant.transactions.filter(
    (tx) => now - new Date(tx.createdAt).getTime() < sevenDaysMs
  );
  const prior7 = merchant.transactions.filter((tx) => {
    const age = now - new Date(tx.createdAt).getTime();
    return age >= sevenDaysMs && age < sevenDaysMs * 2;
  });
  const last7ApprovalRate = last7.length
    ? (last7.filter((tx) => tx.status === "approved").length / last7.length) * 100
    : 80;
  const prior7ApprovalRate = prior7.length
    ? (prior7.filter((tx) => tx.status === "approved").length / prior7.length) * 100
    : 80;
  const authDeviation = last7ApprovalRate - prior7ApprovalRate;
  const authDeclineRate = 100 - last7ApprovalRate;

  const riskResult = scoreMerchantRisk({
    disputeRatio: disputeRatio / 100,
    authDeviation: Math.max(0, -authDeviation),
    volumeSpike: 1,
    refundRatio,
    crossBorderRatio
  });

  return {
    totalVolume,
    chargebackRate: disputeRatio,
    riskScore: riskResult.score,
    riskStatus: riskResult.status,
    riskTrend: 0,
    authApprovalRate: last7ApprovalRate,
    authDeclineRate,
    authDeviation,
    disputeRatio: disputeRatio / 100,
    refundRatio,
    volumeSpike: 1,
    crossBorderRatio,
    activeAlerts: merchant.alerts.length,
    transactionsToday,
    refundsIssued: refunds,
    processorRisk: Math.max(25, 100 - merchant.midHealthScore),
    disputeProbability: Math.min(92, Math.round((disputes / Math.max(txCount, 1)) * 100 * 3.1)),
    midHealth: merchant.midHealthScore,
    reserveAmount: merchant.reserveAmount,
    isSample: false
  };
}
