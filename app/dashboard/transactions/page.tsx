import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Transactions } from "@/components/dashboard/Transactions";
import { prisma } from "@/lib/server/prisma";
import { requireMerchant } from "@/lib/server/auth";

export default async function TransactionsPage() {
  const { merchant } = await requireMerchant();
  const transactions = await prisma.transaction.findMany({
    where: { merchantId: merchant.id },
    take: 20,
    orderBy: { createdAt: "desc" }
  });

  return (
    <DashboardShell active="/dashboard/transactions" title="Transactions" description="Review transaction risk, dispute markers, and approval outcomes.">
      <Transactions transactions={transactions} />
    </DashboardShell>
  );
}
