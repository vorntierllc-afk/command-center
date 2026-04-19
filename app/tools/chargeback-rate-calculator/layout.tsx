import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Chargeback Rate Calculator",
  description:
    "Calculate your chargeback ratio and refund rate, then request a free HighRiskIntel audit to review processor-risk signals.",
  alternates: { canonical: absoluteUrl("/tools/chargeback-rate-calculator") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/tools/chargeback-rate-calculator"),
    title: "Chargeback Rate Calculator",
    description:
      "Calculate your chargeback ratio and refund rate, then request a free HighRiskIntel audit.",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Chargeback rate calculator" }],
  },
};

export default function ChargebackRateCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
