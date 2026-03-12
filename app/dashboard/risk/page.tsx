import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { RiskMonitor } from "@/components/dashboard/RiskMonitor";
import { requireMerchant } from "@/lib/server/auth";

export default async function RiskPage() {
  await requireMerchant();

  return (
    <DashboardShell active="/dashboard/risk" title="Risk monitoring" description="Understand how transaction behavior, buyer geography, and velocity affect the merchant.">
      <RiskMonitor />
    </DashboardShell>
  );
}
