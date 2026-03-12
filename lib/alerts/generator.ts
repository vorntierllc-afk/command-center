import type { AlertLevel } from "@/lib/server/types";

export function generateAlerts(input: {
  chargebackRate: number;
  riskScoreSpike: number;
  midHealth: number;
  reserveRatio: number;
  highRiskClusterCount: number;
  disputeTrendUp: boolean;
}) {
  const alerts: { type: AlertLevel; message: string }[] = [];

  if (input.chargebackRate > 1.5) {
    alerts.push({ type: "critical", message: "Chargeback ratio moved above 1.5%." });
  } else if (input.chargebackRate > 1.0) {
    alerts.push({ type: "warning", message: "Chargeback ratio moved above 1.0%." });
  }

  if (input.riskScoreSpike >= 20) {
    alerts.push({ type: "warning", message: "Average risk score increased by 20+ points." });
  }
  if (input.midHealth < 40) {
    alerts.push({ type: "critical", message: "MID health dropped below 40." });
  } else if (input.midHealth < 60) {
    alerts.push({ type: "warning", message: "MID health dropped below 60." });
  }
  if (input.highRiskClusterCount >= 3) {
    alerts.push({ type: "warning", message: "Three or more high-risk transactions appeared within one hour." });
  }
  if (input.reserveRatio > 15) {
    alerts.push({ type: "info", message: "Rolling reserve exceeds 15% of monthly volume." });
  }
  if (input.disputeTrendUp) {
    alerts.push({ type: "critical", message: "Dispute velocity increased three weeks in a row." });
  }

  return alerts;
}
