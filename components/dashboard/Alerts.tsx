import type { AlertWithMitigations } from "@/lib/server/types";

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    critical: "bg-red-500/15 text-red-400 ring-1 ring-red-500/30",
    warning: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30",
    low: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30",
    info: "bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/30"
  };
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${styles[severity] ?? styles.info}`}>
      {severity}
    </span>
  );
}

function typeLabel(type: string): string {
  const labels: Record<string, string> = {
    chargeback_spike: "Chargeback Spike",
    auth_drop: "Authorization Drop",
    volume_anomaly: "Volume Anomaly",
    refund_latency: "Refund Latency",
    reserve_alert: "Reserve Alert",
    mid_risk: "MID Risk"
  };
  return labels[type] ?? type.replace(/_/g, " ");
}

interface AlertRow {
  id: string;
  type: string;
  message: string;
  read?: boolean;
  resolved?: boolean;
  metadata?: unknown;
  createdAt: Date | string;
  severity?: string;
  mitigations?: string[];
}

const MITIGATION_MAP: Record<string, string[]> = {
  chargeback_spike: [
    "Pause high-risk product SKUs temporarily",
    "Issue pre-emptive refunds on orders older than 60 days",
    "Enable 3DS on all new transactions",
    "Contact processor risk team immediately"
  ],
  auth_drop: [
    "Enable 3DS authentication on flagged BIN ranges",
    "Review decline reason codes for patterns",
    "Tighten transaction limits on affected segments"
  ],
  volume_anomaly: [
    "Enable velocity controls on repeat buyers",
    "Reduce traffic from high-risk geographies",
    "Temporarily lower single-transaction limit"
  ],
  refund_latency: [
    "Process outstanding refund queue within 24 hours",
    "Set auto-refund rule for orders older than 45 days",
    "Notify affected customers proactively to reduce disputes"
  ],
  reserve_alert: [
    "Review reserve agreement terms with processor",
    "Model reserve release schedule for next 30 days"
  ],
  mid_risk: [
    "Immediately reduce chargeback ratio below 0.9%",
    "Contact processor account manager",
    "Document dispute prevention steps taken"
  ]
};

export function Alerts({ alerts }: { alerts: AlertRow[] }) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-[1.75rem] shell-border p-10 text-center">
        <p className="text-slate-400">No active alerts. Your merchant profile looks healthy.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => {
        const severity = (alert as AlertWithMitigations).severity ?? alert.type;
        const mitigations = (alert as AlertWithMitigations).mitigations ?? MITIGATION_MAP[alert.type] ?? [];
        const createdAt = typeof alert.createdAt === "string"
          ? alert.createdAt
          : new Date(alert.createdAt).toLocaleString();

        return (
          <div key={alert.id} className="rounded-[1.75rem] shell-border p-5">
            <div className="flex items-start gap-3">
              <SeverityBadge severity={severity} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-slate-500">{typeLabel(alert.type)}</p>
                  <p className="text-xs text-slate-600 shrink-0">{createdAt}</p>
                </div>
                <p className="mt-1.5 text-sm text-white">{alert.message}</p>

                {mitigations.length > 0 && (
                  <div className="mt-4 rounded-xl bg-slate-900/70 px-4 py-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Recommended actions
                    </p>
                    <ul className="space-y-1.5">
                      {mitigations.map((m, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                          <span className="mt-0.5 shrink-0 font-bold text-blue-500">→</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
