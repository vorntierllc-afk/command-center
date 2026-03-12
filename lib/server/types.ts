export type AlertLevel = "critical" | "warning" | "info";

export interface DashboardOverview {
  totalVolume: number;
  chargebackRate: number;
  riskScore: number;
  activeAlerts: number;
  transactionsToday: number;
  refundsIssued: number;
  processorRisk: number;
  disputeProbability: number;
  midHealth: number;
  reserveAmount: number;
  isSample: boolean;
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
