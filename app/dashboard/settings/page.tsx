import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Settings } from "@/components/dashboard/Settings";
import { requireMerchant } from "@/lib/server/auth";

export default async function SettingsPage() {
  await requireMerchant();

  return (
    <DashboardShell active="/dashboard/settings" title="Settings" description="Update merchant profile details, processor credentials, and alert settings.">
      <Settings />
    </DashboardShell>
  );
}
