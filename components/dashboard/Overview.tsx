import { SampleBanner } from "@/components/shared/SampleBanner";
import { formatCurrency } from "@/lib/utils";
import type { DashboardOverview, AlertWithMitigations } from "@/lib/server/types";

function RiskBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    stable: "bg-green-500/15 text-green-400 ring-1 ring-green-500/30",
    elevated: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30",
    critical: "bg-red-500/15 text-red-400 ring-1 ring-red-500/30"
  };
  const labels: Record<string, string> = { stable: "Stable", elevated: "Elevated", critical: "Critical" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${colors[status] ?? colors.stable}`}>
      {labels[status] ?? "Stable"}
    </span>
  );
}

function AlertSeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    critical: "bg-red-500/15 text-red-400 ring-1 ring-red-500/30",
    warning: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30",
    low: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30",
    info: "bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/30"
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${styles[severity] ?? styles.info}`}>
      {severity}
    </span>
  );
}

function MetricCard({
  label,
  value,
  sub,
  accent
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "green" | "amber" | "red" | "blue";
}) {
  const accentBorder: Record<string, string> = {
    green: "border-t-green-500/60",
    amber: "border-t-amber-500/60",
    red: "border-t-red-500/60",
    blue: "border-t-blue-500/60"
  };
  const border = accent ? `border-t-2 ${accentBorder[accent]}` : "";
  return (
    <div className={`rounded-[1.5rem] shell-border p-5 ${border}`}>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      {sub && <p className="mt-1.5 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export function Overview({
  overview,
  alerts
}: {
  overview: DashboardOverview;
  alerts: AlertWithMitigations[];
}) {
  const trendSign = overview.riskTrend > 0 ? "+" : "";
  const trendColor = overview.riskTrend > 0 ? "text-red-400" : "text-green-400";
  const authDeviationColor = overview.authDeviation < 0 ? "text-red-400" : "text-green-400";
  const disputeWarningColor =
    overview.disputeRatio >= 1.0 ? "text-red-400" :
    overview.disputeRatio >= 0.9 ? "text-amber-400" :
    "text-green-400";

  return (
    <div className="space-y-6">
      {overview.isSample && <SampleBanner />}

      {/* Row 1: Risk Score + Auth Health + Chargeback */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Risk Score – primary card */}
        <div className="rounded-[1.75rem] shell-border border-t-2 border-t-blue-500/50 p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Merchant Risk Score
            </p>
            <RiskBadge status={overview.riskStatus} />
          </div>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-5xl font-bold text-white">{overview.riskScore}</span>
            <span className="mb-1 text-lg text-slate-500">/&nbsp;100</span>
          </div>
          <p className={`mt-2 text-sm font-medium ${trendColor}`}>
            {trendSign}{overview.riskTrend} pts vs last 30 days
          </p>
          <div className="mt-4 h-1.5 w-full rounded-full bg-slate-800">
            <div
              className={`h-1.5 rounded-full transition-all ${
                overview.riskScore >= 71 ? "bg-red-500" :
                overview.riskScore >= 41 ? "bg-amber-500" : "bg-green-500"
              }`}
              style={{ width: `${overview.riskScore}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-slate-600">
            <span>0 Stable</span>
            <span>41 Elevated</span>
            <span>71 Critical</span>
          </div>
        </div>

        {/* Authorization Health */}
        <div className="rounded-[1.75rem] shell-border border-t-2 border-t-amber-500/50 p-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Authorization Health
          </p>
          <p className="mt-4 text-3xl font-semibold text-white">
            {overview.authApprovalRate.toFixed(1)}%
          </p>
          <p className="mt-1 text-xs text-slate-500">Approval rate</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Decline rate</span>
              <span className="text-sm font-medium text-white">{overview.authDeclineRate.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">vs 7-day avg</span>
              <span className={`text-sm font-semibold ${authDeviationColor}`}>
                {overview.authDeviation > 0 ? "+" : ""}{overview.authDeviation.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800">
            <div
              className="h-1.5 rounded-full bg-amber-500"
              style={{ width: `${overview.authApprovalRate}%` }}
            />
          </div>
        </div>

        {/* Chargeback Exposure */}
        <div className="rounded-[1.75rem] shell-border border-t-2 border-t-red-500/50 p-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Chargeback Exposure
          </p>
          <p className={`mt-4 text-3xl font-semibold ${disputeWarningColor}`}>
            {overview.disputeRatio.toFixed(2)}%
          </p>
          <p className="mt-1 text-xs text-slate-500">Rolling dispute ratio</p>
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${overview.disputeRatio >= 0.9 ? "bg-amber-500" : "bg-slate-700"}`} />
              <span className="text-xs text-slate-500">Warning threshold: 0.9%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${overview.disputeRatio >= 1.0 ? "bg-red-500" : "bg-slate-700"}`} />
              <span className="text-xs text-slate-500">Monitoring threshold: 1.0%</span>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800">
            <div
              className={`h-1.5 rounded-full ${
                overview.disputeRatio >= 1.0 ? "bg-red-500" :
                overview.disputeRatio >= 0.9 ? "bg-amber-500" : "bg-green-500"
              }`}
              style={{ width: `${Math.min(100, overview.disputeRatio * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Volume & Other Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Volume"
          value={formatCurrency(overview.totalVolume)}
          sub="Current period"
          accent="blue"
        />
        <MetricCard
          label="Transactions Today"
          value={overview.transactionsToday.toString()}
          sub={`Volume spike: ${overview.volumeSpike.toFixed(1)}x`}
          accent={overview.volumeSpike >= 2 ? "red" : overview.volumeSpike >= 1.5 ? "amber" : "green"}
        />
        <MetricCard
          label="MID Health"
          value={`${overview.midHealth}`}
          sub={`Refund ratio: ${overview.refundRatio.toFixed(1)}%`}
          accent={overview.midHealth < 40 ? "red" : overview.midHealth < 60 ? "amber" : "green"}
        />
        <MetricCard
          label="Reserve Balance"
          value={formatCurrency(overview.reserveAmount)}
          sub={`Cross-border: ${overview.crossBorderRatio.toFixed(0)}%`}
          accent="blue"
        />
      </div>

      {/* Alerts Feed */}
      {alerts.length > 0 && (
        <div className="rounded-[1.75rem] shell-border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Alerts Feed</h2>
            <a href="/dashboard/alerts" className="text-xs text-blue-400 hover:text-blue-300">
              View all →
            </a>
          </div>
          <div className="space-y-4">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="rounded-2xl bg-slate-900/60 p-4">
                <div className="flex items-start gap-3">
                  <AlertSeverityBadge severity={alert.severity} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{alert.message}</p>
                    <p className="mt-0.5 text-xs text-slate-600">{alert.createdAt}</p>
                    {alert.mitigations.length > 0 && (
                      <div className="mt-3">
                        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                          Recommended actions
                        </p>
                        <ul className="space-y-1">
                          {alert.mitigations.slice(0, 3).map((m, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                              <span className="mt-0.5 text-blue-500 shrink-0">→</span>
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
