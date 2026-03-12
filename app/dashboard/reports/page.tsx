import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Reports } from "@/components/dashboard/Reports";
import { requireMerchant } from "@/lib/server/auth";

export default async function ReportsPage() {
  await requireMerchant();

  return (
    <DashboardShell active="/dashboard/reports" title="Reports" description="Generate operator-ready weekly summaries and historical reporting.">
      <Reports />
    </DashboardShell>
  );
}
