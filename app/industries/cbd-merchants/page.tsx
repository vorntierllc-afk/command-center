import type { Metadata } from "next";
import { OrganicLanding } from "@/components/marketing/OrganicLanding";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Chargeback Prevention for CBD Merchants",
  description:
    "Processor-risk and chargeback monitoring for CBD and high-risk wellness merchants dealing with disputes, reserves, and account scrutiny.",
  alternates: { canonical: absoluteUrl("/industries/cbd-merchants") },
};

export default function CbdMerchantsPage() {
  return (
    <OrganicLanding
      eyebrow="CBD merchants"
      title="Chargeback and processor-risk visibility for CBD merchants"
      description="CBD merchants need clear dispute, refund, reserve, and processor-risk visibility because account tolerance can change quickly. HighRiskIntel helps teams identify what deserves attention first."
      audience="CBD, hemp, wellness, and other high-risk product merchants"
      painPoints={[
        "Processors may apply stricter scrutiny to product claims, refund behavior, and dispute trends.",
        "Reserve and payout changes can create cash-flow pressure.",
        "Customer confusion around fulfillment, subscriptions, or descriptors can turn into disputes.",
        "Teams need a clean operating record before processor risk escalates.",
      ]}
      auditChecks={[
        "Chargeback and refund trend",
        "Reserve and payout pressure",
        "Descriptor and customer-service risk",
        "Processor-risk documentation gaps",
      ]}
      relatedLinks={[
        { label: "Free risk audit", href: "/risk-audit" },
        { label: "High-risk merchant guide", href: "/blog/high-risk-merchant-guide" },
        { label: "Chargeback prevention playbook", href: "/blog/chargeback-prevention-high-risk-merchants" },
      ]}
    />
  );
}
