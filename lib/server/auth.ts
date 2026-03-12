import { redirect } from "next/navigation";
import { prisma } from "@/lib/server/prisma";
import { getCurrentSession } from "@/lib/server/session";

export async function requireUser() {
  const session = getCurrentSession();
  if (!session) {
    redirect("/signin");
  }
  return session;
}

export async function requireMerchant() {
  const session = await requireUser();
  const merchant = await prisma.merchant.findFirst({
    where: { userId: session.userId }
  });

  if (!merchant) {
    redirect("/onboarding");
  }

  return { session, merchant };
}
