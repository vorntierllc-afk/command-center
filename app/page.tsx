import type { Metadata } from "next";
import { LandingPage } from "@/components/hri";
import Script from "next/script";

export const metadata: Metadata = {
  title: "HighRiskIntel — Chargeback Visibility for High-Risk Merchants",
  description:
    "HighRiskIntel helps high-risk merchants track disputes, chargeback pressure, processor risk, and transaction patterns in one place so teams can act earlier.",
  alternates: { canonical: "https://highriskintel.com" },
  openGraph: {
    url: "https://highriskintel.com",
    title: "HighRiskIntel — Chargeback Visibility for High-Risk Merchants",
    description:
      "Track disputes, monitor processor risk, and surface the issues that matter before they turn into bigger account problems.",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HighRiskIntel",
  url: "https://highriskintel.com",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Chargeback and processor-risk visibility software for high-risk merchants.",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "30",
    highPrice: "200",
    priceCurrency: "USD",
    priceValidUntil: "2027-01-01",
  },
  featureList: [
    "Chargeback rate monitoring",
    "Dispute and processor-risk visibility",
    "Transaction review workflows",
    "Authorization health tracking",
    "Statement analysis",
    "Reporting for high-risk merchant teams",
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HighRiskIntel",
  url: "https://highriskintel.com",
  logo: "https://highriskintel.com/opengraph-image",
  description:
    "Software for high-risk merchants that need better visibility into disputes, chargeback pressure, and processor risk.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://highriskintel.com/contact",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a high-risk merchant account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A high-risk merchant account is a payment processing account issued to businesses that are considered higher risk by banks and processors — typically due to high chargeback rates, operating in regulated industries (supplements, adult, crypto, travel, firearms), or having recurring billing models. These accounts face stricter monitoring, higher fees, and rolling reserves.",
      },
    },
    {
      "@type": "Question",
      name: "What chargeback rate will get my merchant account terminated?",
      acceptedAnswer: {
      "@type": "Answer",
        text: "There is no single safe number for every merchant. Card-network thresholds, acquirer rules, and business model risk all matter. In practice, merchants should watch dispute ratio, dispute count, fraud signals, and processor communications together instead of relying on one published threshold.",
      },
    },
    {
      "@type": "Question",
      name: "How does HighRiskIntel prevent chargebacks?",
      acceptedAnswer: {
      "@type": "Answer",
        text: "HighRiskIntel gives merchant teams one place to review transaction patterns, dispute pressure, processor signals, and account-level risk so they can identify what needs attention earlier.",
      },
    },
    {
      "@type": "Question",
      name: "What is the MATCH list and how do I avoid it?",
      acceptedAnswer: {
      "@type": "Answer",
        text: "The MATCH list is a Mastercard-managed list used by acquiring banks to identify merchants terminated for certain risk or compliance reasons. Getting placed on MATCH can make it much harder to secure a new merchant account, which is why merchants need to watch dispute pressure and processor-risk signals early.",
      },
    },
    {
      "@type": "Question",
      name: "Which payment processors does HighRiskIntel integrate with?",
      acceptedAnswer: {
      "@type": "Answer",
        text: "HighRiskIntel supports direct processor connections where available and also supports statement-based analysis, which is useful for merchants that cannot or do not want to rely on a full API integration from day one.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <Script
        id="schema-software"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <LandingPage />
    </>
  );
}
