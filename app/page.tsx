import type { Metadata } from "next";
import { LandingPage } from "@/components/hri";

export const metadata: Metadata = {
  title: "HighRiskIntel — Risk Intelligence for High-Risk Merchants",
  description:
    "Stop losing revenue to chargebacks. HighRiskIntel monitors every transaction 24/7, predicts MID termination 30 days out, and delivers action-ready risk intelligence for high-risk merchants.",
  alternates: { canonical: "https://highriskintel.com" },
  openGraph: {
    url: "https://highriskintel.com",
    title: "HighRiskIntel — Risk Intelligence for High-Risk Merchants",
    description:
      "Stop losing revenue to chargebacks. Monitor authorization health, track chargeback exposure, and protect your MID."
  }
};

export default function HomePage() {
  return <LandingPage />;
}
