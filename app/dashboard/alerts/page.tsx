import { Alerts } from "@/components/dashboard/Alerts";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { prisma } from "@/lib/server/prisma";
import { requireMerchant } from "@/lib/server/auth";

export default async function AlertsPage() {
  const { merchant } = await requireMerchant();
  const alerts = await prisma.alert.findMany({
    where: { merchantId: merchant.id },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return (
    <DashboardShell active="/dashboard/alerts" title="Alerts" description="Focus on chargeback spikes, MID health pressure, and risk anomalies.">
      <Alerts alerts={alerts} />
    </DashboardShell>
  );
}
