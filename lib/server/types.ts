export type AlertLevel = "critical" | "warning" | "low" | "info";
export type RiskStatus = "stable" | "elevated" | "critical";

export interface DashboardOverview {
  totalVolume: number;
  chargebackRate: number;
  riskScore: number;
  riskStatus: RiskStatus;
  riskTrend: number; // delta vs 30 days ago
  authApprovalRate: number;
  authDeclineRate: number;
  authDeviation: number; // vs 7-day baseline
  disputeRatio: number;
  refundRatio: number;
  volumeSpike: number; // multiplier, 1 = normal
  crossBorderRatio: number;
  activeAlerts: number;
  transactionsToday: number;
  refundsIssued: number;
  processorRisk: number;
  disputeProbability: number;
  midHealth: number;
  reserveAmount: number;
  isSample: boolean;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface DashboardChartData {
  disputeRatioTrend: ChartDataPoint[];
  authRateTrend: ChartDataPoint[];
  volumeTrend: ChartDataPoint[];
  refundRatioTrend: ChartDataPoint[];
}

export interface MerchantIntakePayload {
  businessName: string;
  websiteUrl?: string;
  merchantCategory: string;
  productsDescription: string;
  monthlyProcessingVolume: number;
  averageTicket: number;
  highestTicket: number;
  countriesServed: string[];
  currentProcessor?: string;
  approvalHistory: string;
  chargebackHistory: string;
  reserveHistory: string;
  processingModel: string;
  fulfillmentTimeline: string;
}

export interface TransactionInput {
  txId: string;
  amount: number;
  currency?: string;
  country?: string;
  cardBin?: string;
  processor?: string;
  status?: string;
  ipAddress?: string;
  email?: string;
  createdAt?: Date;
}

export interface AlertWithMitigations {
  id: string;
  type: string;
  message: string;
  severity: AlertLevel;
  createdAt: string;
  mitigations: string[];
}
