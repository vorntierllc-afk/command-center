import { Analytics } from "@/components/dashboard/Analytics";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireMerchant } from "@/lib/server/auth";
import { SAMPLE_CHART_DATA } from "@/lib/server/sample-data";

export default async function AnalyticsPage() {
  await requireMerchant();

  return (
    <DashboardShell
      active="/dashboard/analytics"
      title="Analytics"
      description="Dispute ratio trend, authorization rate, volume anomaly detection, and refund ratio — across 7, 30, or 90 days."
    >
      <Analytics data={SAMPLE_CHART_DATA} />
    </DashboardShell>
  );
}
