import type { RiskStatus } from "@/lib/server/types";

export interface MerchantRiskInput {
  disputeRatio: number;     // percentage, e.g. 0.78 for 0.78%
  authDeviation: number;    // percentage points dropped from baseline, e.g. 5 for -5%
  volumeSpike: number;      // multiplier vs normal, e.g. 2 for 200% spike
  refundRatio: number;      // percentage, e.g. 9.4 for 9.4%
  crossBorderRatio: number; // percentage, e.g. 22 for 22%
}

export interface MerchantRiskResult {
  score: number;
  status: RiskStatus;
  breakdown: {
    disputeContribution: number;
    authContribution: number;
    volumeContribution: number;
    refundContribution: number;
    crossBorderContribution: number;
  };
}

// Max thresholds for each variable (100% of their weight contribution)
const THRESHOLDS = {
  disputeRatio: 1.0,     // 1% = full 40 points
  authDeviation: 10,     // 10 point drop = full 20 points
  volumeSpike: 2.0,      // 200% spike = full 15 points
  refundRatio: 15,       // 15% = full 15 points
  crossBorderRatio: 30   // 30% = full 10 points
};

// Score weights (must sum to 100)
const WEIGHTS = {
  disputeRatio: 40,
  authDeviation: 20,
  volumeSpike: 15,
  refundRatio: 15,
  crossBorderRatio: 10
};

export function scoreMerchantRisk(input: MerchantRiskInput): MerchantRiskResult {
  const disputeContribution = Math.min(
    WEIGHTS.disputeRatio,
    (input.disputeRatio / THRESHOLDS.disputeRatio) * WEIGHTS.disputeRatio
  );
  const authContribution = Math.min(
    WEIGHTS.authDeviation,
    (Math.max(0, input.authDeviation) / THRESHOLDS.authDeviation) * WEIGHTS.authDeviation
  );
  const volumeContribution = Math.min(
    WEIGHTS.volumeSpike,
    (Math.max(0, input.volumeSpike - 1) / (THRESHOLDS.volumeSpike - 1)) * WEIGHTS.volumeSpike
  );
  const refundContribution = Math.min(
    WEIGHTS.refundRatio,
    (input.refundRatio / THRESHOLDS.refundRatio) * WEIGHTS.refundRatio
  );
  const crossBorderContribution = Math.min(
    WEIGHTS.crossBorderRatio,
    (input.crossBorderRatio / THRESHOLDS.crossBorderRatio) * WEIGHTS.crossBorderRatio
  );

  const score = Math.round(
    disputeContribution +
    authContribution +
    volumeContribution +
    refundContribution +
    crossBorderContribution
  );

  const status: RiskStatus =
    score >= 71 ? "critical" :
    score >= 41 ? "elevated" :
    "stable";

  return {
    score,
    status,
    breakdown: {
      disputeContribution: Math.round(disputeContribution),
      authContribution: Math.round(authContribution),
      volumeContribution: Math.round(volumeContribution),
      refundContribution: Math.round(refundContribution),
      crossBorderContribution: Math.round(crossBorderContribution)
    }
  };
}

export function riskStatusLabel(status: RiskStatus): string {
  return status === "critical" ? "Critical" : status === "elevated" ? "Elevated" : "Stable";
}

export function riskStatusColor(status: RiskStatus): string {
  return status === "critical" ? "#EF4444" : status === "elevated" ? "#F59E0B" : "#22C55E";
}
