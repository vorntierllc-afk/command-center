import type { DashboardOverview } from "@/lib/server/types";

export const SAMPLE_OVERVIEW: DashboardOverview = {
  totalVolume: 284920,
  chargebackRate: 1.84,
  riskScore: 62,
  activeAlerts: 7,
  transactionsToday: 184,
  refundsIssued: 13,
  processorRisk: 68,
  disputeProbability: 37,
  midHealth: 54,
  reserveAmount: 42600,
  isSample: true
};

export const SAMPLE_ALERTS = [
  {
    id: "sample-1",
    type: "critical",
    message: "Chargeback ratio moved above 1.5% across digital continuity traffic.",
    createdAt: "3 min ago"
  },
  {
    id: "sample-2",
    type: "warning",
    message: "Three high-risk BIN clusters were approved within one hour.",
    createdAt: "14 min ago"
  },
  {
    id: "sample-3",
    type: "info",
    message: "Reserve utilization increased 8% week over week.",
    createdAt: "33 min ago"
  }
];
