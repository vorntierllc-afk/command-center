export interface MIDHealth {
  chargeback_ratio: number;
  dispute_velocity: number;
  reserve_burn: number;
  processor_threshold: number;
  days_until_risk: number;
}

export function calculateMIDHealth(metrics: MIDHealth) {
  const pressure =
    metrics.chargeback_ratio * 28 +
    metrics.dispute_velocity * 16 +
    metrics.reserve_burn * 18 +
    metrics.processor_threshold * 22;

  const health = Math.max(0, Math.min(100, Math.round(100 - pressure)));
  const daysUntilRisk = Math.max(3, Math.round(metrics.days_until_risk));

  return {
    health,
    daysUntilRisk,
    critical: metrics.chargeback_ratio > 1.5 || health < 40,
    warning: metrics.chargeback_ratio > 1.0 || health < 60
  };
}
