import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "High-Risk Payment Solutions | US, Offshore & Crypto-Backed | HighRiskIntel",
  description:
    "Payment solution support for high-risk merchants: US-backed processing, offshore merchant accounts, backup MID planning, crypto-backed settlement, and processor-ready underwriting documentation.",
  keywords: [
    "high-risk payment solutions",
    "offshore merchant account",
    "crypto backed payment solutions",
    "backup MID",
    "high risk payment processing",
    "high risk merchant account",
  ],
  alternates: { canonical: absoluteUrl("/payment-solutions") },
};

const routeTable = [
  {
    route: "US-backed processing",
    bestFor: "Merchants declined once or twice but with improving dispute data",
    fees: "2.5–4.5%",
    reserve: "5–10%",
    payoutSpeed: "2–5 days",
  },
  {
    route: "Offshore merchant account",
    bestFor: "Verticals domestic banks will not approve: supplements, nutraceuticals, adult, replica, gaming",
    fees: "3.5–6%",
    reserve: "10–15%",
    payoutSpeed: "7–30 days",
  },
  {
    route: "Backup MID",
    bestFor: "Any merchant running on a single processor with no continuity plan",
    fees: "Same as primary",
    reserve: "Varies",
    payoutSpeed: "Same as primary",
  },
  {
    route: "Crypto-backed settlement",
    bestFor: "Digital goods, international B2B, or merchants where chargeback rights can be waived",
    fees: "0.5–2%",
    reserve: "None typically",
    payoutSpeed: "Real-time or T+1",
  },
];

const underwritingDocs = [
  {
    doc: "Business registration + EIN",
    why: "Processors verify legal entity, ownership, and tax standing before approval.",
  },
  {
    doc: "Processing history (3–6 months)",
    why: "Shows chargeback ratio, refund ratio, volume trend, and authorization rate to underwriting.",
  },
  {
    doc: "Bank statements",
    why: "Confirms financial health, reserve capacity, and that the business can absorb a hold.",
  },
  {
    doc: "Refund and return policy",
    why: "Underwriters check that the policy reduces chargeback exposure — vague policies are a rejection flag.",
  },
  {
    doc: "Fulfillment evidence",
    why: "Shipping confirmations, delivery tracking, or digital delivery logs showing the product was delivered.",
  },
  {
    doc: "Descriptor and website review",
    why: "Processor checks that the website matches the MCC, billing descriptor matches what customers expect, and terms are visible.",
  },
  {
    doc: "Chargeback remediation plan (if ratio elevated)",
    why: "A written plan showing what caused the ratio increase and what controls are already in place.",
  },
  {
    doc: "Prior termination explanation (if applicable)",
    why: "Processors check MATCH/TMF. A clear explanation of what happened and what changed is required — silence kills applications.",
  },
];

const faqItems = [
  {
    q: "What is the difference between US-backed and offshore processing for a high-risk merchant?",
    a: "US-based acquiring banks and ISOs operate under domestic banking regulations and card network rules. Offshore processors are incorporated outside the US — common jurisdictions include Cayman Islands, Malta, Cyprus, Seychelles, and Belize. US processors typically have lower fees and faster payouts but decline many high-risk verticals. Offshore processors accept higher-risk categories but charge more and hold reserves longer. The right choice depends on your vertical, dispute history, and how urgently you need processing continuity.",
  },
  {
    q: "How long does a rolling reserve stay locked with an offshore processor?",
    a: "Standard offshore rolling reserves are 10–15% of gross volume held for 180 days on a rolling basis. That means if you process $100K in January, roughly $10–15K is released in July. Some processors negotiate a step-down where the reserve rate drops after 6–12 months of clean history. Always read the reserve release terms before signing — some processors lock reserves for 12–24 months or tie release to specific chargeback targets.",
  },
  {
    q: "Can I use crypto-backed payments to avoid chargebacks entirely?",
    a: "Crypto payments are not reversible by design, which eliminates the chargeback mechanism. However, this only works for customers willing and able to pay in crypto. Most consumer-facing businesses cannot move their entire payment flow to crypto. A practical use case is offering crypto as an option for digital goods, B2B transactions, or international customers while keeping a traditional processor for main volume. HighRiskIntel helps you document how crypto flows are handled so it does not create compliance confusion when applying for traditional processing in parallel.",
  },
  {
    q: "My processor placed a payout hold. Will opening a new account fix it?",
    a: "Usually not immediately. If the reason for the hold is an elevated dispute ratio, adding a new processor does not fix the root cause — it splits volume, which can make your ratio look better or worse depending on timing. The right sequence: (1) understand the exact reason for the hold in writing, (2) fix the underlying issue, (3) build a remediation file, and (4) approach new processors with that documentation ready. HighRiskIntel's risk audit generates the documentation you need for that conversation.",
  },
  {
    q: "What does HighRiskIntel actually do vs a payment processor or ISO?",
    a: "HighRiskIntel is risk intelligence and documentation software — not a processor or ISO. We help merchants understand their dispute data, prepare the underwriting file, document their risk controls, and communicate with existing or prospective processors more credibly. We do not directly place merchant accounts or earn referral fees from processors. Our output is a cleaner risk file and a clearer narrative, which makes conversations with processors and ISOs more productive.",
  },
  {
    q: "How many backup MIDs do I need?",
    a: "Most high-risk merchants should have at least two active processing relationships, even at a 90/10 volume split. A single MID creates a single point of failure. A backup processor needs real transaction history to stay active — route at least a few thousand dollars per month to keep the relationship warm. The backup should also be at a different acquiring bank than your primary.",
  },
];

export default function PaymentSolutionsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F7F8] font-[var(--font-inter)] text-[#111111]">
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="text-sm font-semibold tracking-[-0.01em]">HighRiskIntel</Link>
          <nav className="hidden gap-5 text-sm font-medium text-[#6B7280] md:flex">
            <Link href="/chargeback-alerts" className="hover:text-[#111111]">Alerts</Link>
            <Link href="/high-risk-merchant-solutions" className="hover:text-[#111111]">Merchants</Link>
            <Link href="/payment-solutions" className="font-semibold text-[#111111]">Payments</Link>
            <Link href="/acquirer-readiness" className="hover:text-[#111111]">Acquirers</Link>
          </nav>
          <Link href="/risk-audit" className="shrink-0 rounded-lg bg-[#111827] px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(17,24,39,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1E2A38] sm:px-4">
            Request review
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_14%,rgba(30,42,56,0.09),transparent_38%)]" />
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(17,17,17,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.035)_1px,transparent_1px)] [background-size:92px_92px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">Payment solutions</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem]">
            US-backed, offshore, and crypto-backed payment solution planning for high-risk merchants.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#4B5563] sm:text-lg sm:leading-8">
            HighRiskIntel helps high-risk merchants understand their payment options, prepare the underwriting documentation processors actually want, and plan backup routes before a hold or termination becomes urgent.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/risk-audit" className="rounded-lg bg-[#111827] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(17,24,39,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1E2A38]">
              Get a free risk review
            </Link>
            <Link href="/processor-fund-hold" className="rounded-lg border border-[#C9CED6] bg-white px-5 py-3 text-sm font-semibold text-[#111111] shadow-[0_10px_24px_rgba(17,24,39,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#111827]">
              Processor holding funds?
            </Link>
          </div>
        </div>
      </section>

      {/* Route comparison table */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Route comparison</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            US-backed, offshore, backup MID, and crypto-backed: how they compare.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#4B5563]">
            The right payment route depends on your vertical, dispute history, reserve capacity, and payout timing needs. Most high-risk merchants benefit from more than one.
          </p>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-[#E5E7EB]">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7280]">Route</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7280]">Best for</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7280]">Typical fees</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7280]">Reserve</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7280]">Payout speed</th>
                </tr>
              </thead>
              <tbody>
                {routeTable.map((row, i) => (
                  <tr key={row.route} className={`border-b border-[#F3F4F6] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}`}>
                    <td className="px-5 py-4 font-semibold text-[#111111]">{row.route}</td>
                    <td className="px-5 py-4 text-[#4B5563]">{row.bestFor}</td>
                    <td className="px-5 py-4 text-[#4B5563]">{row.fees}</td>
                    <td className="px-5 py-4 text-[#4B5563]">{row.reserve}</td>
                    <td className="px-5 py-4 text-[#4B5563]">{row.payoutSpeed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-[#9CA3AF]">
            Rates are illustrative ranges. Actual terms vary by processor, vertical, volume, and risk profile.
          </p>
        </div>
      </section>

      {/* 4 route detail sections */}
      <section className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
              <span className="rounded-md border border-[#D1D5DB] bg-[#F7F7F8] px-3 py-1 text-xs font-semibold text-[#1E2A38]">US-backed</span>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">Domestic high-risk processing</h3>
              <p className="mt-3 text-sm leading-7 text-[#4B5563]">
                US-based ISOs that specialize in high-risk categories offer better consumer protections, faster settlement, and lower fees than offshore options — but have tighter dispute ratio requirements. Typical review threshold is 1–2% before pressure starts.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "Better customer trust signals — US billing descriptor and domestic bank name",
                  "2–5 day settlement vs 7–30 days offshore",
                  "Lower transaction fees (typically 2.5–4.5%)",
                  "Chargeback ratio tolerance generally 1–2% before intervention",
                  "Requires documented risk controls and remediation history if dispute ratio was elevated",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-6 text-[#374151]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E2A38]" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] p-4 text-sm leading-7 text-[#4B5563]">
                <strong>HighRiskIntel&apos;s role:</strong> We analyze your dispute and refund data, document your risk controls, and prepare the underwriting narrative that makes a US processor application credible — not just a form submission.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
              <span className="rounded-md border border-[#D1D5DB] bg-[#F7F7F8] px-3 py-1 text-xs font-semibold text-[#1E2A38]">Offshore</span>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">Offshore merchant accounts</h3>
              <p className="mt-3 text-sm leading-7 text-[#4B5563]">
                Offshore processors are incorporated outside the US. Common acquiring jurisdictions include Malta, Cyprus, Belize, Seychelles, and Cayman Islands. They accept verticals US banks decline, but the tradeoffs are real and must be planned for.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "Available for verticals declined by domestic acquirers: supplements, nutraceuticals, adult, replica, gaming",
                  "Higher processing fees — typically 3.5–6% per transaction",
                  "Rolling reserve common: 10–15% held for 120–180 days",
                  "Slower payouts: 7–30 day settlement cycles",
                  "Less recourse if the processor behaves badly — jurisdiction and contract terms matter",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-6 text-[#374151]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E2A38]" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] p-4 text-sm leading-7 text-[#4B5563]">
                <strong>HighRiskIntel&apos;s role:</strong> We prepare the offshore application file: chargeback history, refund controls, fulfillment evidence, descriptor documentation, and a remediation plan if the ratio was previously elevated.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
              <span className="rounded-md border border-[#D1D5DB] bg-[#F7F7F8] px-3 py-1 text-xs font-semibold text-[#1E2A38]">Backup MID</span>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">Backup MID and continuity planning</h3>
              <p className="mt-3 text-sm leading-7 text-[#4B5563]">
                A single processor relationship is a single point of failure. When a processor places a hold or terminates an account, merchants without a backup MID have zero payment continuity. The backup account must be active — not pending — before the primary relationship becomes unstable.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "Run at least two active processing relationships — even at a 90/10 volume split",
                  "A backup MID needs real transaction history to stay active (dormant accounts get closed)",
                  "Route enough volume to keep the relationship warm — $5K/month minimum on most accounts",
                  "Backup processor should be at a different acquiring bank than your primary",
                  "Document both accounts in your risk file so future underwriters see diversification",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-6 text-[#374151]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E2A38]" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] p-4 text-sm leading-7 text-[#4B5563]">
                <strong>HighRiskIntel&apos;s role:</strong> We map your processor concentration, identify continuity gaps, and prepare the application documentation for a backup relationship before an emergency creates urgency.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
              <span className="rounded-md border border-[#D1D5DB] bg-[#F7F7F8] px-3 py-1 text-xs font-semibold text-[#1E2A38]">Crypto-backed</span>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">Crypto-backed settlement options</h3>
              <p className="mt-3 text-sm leading-7 text-[#4B5563]">
                Crypto payment rails eliminate the chargeback mechanism by design — transactions are irreversible. For the right use cases (digital goods, international B2B, technically sophisticated customers), crypto settlement can reduce dispute exposure significantly. It is not a universal replacement for card processing.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "No chargebacks — transactions are final (customers must be clearly informed at purchase)",
                  "Lower transaction fees: typically 0.5–2%",
                  "Near-real-time or T+1 settlement — no rolling reserve",
                  "Requires customer willingness to pay in crypto (limits conversion for most consumer products)",
                  "Refund handling must be explicit in terms of service — refunds are discretionary not automatic",
                  "Compliance documentation required — KYC/AML, tax treatment, cross-border rules",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-6 text-[#374151]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E2A38]" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] p-4 text-sm leading-7 text-[#4B5563]">
                <strong>HighRiskIntel&apos;s role:</strong> We document how your crypto payment flows are handled — settlement, refunds, compliance notes, customer communication — so this does not create confusion when applying for traditional card processing in parallel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Underwriting documents */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Underwriting</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            What underwriters want before approving a high-risk merchant account.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4B5563]">
            Most processor application rejections are documentation problems, not merchant quality problems. These are the materials underwriters need and why each one matters.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {underwritingDocs.map((item) => (
              <div key={item.doc} className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-5">
                <p className="font-semibold text-[#111111]">{item.doc}</p>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">{item.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HRI vs processor */}
      <section className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Roles</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            What HighRiskIntel does vs what a processor or ISO does.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4B5563]">
            HighRiskIntel is not a processor or an ISO. Understanding the distinction helps you use both more effectively.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
              <p className="text-lg font-semibold">HighRiskIntel does</p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "Analyzes your chargeback ratio, refund data, and authorization health",
                  "Documents your risk controls in a processor-readable format",
                  "Generates the underwriting narrative and remediation plan",
                  "Maps which payment route options are realistic given your current data",
                  "Prepares you for the processor conversation before you apply",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-6 text-[#374151]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
              <p className="text-lg font-semibold">Processors and ISOs do</p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "Approve or deny your merchant account application",
                  "Set your processing fees, reserve rates, and payout terms",
                  "Monitor transactions and enforce card network rules",
                  "Execute holds, reserves, or terminations based on their risk policy",
                  "Route actual payment transactions and settle funds",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-6 text-[#374151]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6B7280]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">FAQ</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">Common questions about high-risk payment solutions.</h2>
          <div className="mt-8 space-y-5">
            {faqItems.map((item) => (
              <div key={item.q} className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6">
                <p className="font-semibold text-[#111111]">{item.q}</p>
                <p className="mt-3 text-sm leading-7 text-[#4B5563]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Related reading</p>
          <h2 className="mt-3 text-xl font-semibold tracking-[-0.02em]">Articles on payment solutions and processor risk</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Offshore merchant account guide", href: "/blog/offshore-merchant-account-guide" },
              { label: "Rolling reserve explained", href: "/blog/rolling-reserve-explained" },
              { label: "Payment processor hold — what to do", href: "/blog/payment-processor-hold" },
              { label: "Payment processor underwriting guide", href: "/blog/payment-processor-underwriting" },
              { label: "High-risk merchant account shutdown prevention", href: "/blog/high-risk-merchant-account-shutdown" },
              { label: "MID termination warning signs", href: "/blog/mid-termination-warning-signs" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-4 text-sm font-medium text-[#1E2A38] shadow-[0_4px_16px_rgba(17,24,39,0.04)] transition hover:-translate-y-0.5 hover:border-[#C9CED6] hover:shadow-[0_12px_32px_rgba(17,24,39,0.08)]"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#111827]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Next step</p>
              <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">
                Get a free review of your payment situation.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-white/60">
                Submit your risk audit request and we will map your dispute data, document your controls, and identify which payment routes are realistic given your current profile.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/risk-audit" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#111827] shadow-[0_16px_36px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F1F2F4]">
                Request free review
              </Link>
              <Link href="/processor-fund-hold" className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:border-white/40 hover:bg-white/5">
                Processor holding funds?
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
