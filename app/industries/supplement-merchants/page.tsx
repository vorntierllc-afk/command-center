import type { Metadata } from "next";
import { OrganicLanding } from "@/components/marketing/OrganicLanding";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Chargeback Prevention for Supplement Merchants",
  description:
    "Chargeback and processor-risk monitoring for supplement, nutraceutical, and wellness merchants dealing with refunds, subscription issues, and dispute pressure.",
  alternates: { canonical: absoluteUrl("/industries/supplement-merchants") },
};

export default function SupplementMerchantsPage() {
  return (
    <OrganicLanding
      eyebrow="Supplement merchants"
      title="Chargeback prevention for supplement and nutraceutical merchants"
      description="Supplement brands often deal with subscription confusion, refund timing, fulfillment complaints, and processor scrutiny. HighRiskIntel helps operators see the account signals that need attention before chargebacks become a bigger problem."
      audience="Supplement, nutraceutical, wellness, and continuity-offer merchants"
      painPoints={[
        "Customers forget subscription terms or do not recognize the billing descriptor.",
        "Refund delays turn support tickets into preventable disputes.",
        "A new campaign or affiliate source changes dispute behavior quickly.",
        "Processors may ask for remediation before the team has a clean report ready.",
      ]}
      auditChecks={[
        "Dispute ratio and chargeback trend",
        "Refund timing and cancellation pressure",
        "Descriptor and recurring-billing risk",
        "Processor-risk notes and remediation gaps",
      ]}
      relatedLinks={[
        { label: "Free risk audit", href: "/risk-audit" },
        { label: "Chargeback rate calculator", href: "/tools/chargeback-rate-calculator" },
        { label: "MID termination warning signs", href: "/blog/mid-termination-warning-signs" },
      ]}
    />
  );
}
