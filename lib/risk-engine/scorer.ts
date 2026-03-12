import { DISPOSABLE_EMAIL_DOMAINS, HIGH_RISK_COUNTRIES, KNOWN_FRAUD_BINS, MEDIUM_RISK_COUNTRIES, PREPAID_BINS, VIRTUAL_BINS } from "@/lib/risk-engine/rules";

export interface RiskSignals {
  country_risk: number;
  bin_risk: number;
  amount_risk: number;
  velocity_risk: number;
  time_risk: number;
  email_risk: number;
}

export interface ScoreInput {
  amount: number;
  country?: string | null;
  cardBin?: string | null;
  email?: string | null;
  ipVelocityCount?: number;
  binVelocityCount?: number;
  createdAt?: Date;
}

export function scoreTransaction(input: ScoreInput) {
  const signals: RiskSignals = {
    country_risk: 0,
    bin_risk: 0,
    amount_risk: 0,
    velocity_risk: 0,
    time_risk: 0,
    email_risk: 0
  };

  if (input.country && HIGH_RISK_COUNTRIES.includes(input.country)) {
    signals.country_risk = 24;
  } else if (input.country && MEDIUM_RISK_COUNTRIES.includes(input.country)) {
    signals.country_risk = 12;
  }

  if (input.cardBin && KNOWN_FRAUD_BINS.includes(input.cardBin.slice(0, 6))) {
    signals.bin_risk = 20;
  } else if (input.cardBin && PREPAID_BINS.includes(input.cardBin.slice(0, 6))) {
    signals.bin_risk = 15;
  } else if (input.cardBin && VIRTUAL_BINS.includes(input.cardBin.slice(0, 6))) {
    signals.bin_risk = 10;
  }

  if (input.amount > 5000) signals.amount_risk = 15;
  else if (input.amount > 2500) signals.amount_risk = 12;
  else if (input.amount > 1000) signals.amount_risk = 8;

  if ((input.binVelocityCount || 0) >= 3) signals.velocity_risk += 15;
  if ((input.ipVelocityCount || 0) >= 5) signals.velocity_risk += 20;
  signals.velocity_risk = Math.min(signals.velocity_risk, 20);

  const hour = (input.createdAt || new Date()).getUTCHours();
  if (hour <= 5 || hour >= 23) {
    signals.time_risk = 8;
  }

  const emailDomain = input.email?.split("@")[1]?.toLowerCase();
  if (emailDomain && DISPOSABLE_EMAIL_DOMAINS.includes(emailDomain)) {
    signals.email_risk = 10;
  }

  const riskScore = Object.values(signals).reduce((sum, value) => sum + value, 0);
  const action = riskScore >= 80 ? "block" : riskScore >= 50 ? "review" : "approve";
  const reason = action === "block"
    ? "Risk exceeds automated acceptance threshold."
    : action === "review"
      ? "Transaction requires manual review."
      : "Risk remains inside approval range.";

  return { riskScore, action, signals, reason };
}
