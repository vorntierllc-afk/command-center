import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/session";
import { getMerchantOverview } from "@/lib/server/process-state";

export async function GET() {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const overview = await getMerchantOverview(session.userId);
  return NextResponse.json(overview);
}
