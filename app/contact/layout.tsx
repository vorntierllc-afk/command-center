import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact HighRiskIntel",
  description:
    "Contact HighRiskIntel for pricing, integration help, support, partnerships, and high-risk merchant risk intelligence questions.",
  alternates: { canonical: absoluteUrl("/contact") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/contact"),
    title: "Contact HighRiskIntel",
    description:
      "Contact HighRiskIntel for pricing, integration help, support, partnerships, and high-risk merchant risk intelligence questions.",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Contact HighRiskIntel" }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

