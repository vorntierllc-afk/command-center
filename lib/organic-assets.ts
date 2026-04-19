export type OrganicAsset = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  intent: string;
  route: string;
  checklist: readonly string[];
  faq: readonly {
    question: string;
    answer: string;
  }[];
};

export const TOOL_ASSETS = [
  {
    slug: "visa-vamp-calculator",
    title: "Visa VAMP Calculator for High-Risk Merchants",
    description:
      "Estimate Visa VAMP exposure and understand whether dispute and fraud pressure may create processor-risk concerns.",
    eyebrow: "Visa VAMP tool",
    intent: "Merchants searching for Visa VAMP thresholds usually need to know whether their account is drifting toward processor escalation.",
    route: "/tools/visa-vamp-calculator",
    checklist: ["Monthly Visa transactions", "Visa dispute count", "Fraud-related dispute count", "Current processor notices"],
    faq: [
      {
        question: "What does this calculator help with?",
        answer: "It gives merchants a simple way to organize the numbers that matter before asking for a deeper risk audit.",
      },
      {
        question: "Is this a replacement for processor reporting?",
        answer: "No. It is a planning tool that helps you prepare better questions and identify risk signals to review.",
      },
    ],
  },
  {
    slug: "mid-termination-risk-checker",
    title: "MID Termination Risk Checker",
    description:
      "A practical checklist for merchants worried about account shutdown, reserve increases, payout holds, or processor review.",
    eyebrow: "MID protection tool",
    intent: "Merchants searching for MID termination help are often close to a processor review and need a fast triage path.",
    route: "/tools/mid-termination-risk-checker",
    checklist: ["Recent chargeback spike", "Reserve or payout hold notice", "Processor request for documents", "Refund backlog or support delays"],
    faq: [
      {
        question: "What is the first warning sign?",
        answer: "A sudden reserve change, payout delay, document request, or chargeback-ratio warning often means the account needs immediate review.",
      },
      {
        question: "What should I do first?",
        answer: "Collect the last 90 days of disputes, refunds, processor emails, fulfillment proof, and remediation notes.",
      },
    ],
  },
  {
    slug: "rolling-reserve-calculator",
    title: "Rolling Reserve Calculator",
    description:
      "Estimate how a rolling reserve affects available cash flow and what risk signals may cause reserve pressure.",
    eyebrow: "Reserve tool",
    intent: "Merchants searching reserve terms need to understand how much cash is being held and why processors may increase reserves.",
    route: "/tools/rolling-reserve-calculator",
    checklist: ["Monthly processing volume", "Reserve percentage", "Holdback period", "Refund and dispute exposure"],
    faq: [
      {
        question: "Why do processors use rolling reserves?",
        answer: "Processors use reserves to protect against future refunds, disputes, fraud exposure, and delivery risk.",
      },
      {
        question: "Can reserve pressure be reduced?",
        answer: "Sometimes. Merchants need cleaner dispute ratios, stronger documentation, and evidence that the risk trend is improving.",
      },
    ],
  },
  {
    slug: "refund-rate-calculator",
    title: "Refund Rate Calculator",
    description:
      "Calculate refund pressure and understand how refund spikes can interact with chargebacks and processor-risk reviews.",
    eyebrow: "Refund risk tool",
    intent: "High refund volume can signal offer, support, fulfillment, or customer expectation problems before chargebacks rise.",
    route: "/tools/refund-rate-calculator",
    checklist: ["Refund count", "Refund amount", "Sales volume", "Refund reason patterns"],
    faq: [
      {
        question: "Is a high refund rate always bad?",
        answer: "Not always, but sudden changes can make processors question offer quality, support operations, or fulfillment reliability.",
      },
      {
        question: "Why track refunds with chargebacks?",
        answer: "Refund movement often predicts customer dissatisfaction before disputes appear in processor reporting.",
      },
    ],
  },
] as const satisfies readonly OrganicAsset[];

export const RESOURCE_ASSETS = [
  {
    slug: "payment-processor-hold-checklist",
    title: "Payment Processor Hold Checklist",
    description:
      "What to gather when a processor holds funds, delays payouts, requests documents, or starts a merchant account review.",
    eyebrow: "Processor hold resource",
    intent: "Merchants searching this are usually under urgent payout pressure and need a calm documentation checklist.",
    route: "/resources/payment-processor-hold-checklist",
    checklist: ["Processor email or notice", "Recent volume change", "Open disputes and refunds", "Fulfillment and delivery proof"],
    faq: [
      {
        question: "Why is my processor holding funds?",
        answer: "Common triggers include chargeback spikes, unusual volume, documentation gaps, policy-sensitive products, or refund exposure.",
      },
      {
        question: "What should I send a processor?",
        answer: "Send concise evidence: order records, fulfillment proof, refund plan, dispute trend, support notes, and a remediation timeline.",
      },
    ],
  },
  {
    slug: "chargeback-remediation-plan-template",
    title: "Chargeback Remediation Plan Template",
    description:
      "A processor-ready framework for explaining chargeback root causes, corrective actions, owners, timelines, and expected metric changes.",
    eyebrow: "Remediation template",
    intent: "Merchants asked for a remediation plan need a serious format that does not look improvised.",
    route: "/resources/chargeback-remediation-plan-template",
    checklist: ["Root cause summary", "Chargeback reason codes", "Corrective actions", "Owner and timeline"],
    faq: [
      {
        question: "What makes a remediation plan credible?",
        answer: "Specific root causes, measurable fixes, clear owners, and evidence that the merchant is already reducing the issue.",
      },
      {
        question: "Should the plan be long?",
        answer: "No. It should be clear, evidence-backed, and organized around what the processor needs to evaluate.",
      },
    ],
  },
  {
    slug: "billing-descriptor-checklist",
    title: "Billing Descriptor Checklist",
    description:
      "Reduce not-recognized disputes by checking statement descriptors, receipts, reminder emails, support visibility, and customer language.",
    eyebrow: "Descriptor resource",
    intent: "Descriptor confusion is one of the simplest preventable causes of friendly-fraud and not-recognized disputes.",
    route: "/resources/billing-descriptor-checklist",
    checklist: ["Statement descriptor", "Receipt business name", "Customer support email", "Renewal reminder language"],
    faq: [
      {
        question: "Why do descriptors cause chargebacks?",
        answer: "Customers dispute charges when the name on their bank statement does not match the brand, receipt, or product they remember.",
      },
      {
        question: "What should merchants fix first?",
        answer: "Align the statement descriptor, checkout brand, receipt copy, support contact, and renewal reminders.",
      },
    ],
  },
  {
    slug: "chargeback-evidence-checklist",
    title: "Chargeback Evidence Checklist",
    description:
      "A practical evidence checklist for merchants preparing dispute responses and processor-risk documentation.",
    eyebrow: "Evidence resource",
    intent: "Merchants fighting disputes need to organize proof before response windows or processor reviews become urgent.",
    route: "/resources/chargeback-evidence-checklist",
    checklist: ["Order details", "Customer communication", "Fulfillment proof", "Refund and policy records"],
    faq: [
      {
        question: "What evidence is most useful?",
        answer: "Evidence that directly answers the dispute reason: delivery proof, usage logs, communication, refund policy, and customer acknowledgment.",
      },
      {
        question: "Does better evidence reduce processor risk?",
        answer: "It helps. Strong evidence shows the merchant understands the issue and has a repeatable process for handling disputes.",
      },
    ],
  },
] as const satisfies readonly OrganicAsset[];

export const ORGANIC_ASSETS = [...TOOL_ASSETS, ...RESOURCE_ASSETS] as const;

export function getToolAsset(slug: string) {
  return TOOL_ASSETS.find((asset) => asset.slug === slug);
}

export function getResourceAsset(slug: string) {
  return RESOURCE_ASSETS.find((asset) => asset.slug === slug);
}
