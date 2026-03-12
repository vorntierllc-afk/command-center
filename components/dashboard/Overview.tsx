import { SampleBanner } from "@/components/shared/SampleBanner";
import { formatCurrency } from "@/lib/utils";
import type { DashboardOverview } from "@/lib/server/types";

export function Overview({ overview }: { overview: DashboardOverview }) {
  const metrics = [
    ["Total volume", formatCurrency(overview.totalVolume)],
    ["Chargeback rate", `${overview.chargebackRate.toFixed(2)}%`],
    ["Risk score", `${overview.riskScore}`],
    ["Active alerts", `${overview.activeAlerts}`],
    ["Transactions today", `${overview.transactionsToday}`],
    ["MID health", `${overview.midHealth}`]
  ];

  return (
    <div className="space-y-5">
      {overview.isSample ? <SampleBanner /> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-[1.5rem] shell-border p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
