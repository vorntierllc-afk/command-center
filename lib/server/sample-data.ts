import type { DashboardOverview, DashboardChartData, AlertWithMitigations } from "@/lib/server/types";

export const SAMPLE_OVERVIEW: DashboardOverview = {
  totalVolume: 284920,
  chargebackRate: 1.84,
  riskScore: 62,
  riskStatus: "elevated",
  riskTrend: +8,
  authApprovalRate: 78.4,
  authDeclineRate: 21.6,
  authDeviation: -5.2,
  disputeRatio: 0.78,
  refundRatio: 9.4,
  volumeSpike: 1.3,
  crossBorderRatio: 22,
  activeAlerts: 7,
  transactionsToday: 184,
  refundsIssued: 13,
  processorRisk: 68,
  disputeProbability: 37,
  midHealth: 54,
  reserveAmount: 42600,
  isSample: true
};

function buildTrend(baseValue: number, days: number, variance: number, drift = 0): { date: string; value: number }[] {
  const now = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1 - i));
    const noise = (Math.random() - 0.5) * variance;
    const trend = drift * i;
    return {
      date: d.toISOString().slice(0, 10),
      value: Math.max(0, parseFloat((baseValue + noise + trend).toFixed(4)))
    };
  });
}

export const SAMPLE_CHART_DATA: DashboardChartData = {
  disputeRatioTrend: buildTrend(0.62, 90, 0.25, 0.003),
  authRateTrend: buildTrend(81, 90, 3, -0.04),
  volumeTrend: buildTrend(9800, 90, 2200, 0),
  refundRatioTrend: buildTrend(8.2, 90, 2.1, 0.03)
};

export const SAMPLE_ALERTS: AlertWithMitigations[] = [
  {
    id: "sample-1",
    type: "chargeback_spike",
    message: "Chargeback ratio moved above 1.5% across digital continuity traffic.",
    severity: "critical",
    createdAt: "3 min ago",
    mitigations: [
      "Pause digital continuity SKUs for 24 hours",
      "Issue pre-emptive refunds on orders > 60 days old",
      "Enable enhanced 3DS on all new transactions",
      "Contact processor risk team immediately"
    ]
  },
  {
    id: "sample-2",
    type: "auth_drop",
    message: "Authorization rate dropped 8% below 7-day average. High-risk BIN clusters involved.",
    severity: "warning",
    createdAt: "14 min ago",
    mitigations: [
      "Enable 3DS authentication on affected BIN ranges",
      "Review and tighten transaction limits for flagged segments",
      "Check processor decline reason codes for patterns"
    ]
  },
  {
    id: "sample-3",
    type: "volume_anomaly",
    message: "Transaction volume spike detected — 2.4x normal for this time of day.",
    severity: "warning",
    createdAt: "33 min ago",
    mitigations: [
      "Enable velocity controls on repeat buyers",
      "Reduce traffic from high-risk geographies",
      "Temporarily lower single-transaction limit"
    ]
  },
  {
    id: "sample-4",
    type: "refund_latency",
    message: "Average refund processing time increased to 9 days. Dispute window exposure elevated.",
    severity: "low",
    createdAt: "2 hours ago",
    mitigations: [
      "Process outstanding refund queue within 24 hours",
      "Set auto-refund rule for orders older than 45 days",
      "Notify affected customers proactively to reduce disputes"
    ]
  },
  {
    id: "sample-5",
    type: "reserve_alert",
    message: "Reserve utilization increased 8% week over week.",
    severity: "info",
    createdAt: "Yesterday",
    mitigations: [
      "Review reserve agreement terms with processor",
      "Model reserve release schedule for next 30 days"
    ]
  }
];
