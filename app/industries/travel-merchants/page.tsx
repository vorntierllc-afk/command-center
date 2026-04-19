import type { Metadata } from "next";
import { OrganicLanding } from "@/components/marketing/OrganicLanding";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Chargeback Prevention for Travel Merchants",
  description:
    "Chargeback and processor-risk visibility for travel merchants dealing with cancellations, delayed fulfillment, refunds, and dispute spikes.",
  alternates: { canonical: absoluteUrl("/industries/travel-merchants") },
};

export default function TravelMerchantsPage() {
  return (
    <OrganicLanding
      eyebrow="Travel merchants"
      title="Chargeback monitoring for travel and booking merchants"
      description="Travel merchants face disputes from cancellations, delays, fulfillment gaps, and customer-service bottlenecks. HighRiskIntel helps teams track the signals that can become processor risk."
      audience="Travel agencies, booking businesses, tours, ticketing, and reservation merchants"
      painPoints={[
        "Cancellation windows and refund timelines create customer frustration.",
        "Seasonal volume spikes can change dispute behavior quickly.",
        "Fulfillment and delivery proof is often spread across several systems.",
        "Processors may react to risk changes before the team has a clean explanation ready.",
      ]}
      auditChecks={[
        "Cancellation and refund pressure",
        "Dispute ratio trend",
        "Fulfillment and documentation gaps",
        "Processor-risk signals from recent volume changes",
      ]}
      relatedLinks={[
        { label: "Free risk audit", href: "/risk-audit" },
        { label: "MID termination warning signs", href: "/blog/mid-termination-warning-signs" },
        { label: "Visa VAMP guide", href: "/blog/visa-vamp-2026-guide" },
      ]}
    />
  );
}
