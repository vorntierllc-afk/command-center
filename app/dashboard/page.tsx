import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Overview } from "@/components/dashboard/Overview";
import { requireUser } from "@/lib/server/auth";
import { getMerchantOverview } from "@/lib/server/process-state";

export default async function DashboardPage() {
  const session = await requireUser();
  const overview = await getMerchantOverview(session.userId);

  return (
    <DashboardShell active="/dashboard" title="Merchant dashboard" description="Monitor processing health, approval quality, disputes, and reserve pressure.">
      <Overview overview={overview} />
    </DashboardShell>
  );
}
