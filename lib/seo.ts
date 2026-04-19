export const SITE_URL = "https://highriskintel.com";

export const SITE_NAME = "HighRiskIntel";

export const DEFAULT_OG_IMAGE = "/opengraph-image";

export const PUBLIC_ROUTES = [
  "",
  "/product",
  "/pricing",
  "/security",
  "/docs",
  "/blog",
  "/blog/what-is-chargeback-threshold",
  "/blog/how-to-prevent-mid-termination",
  "/blog/high-risk-merchant-guide",
  "/blog/chargeback-prevention-high-risk-merchants",
  "/blog/visa-vamp-2026-guide",
  "/blog/ethoca-verifi-chargeback-alerts",
  "/blog/mid-termination-warning-signs",
  "/blog/chargeback-remediation-plan",
  "/blog/rolling-reserve-explained",
  "/blog/payment-processor-hold",
  "/blog/friendly-fraud-prevention",
  "/blog/billing-descriptor-chargebacks",
  "/blog/high-risk-merchant-account-shutdown",
  "/risk-audit",
  "/high-risk",
  "/llms.txt",
  "/ai.txt",
  "/tools/chargeback-rate-calculator",
  "/industries/supplement-merchants",
  "/industries/subscription-merchants",
  "/industries/travel-merchants",
  "/industries/cbd-merchants",
  "/contact",
  "/privacy",
  "/terms",
] as const;

export const BLOG_POSTS = [
  {
    slug: "chargeback-remediation-plan",
    title: "How to Write a Chargeback Remediation Plan Your Processor Will Take Seriously",
    description:
      "A practical guide to building a chargeback remediation plan with metrics, root causes, fixes, owners, and timelines before your processor escalates.",
    datePublished: "2026-04-19",
    dateModified: "2026-04-19",
    tag: "Processor Risk",
    readTime: "9 min read",
    priority: 0.92,
  },
  {
    slug: "rolling-reserve-explained",
    title: "Rolling Reserve Explained: What High-Risk Merchants Need to Watch",
    description:
      "Learn how rolling reserves affect cash flow, why processors use them, and which warning signs merchants should monitor before reserve pressure gets worse.",
    datePublished: "2026-04-19",
    dateModified: "2026-04-19",
    tag: "Reserves",
    readTime: "8 min read",
    priority: 0.9,
  },
  {
    slug: "payment-processor-hold",
    title: "Payment Processor Holding Funds? What High-Risk Merchants Should Check First",
    description:
      "A focused checklist for merchants dealing with payout holds, reserve changes, processor questions, or sudden account review.",
    datePublished: "2026-04-19",
    dateModified: "2026-04-19",
    tag: "Processor Holds",
    readTime: "8 min read",
    priority: 0.9,
  },
  {
    slug: "friendly-fraud-prevention",
    title: "Friendly Fraud Prevention for High-Risk Merchants",
    description:
      "How to reduce friendly fraud by fixing billing descriptors, customer communication, refund timing, fulfillment proof, and subscription confusion.",
    datePublished: "2026-04-19",
    dateModified: "2026-04-19",
    tag: "Friendly Fraud",
    readTime: "8 min read",
    priority: 0.88,
  },
  {
    slug: "billing-descriptor-chargebacks",
    title: "Billing Descriptor Chargebacks: How Confusion Turns Into Disputes",
    description:
      "Learn why unclear billing descriptors create chargebacks and what merchants can do to reduce not-recognized disputes.",
    datePublished: "2026-04-19",
    dateModified: "2026-04-19",
    tag: "Descriptors",
    readTime: "7 min read",
    priority: 0.86,
  },
  {
    slug: "high-risk-merchant-account-shutdown",
    title: "What to Do If Your High-Risk Merchant Account Might Be Shut Down",
    description:
      "A practical first-response guide for merchants facing processor review, elevated chargebacks, payout holds, or possible account shutdown.",
    datePublished: "2026-04-19",
    dateModified: "2026-04-19",
    tag: "MID Protection",
    readTime: "9 min read",
    priority: 0.9,
  },
  {
    slug: "chargeback-prevention-high-risk-merchants",
    title: "Chargeback Prevention for High-Risk Merchants: The 2026 Playbook",
    description:
      "A practical 2026 playbook for high-risk merchants to reduce chargebacks, monitor Visa VAMP and Mastercard ECP exposure, use alerts, and protect their MID.",
    datePublished: "2026-04-07",
    dateModified: "2026-04-07",
    tag: "Chargeback Prevention",
    readTime: "14 min read",
    priority: 0.95,
  },
  {
    slug: "visa-vamp-2026-guide",
    title: "Visa VAMP 2026 Guide: Thresholds, Formula, and Merchant Action Plan",
    description:
      "Understand Visa's VAMP ratio, April 2026 merchant thresholds, enumeration monitoring, and the operational steps merchants should take before enforcement creates processor risk.",
    datePublished: "2026-04-07",
    dateModified: "2026-04-07",
    tag: "Visa VAMP",
    readTime: "9 min read",
    priority: 0.9,
  },
  {
    slug: "ethoca-verifi-chargeback-alerts",
    title: "Ethoca vs Verifi Alerts: How High-Risk Merchants Stop Disputes Early",
    description:
      "Learn how Ethoca Alerts, Verifi CDRN, RDR, and dispute deflection help high-risk merchants resolve disputes before they become chargebacks.",
    datePublished: "2026-04-07",
    dateModified: "2026-04-07",
    tag: "Dispute Alerts",
    readTime: "8 min read",
    priority: 0.88,
  },
  {
    slug: "mid-termination-warning-signs",
    title: "MID Termination Warning Signs: 12 Signals Your Processor Is Getting Nervous",
    description:
      "Spot the early warning signs of processor risk before a reserve hike, rolling hold, or MID termination notice catches your high-risk business off guard.",
    datePublished: "2026-04-07",
    dateModified: "2026-04-07",
    tag: "MID Protection",
    readTime: "8 min read",
    priority: 0.88,
  },
  {
    slug: "what-is-chargeback-threshold",
    title: "Visa & Mastercard Chargeback Thresholds Explained (2026)",
    description:
      "Visa's chargeback threshold is 1.8% (termination). Mastercard's is 1.0%. Learn what the thresholds are, what happens when you breach them, and how to stay safe.",
    datePublished: "2026-04-05",
    dateModified: "2026-04-05",
    tag: "Chargebacks",
    readTime: "6 min read",
    priority: 0.85,
  },
  {
    slug: "how-to-prevent-mid-termination",
    title: "How to Prevent MID Termination: 9 Steps That Actually Work",
    description:
      "MID termination is almost always preventable. Learn 9 specific actions high-risk merchants can take to protect their merchant account from processor shutdown.",
    datePublished: "2026-04-03",
    dateModified: "2026-04-03",
    tag: "MID Protection",
    readTime: "8 min read",
    priority: 0.85,
  },
  {
    slug: "high-risk-merchant-guide",
    title: "The Complete Guide to High-Risk Merchant Accounts in 2026",
    description:
      "Learn what makes a merchant account high-risk, which industries qualify, how to find a processor, what fees to expect, and how to keep your account alive.",
    datePublished: "2026-04-01",
    dateModified: "2026-04-01",
    tag: "Getting Started",
    readTime: "10 min read",
    priority: 0.85,
  },
] as const;

export function absoluteUrl(path = "") {
  return `${SITE_URL}${path}`;
}
