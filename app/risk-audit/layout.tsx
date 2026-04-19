import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free Chargeback Risk Audit",
  description:
    "Request a free chargeback and processor-risk audit for your high-risk merchant account. Review dispute ratio, refund timing, authorization trends, and account pressure.",
  alternates: { canonical: absoluteUrl("/risk-audit") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/risk-audit"),
    title: "Free Chargeback Risk Audit",
    description:
      "Request a free chargeback and processor-risk audit for your high-risk merchant account.",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Free HighRiskIntel risk audit" }],
  },
};

export default function RiskAuditLayout({ children }: { children: React.ReactNode }) {
  return children;
}

