export type HighRiskVertical = {
  slug: string;
  label: string;
  audience: string;
  intent: string;
  riskDrivers: readonly string[];
};

export type HighRiskTopic = {
  slug: string;
  label: string;
  titleSuffix: string;
  searchIntent: string;
  primaryRisk: string;
  auditFocus: readonly string[];
};

export type HighRiskSeoPage = {
  slug: string;
  title: string;
  description: string;
  vertical: HighRiskVertical;
  topic: HighRiskTopic;
  priority: number;
};

const verticals = [
  {
    slug: "peptide-merchants",
    label: "Peptide merchants",
    audience: "peptide, research wellness, and performance product merchants",
    intent: "buyers looking for safer merchant-account operations in a heavily reviewed wellness category",
    riskDrivers: ["product-claim scrutiny", "refund spikes", "processor documentation requests"],
  },
  {
    slug: "replica-goods-merchants",
    label: "Replica goods merchants",
    audience: "replica, inspired-goods, and resale merchants with strict IP and fulfillment requirements",
    intent: "buyers who need compliant payment-risk visibility around product representation and delivery proof",
    riskDrivers: ["IP-policy scrutiny", "not-as-described disputes", "fulfillment evidence gaps"],
  },
  {
    slug: "sarms-merchants",
    label: "SARMs merchants",
    audience: "SARMs, sports-performance, and research product merchants",
    intent: "operators managing refund, descriptor, and processor-review pressure in a sensitive vertical",
    riskDrivers: ["restricted-product review", "customer expectation mismatch", "payout-hold exposure"],
  },
  {
    slug: "nootropics-merchants",
    label: "Nootropics merchants",
    audience: "nootropics and cognitive wellness merchants",
    intent: "teams monitoring customer complaints, product claims, and dispute pressure",
    riskDrivers: ["claim compliance", "subscription confusion", "refund timing"],
  },
  {
    slug: "kratom-merchants",
    label: "Kratom merchants",
    audience: "kratom and botanical product merchants",
    intent: "merchants trying to keep processor relationships stable in a reviewed category",
    riskDrivers: ["policy scrutiny", "reserve increases", "shipping and refund disputes"],
  },
  {
    slug: "cbd-merchants",
    label: "CBD merchants",
    audience: "CBD, hemp, and wellness merchants",
    intent: "CBD operators looking for chargeback, refund, and reserve visibility",
    riskDrivers: ["processor policy review", "payout holds", "billing descriptor confusion"],
  },
  {
    slug: "delta-8-merchants",
    label: "Delta-8 merchants",
    audience: "delta-8, hemp-derived, and cannabinoid merchants",
    intent: "high-risk wellness teams watching account tolerance and fulfillment proof",
    riskDrivers: ["state-by-state policy pressure", "processor review", "delivery disputes"],
  },
  {
    slug: "vape-merchants",
    label: "Vape merchants",
    audience: "vape, e-cigarette, and nicotine alternative merchants",
    intent: "regulated-product sellers trying to reduce processor-risk signals",
    riskDrivers: ["age-gated category review", "shipping proof", "refund and return disputes"],
  },
  {
    slug: "supplement-merchants",
    label: "Supplement merchants",
    audience: "supplement and nutraceutical brands",
    intent: "brands managing offer clarity, refunds, and chargeback ratios",
    riskDrivers: ["health-claim review", "trial offer disputes", "refund pressure"],
  },
  {
    slug: "weight-loss-merchants",
    label: "Weight loss merchants",
    audience: "weight-loss, diet, and transformation offer merchants",
    intent: "teams reducing complaint, refund, and recurring-billing risk",
    riskDrivers: ["results-claim scrutiny", "refund dissatisfaction", "subscription disputes"],
  },
  {
    slug: "skincare-merchants",
    label: "Skincare merchants",
    audience: "skincare, beauty, and trial-offer merchants",
    intent: "operators tracking trial conversion, descriptors, and refund friction",
    riskDrivers: ["trial billing confusion", "not-recognized disputes", "support-response delays"],
  },
  {
    slug: "adult-content-merchants",
    label: "Adult content merchants",
    audience: "adult content, creator, and membership merchants",
    intent: "subscription merchants reducing privacy-driven disputes and processor review",
    riskDrivers: ["descriptor sensitivity", "recurring-billing disputes", "platform-policy review"],
  },
  {
    slug: "dating-site-merchants",
    label: "Dating site merchants",
    audience: "dating, social discovery, and membership platforms",
    intent: "membership operators watching refunds, cancellations, and friendly fraud",
    riskDrivers: ["cancellation friction", "friendly fraud", "recurring billing confusion"],
  },
  {
    slug: "gaming-merchants",
    label: "Gaming merchants",
    audience: "gaming, digital goods, and in-game purchase merchants",
    intent: "digital merchants managing friendly fraud and fulfillment evidence",
    riskDrivers: ["card-not-present disputes", "digital delivery proof", "refund abuse"],
  },
  {
    slug: "fantasy-sports-merchants",
    label: "Fantasy sports merchants",
    audience: "fantasy sports and skill-based competition platforms",
    intent: "operators monitoring disputes, account reviews, and regulated payment expectations",
    riskDrivers: ["regulated-market scrutiny", "withdrawal complaints", "support evidence gaps"],
  },
  {
    slug: "crypto-education-merchants",
    label: "Crypto education merchants",
    audience: "crypto education, signals, and research subscription merchants",
    intent: "info-product teams reducing refund disputes and risk-team questions",
    riskDrivers: ["income-claim scrutiny", "subscription disputes", "refund expectations"],
  },
  {
    slug: "nft-merchants",
    label: "NFT merchants",
    audience: "NFT, digital collectible, and token-gated commerce merchants",
    intent: "digital sellers improving fulfillment proof and dispute readiness",
    riskDrivers: ["digital delivery evidence", "price-volatility complaints", "cardholder confusion"],
  },
  {
    slug: "forex-education-merchants",
    label: "Forex education merchants",
    audience: "forex education, trading course, and signal merchants",
    intent: "regulated-adjacent education sellers managing refund and claim risk",
    riskDrivers: ["earnings-claim review", "subscription churn", "chargeback escalation"],
  },
  {
    slug: "prop-trading-merchants",
    label: "Prop trading merchants",
    audience: "prop trading challenge and evaluation merchants",
    intent: "operators reducing disputes around rules, payouts, and failed evaluations",
    riskDrivers: ["terms misunderstanding", "payout complaints", "friendly fraud"],
  },
  {
    slug: "coaching-merchants",
    label: "Coaching merchants",
    audience: "business coaching, consulting, and mentorship merchants",
    intent: "high-ticket service sellers improving evidence and refund controls",
    riskDrivers: ["high-ticket disputes", "delivery documentation", "customer expectation gaps"],
  },
  {
    slug: "online-course-merchants",
    label: "Online course merchants",
    audience: "online course, cohort, and education merchants",
    intent: "digital education teams reducing refund pressure and proof gaps",
    riskDrivers: ["access complaints", "refund dissatisfaction", "marketing-claim scrutiny"],
  },
  {
    slug: "info-product-merchants",
    label: "Info product merchants",
    audience: "info product, playbook, and digital download merchants",
    intent: "digital sellers who need clearer dispute and fulfillment records",
    riskDrivers: ["digital delivery proof", "refund abuse", "offer clarity"],
  },
  {
    slug: "dropshipping-merchants",
    label: "Dropshipping merchants",
    audience: "dropshipping, marketplace, and direct-response ecommerce merchants",
    intent: "operators trying to reduce shipping complaints and processor concern",
    riskDrivers: ["shipping delays", "not-as-described disputes", "supplier volatility"],
  },
  {
    slug: "electronics-resale-merchants",
    label: "Electronics resale merchants",
    audience: "electronics resale and refurbished device merchants",
    intent: "resellers managing fraud, returns, and delivery evidence",
    riskDrivers: ["high-ticket fraud", "return disputes", "delivery proof"],
  },
  {
    slug: "luxury-resale-merchants",
    label: "Luxury resale merchants",
    audience: "luxury resale, watch, handbag, and authenticated goods merchants",
    intent: "resale teams strengthening proof, authentication, and dispute records",
    riskDrivers: ["authenticity disputes", "high-ticket fraud", "shipment evidence"],
  },
  {
    slug: "sneaker-resale-merchants",
    label: "Sneaker resale merchants",
    audience: "sneaker resale and streetwear merchants",
    intent: "resellers watching delivery proof, authenticity disputes, and refund pressure",
    riskDrivers: ["authenticity claims", "chargeback fraud", "inventory volatility"],
  },
  {
    slug: "ticket-resale-merchants",
    label: "Ticket resale merchants",
    audience: "ticket resale and event access merchants",
    intent: "event sellers improving fulfillment evidence and cancellation workflows",
    riskDrivers: ["event cancellation disputes", "delivery proof", "refund timing"],
  },
  {
    slug: "travel-agency-merchants",
    label: "Travel agency merchants",
    audience: "travel agencies, tour operators, and booking merchants",
    intent: "travel teams monitoring cancellations, seasonal volume, and refund risk",
    riskDrivers: ["future delivery risk", "cancellation disputes", "seasonal spikes"],
  },
  {
    slug: "airline-consolidator-merchants",
    label: "Airline consolidator merchants",
    audience: "airline consolidators and high-volume travel booking merchants",
    intent: "operators reducing payout-hold pressure and refund backlog risk",
    riskDrivers: ["large-ticket volume", "delayed fulfillment", "refund backlog"],
  },
  {
    slug: "timeshare-exit-merchants",
    label: "Timeshare exit merchants",
    audience: "timeshare exit and cancellation service merchants",
    intent: "service teams documenting delivery and managing complaint risk",
    riskDrivers: ["service-outcome disputes", "high-ticket sales", "documentation gaps"],
  },
  {
    slug: "debt-relief-merchants",
    label: "Debt relief merchants",
    audience: "debt relief and financial-services merchants",
    intent: "regulated service providers tracking complaints, refunds, and documentation",
    riskDrivers: ["regulated claims", "service dissatisfaction", "processor documentation requests"],
  },
  {
    slug: "credit-repair-merchants",
    label: "Credit repair merchants",
    audience: "credit repair and credit education merchants",
    intent: "financial-service teams improving proof and refund controls",
    riskDrivers: ["regulated marketing", "recurring billing disputes", "service documentation"],
  },
  {
    slug: "telemedicine-merchants",
    label: "Telemedicine merchants",
    audience: "telemedicine and online healthcare merchants",
    intent: "healthcare commerce teams managing subscription, refund, and review risk",
    riskDrivers: ["regulated service review", "appointment disputes", "refund friction"],
  },
  {
    slug: "online-pharmacy-merchants",
    label: "Online pharmacy merchants",
    audience: "licensed online pharmacy and healthcare product merchants",
    intent: "regulated merchants monitoring policy, fulfillment, and processor-risk signals",
    riskDrivers: ["license and policy review", "shipping proof", "product complaints"],
  },
  {
    slug: "medical-spa-merchants",
    label: "Medical spa merchants",
    audience: "medical spa, aesthetics, and wellness clinic merchants",
    intent: "clinics reducing refund disputes and documentation gaps",
    riskDrivers: ["service dissatisfaction", "appointment cancellations", "high-ticket disputes"],
  },
  {
    slug: "subscription-box-merchants",
    label: "Subscription box merchants",
    audience: "subscription box and recurring ecommerce merchants",
    intent: "recurring sellers reducing cancellation friction and dispute pressure",
    riskDrivers: ["recurring billing confusion", "shipping complaints", "refund timing"],
  },
  {
    slug: "trial-offer-merchants",
    label: "Trial offer merchants",
    audience: "trial offer and continuity billing merchants",
    intent: "direct-response merchants watching conversion, cancellation, and descriptor risk",
    riskDrivers: ["trial-to-paid confusion", "not-recognized disputes", "support volume"],
  },
  {
    slug: "lead-generation-merchants",
    label: "Lead generation merchants",
    audience: "lead generation and performance marketing merchants",
    intent: "teams documenting service delivery and reducing buyer complaints",
    riskDrivers: ["quality disputes", "refund claims", "marketing-source volatility"],
  },
  {
    slug: "affiliate-offer-merchants",
    label: "Affiliate offer merchants",
    audience: "affiliate-driven ecommerce and offer merchants",
    intent: "direct-response sellers watching traffic quality and dispute trends",
    riskDrivers: ["traffic-source volatility", "claim consistency", "chargeback spikes"],
  },
  {
    slug: "digital-download-merchants",
    label: "Digital download merchants",
    audience: "digital download, template, and file-access merchants",
    intent: "digital sellers reducing access complaints and friendly fraud",
    riskDrivers: ["delivery proof", "duplicate purchases", "refund abuse"],
  },
  {
    slug: "software-subscription-merchants",
    label: "Software subscription merchants",
    audience: "software subscription and SaaS merchants",
    intent: "SaaS teams reducing billing confusion and churn-driven disputes",
    riskDrivers: ["recurring billing disputes", "cancellation friction", "support delays"],
  },
  {
    slug: "web-hosting-merchants",
    label: "Web hosting merchants",
    audience: "web hosting and infrastructure subscription merchants",
    intent: "hosting operators improving billing, abuse, and cancellation workflows",
    riskDrivers: ["service downtime complaints", "recurring billing", "abuse-related closures"],
  },
  {
    slug: "vpn-merchants",
    label: "VPN merchants",
    audience: "VPN and privacy software merchants",
    intent: "privacy software teams reducing descriptor confusion and chargeback risk",
    riskDrivers: ["privacy-sensitive descriptors", "recurring billing", "support access issues"],
  },
  {
    slug: "marketplace-merchants",
    label: "Marketplace merchants",
    audience: "multi-vendor marketplace and platform merchants",
    intent: "platform teams monitoring seller risk, refunds, and fulfillment evidence",
    riskDrivers: ["seller-quality variance", "refund complexity", "delivery proof gaps"],
  },
  {
    slug: "jewelry-merchants",
    label: "Jewelry merchants",
    audience: "jewelry, watch, and high-ticket accessory merchants",
    intent: "high-ticket sellers reducing fraud, delivery, and return disputes",
    riskDrivers: ["high-ticket fraud", "return disputes", "shipment evidence"],
  },
  {
    slug: "firearms-accessory-merchants",
    label: "Firearms accessory merchants",
    audience: "lawful firearms accessory and outdoor equipment merchants",
    intent: "regulated-product sellers monitoring policy and dispute signals",
    riskDrivers: ["policy scrutiny", "shipping restrictions", "refund disputes"],
  },
  {
    slug: "precious-metals-merchants",
    label: "Precious metals merchants",
    audience: "precious metals, bullion, and collectible coin merchants",
    intent: "high-ticket merchants improving delivery, authentication, and risk records",
    riskDrivers: ["price volatility", "shipment proof", "high-ticket fraud"],
  },
  {
    slug: "collectibles-merchants",
    label: "Collectibles merchants",
    audience: "collectibles, cards, memorabilia, and hobby merchants",
    intent: "collectible sellers reducing authenticity and fulfillment disputes",
    riskDrivers: ["authenticity disputes", "condition complaints", "delivery proof"],
  },
  {
    slug: "auction-merchants",
    label: "Auction merchants",
    audience: "auction and bidding platform merchants",
    intent: "auction teams reducing buyer remorse, fulfillment disputes, and reserve pressure",
    riskDrivers: ["buyer remorse", "item-condition disputes", "payment reversal risk"],
  },
  {
    slug: "international-merchants",
    label: "International merchants",
    audience: "cross-border and international ecommerce merchants",
    intent: "global sellers watching currency, shipping, and processor-risk signals",
    riskDrivers: ["cross-border fraud", "shipping delays", "currency confusion"],
  },
] as const satisfies readonly HighRiskVertical[];

const topics = [
  {
    slug: "chargeback-prevention",
    label: "chargeback prevention",
    titleSuffix: "Chargeback Prevention",
    searchIntent: "reduce disputes before ratios trigger processor concern",
    primaryRisk: "chargeback pressure",
    auditFocus: ["chargeback ratio", "refund rate", "descriptor confusion", "support response gaps"],
  },
  {
    slug: "payment-processor-risk",
    label: "payment processor risk",
    titleSuffix: "Payment Processor Risk",
    searchIntent: "understand whether account behavior could trigger review, holds, or reserve changes",
    primaryRisk: "processor review",
    auditFocus: ["processor notices", "volume spikes", "policy-sensitive products", "documentation readiness"],
  },
  {
    slug: "rolling-reserve-monitoring",
    label: "rolling reserve monitoring",
    titleSuffix: "Rolling Reserve Monitoring",
    searchIntent: "watch cash-flow pressure and reserve exposure before it becomes urgent",
    primaryRisk: "reserve pressure",
    auditFocus: ["reserve percentage", "payout timing", "refund backlog", "monthly processing trend"],
  },
  {
    slug: "merchant-account-shutdown-prevention",
    label: "merchant account shutdown prevention",
    titleSuffix: "Merchant Account Shutdown Prevention",
    searchIntent: "prepare evidence and operational fixes before a MID is limited or terminated",
    primaryRisk: "MID termination",
    auditFocus: ["chargeback trend", "processor escalation signals", "remediation notes", "customer evidence"],
  },
  {
    slug: "payment-gateway-problems",
    label: "payment gateway problems",
    titleSuffix: "Payment Gateway Problems",
    searchIntent: "diagnose declines, gateway flags, integration gaps, and risk-review friction",
    primaryRisk: "gateway interruption",
    auditFocus: ["decline movement", "gateway error patterns", "fraud-filter changes", "processor handoff notes"],
  },
  {
    slug: "payout-hold-risk",
    label: "payout hold risk",
    titleSuffix: "Payout Hold Risk",
    searchIntent: "understand why funds may be delayed and what evidence should be ready",
    primaryRisk: "payout holds",
    auditFocus: ["payout timing", "reserve notices", "refund exposure", "open dispute balance"],
  },
  {
    slug: "friendly-fraud-prevention",
    label: "friendly fraud prevention",
    titleSuffix: "Friendly Fraud Prevention",
    searchIntent: "reduce customer disputes caused by confusion, buyer remorse, or weak evidence",
    primaryRisk: "friendly fraud",
    auditFocus: ["customer communication", "delivery proof", "refund policy clarity", "repeat dispute reasons"],
  },
  {
    slug: "billing-descriptor-disputes",
    label: "billing descriptor disputes",
    titleSuffix: "Billing Descriptor Disputes",
    searchIntent: "stop not-recognized disputes caused by unclear statement descriptors",
    primaryRisk: "descriptor confusion",
    auditFocus: ["descriptor match", "receipt language", "support visibility", "customer reminder timing"],
  },
] as const satisfies readonly HighRiskTopic[];

export const HIGH_RISK_SEO_PAGES: readonly HighRiskSeoPage[] = verticals.flatMap((vertical) =>
  topics.map((topic) => ({
    slug: `${vertical.slug}-${topic.slug}`,
    title: `${vertical.label}: ${topic.titleSuffix} Guide`,
    description: `A practical ${topic.label} page for ${vertical.audience} focused on ${topic.primaryRisk}, ${vertical.riskDrivers[0]}, and a free HighRiskIntel risk audit.`,
    vertical,
    topic,
    priority: topic.slug === "chargeback-prevention" ? 0.78 : 0.72,
  })),
);

export function getHighRiskSeoPage(slug: string) {
  return HIGH_RISK_SEO_PAGES.find((page) => page.slug === slug);
}

export function getRelatedHighRiskSeoPages(page: HighRiskSeoPage) {
  return HIGH_RISK_SEO_PAGES.filter((candidate) => candidate.slug !== page.slug && candidate.vertical.slug === page.vertical.slug).slice(0, 4);
}
