import type { Metadata } from "next";
import { OrganicLanding } from "@/components/marketing/OrganicLanding";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Chargeback Prevention for Subscription Merchants",
  description:
    "Monitor subscription chargebacks, cancellation issues, refund timing, and processor-risk signals for recurring-billing merchants.",
  alternates: { canonical: absoluteUrl("/industries/subscription-merchants") },
};

export default function SubscriptionMerchantsPage() {
  return (
    <OrganicLanding
      eyebrow="Subscription merchants"
      title="Reduce subscription chargebacks before they become processor risk"
      description="Recurring billing merchants need to watch cancellation friction, refund timing, descriptor confusion, and repeat dispute patterns. HighRiskIntel organizes those signals so teams know what to fix first."
      audience="Subscription, trial, membership, SaaS, and continuity merchants"
      painPoints={[
        "Customers dispute recurring charges when cancellation or descriptor details are unclear.",
        "Refund and support delays increase the chance of a preventable chargeback.",
        "Dispute patterns can change quickly after pricing, offer, or traffic-source changes.",
        "Processor conversations require clear evidence of what has been fixed.",
      ]}
      auditChecks={[
        "Recurring-billing dispute patterns",
        "Refund and cancellation timing",
        "Descriptor and support workflow issues",
        "Processor-risk escalation signals",
      ]}
      relatedLinks={[
        { label: "Free risk audit", href: "/risk-audit" },
        { label: "Chargeback prevention playbook", href: "/blog/chargeback-prevention-high-risk-merchants" },
        { label: "Chargeback rate calculator", href: "/tools/chargeback-rate-calculator" },
      ]}
    />
  );
}
