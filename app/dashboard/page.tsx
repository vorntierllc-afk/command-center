import { Overview } from "@/components/dashboard/Overview";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getMerchantOverview } from "@/lib/server/process-state";
import { SAMPLE_ALERTS } from "@/lib/server/sample-data";
import { requireMerchant } from "@/lib/server/auth";

export default async function DashboardPage() {
  const { session } = await requireMerchant();
  const overview = await getMerchantOverview(session.userId);

  return (
    <DashboardShell
      active="/dashboard"
      title="Dashboard"
      description="Risk score, authorization health, chargeback exposure, and live alerts."
    >
      <Overview overview={overview} alerts={SAMPLE_ALERTS} />
    </DashboardShell>
  );
}
