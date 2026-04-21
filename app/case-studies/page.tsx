import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Case Studies | High-Risk Merchant Results | HighRiskIntel",
  description:
    "Real scenarios where HighRiskIntel helped high-risk merchants reduce chargeback pressure, survive processor reviews, plan payment alternatives, and document risk controls.",
  alternates: { canonical: absoluteUrl("/case-studies") },
};

const scenarios = [
  {
    category: "Chargeback ratio rescue",
    vertical: "Supplement merchant",
    situation:
      "A supplement brand processing $280K/month was placed under Visa VAMP monitoring after their dispute ratio hit 1.4%. Their processor gave them 60 days to show improvement or face account review. They had no documentation of what was causing the spike.",
    actions: [
      "Pulled 90 days of dispute data and identified that 61% of chargebacks were coming from a single customer acquisition channel with misleading trial offer language",
      "Documented descriptor confusion as the root cause — billing descriptor did not match the product name customers saw at checkout",
      "Built a corrective action plan: updated descriptor, added cancellation flow, implemented 30-day refund window before dispute deadline",
      "Generated a processor-ready remediation file with before/after metrics and monitoring plan",
    ],
    outcome: "Dispute ratio dropped from 1.4% to 0.6% over 45 days. Processor closed the review without account action.",
  },
  {
    category: "Processor fund hold",
    vertical: "Continuity subscription business",
    situation:
      "A subscription wellness brand had $180K in funds held by their processor after a volume spike in Q4. The processor cited 'risk review' with no specific metric given. The merchant did not know what triggered it.",
    actions: [
      "Identified the hold was triggered by a 22% week-over-week volume spike that processor risk systems flagged as unusual",
      "Documented that the spike was from a planned marketing campaign — with ad spend records, campaign dates, and customer acquisition data",
      "Wrote a formal fund hold response letter explaining the spike, attaching fulfillment data from the campaign period",
      "Mapped backup processing options in case the hold extended beyond 30 days",
    ],
    outcome: "Funds released within 14 days. Processor acknowledged the campaign documentation and cleared the hold.",
  },
  {
    category: "Offshore application",
    vertical: "Adult content platform",
    situation:
      "An adult content subscription platform was declined by four US-based processors. Their dispute ratio was under 1% but the vertical itself was the blocker. They had no documentation prepared for offshore applications.",
    actions: [
      "Assessed their actual risk profile: dispute ratio, refund rate, authorization health, and content compliance documentation",
      "Identified gaps: no formal chargeback prevention policy, no KYC documentation for content creators, unclear descriptor on billing statements",
      "Built the offshore underwriting file: business model summary, content compliance controls, dispute controls, refund policy, descriptor plan, processing history",
      "Mapped three realistic offshore acquiring jurisdictions based on the vertical and processing volume",
    ],
    outcome: "Successfully onboarded with an offshore processor within 30 days. Rolling reserve of 10% at 120-day release — better than initial quotes because documentation was complete.",
  },
  {
    category: "MID termination prevention",
    vertical: "Travel merchant",
    situation:
      "A travel agency processing high-ticket vacation packages received a processor warning letter after their Mastercard dispute ratio hit 1.1%. They had 30 days before formal program enrollment.",
    actions: [
      "Audited all disputes from the prior 90 days — found 73% were from canceled travel packages where refunds were not issued fast enough",
      "Identified fulfillment lag as the core issue: customer cancellation to refund was averaging 18 days",
      "Documented refund process change: new SLA of 72 hours from cancellation request to refund initiation",
      "Built a Mastercard remediation file with root cause, SLA change, fulfillment monitoring, and dispute trend projection",
    ],
    outcome: "Avoided formal Mastercard program enrollment. Dispute ratio came down to 0.7% in the following period.",
  },
  {
    category: "Backup MID setup",
    vertical: "Peptide research merchant",
    situation:
      "A peptide merchant with $120K/month in processing had their account flagged for review. They had no backup processor. When the account went on hold, their entire payment operation stopped.",
    actions: [
      "Analyzed their dispute and refund data to establish what a realistic second processor application would look like",
      "Identified documentation gaps that had contributed to the current processor's concern",
      "Prepared a clean underwriting file for a second processor relationship",
      "Mapped the backup integration plan so switching volume took hours, not weeks",
    ],
    outcome: "Second processor approved within 3 weeks. Merchant now runs 80/20 volume split. Next processor review will not be a single point of failure.",
  },
];

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F7F8] font-[var(--font-inter)] text-[#111111]">
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="text-sm font-semibold tracking-[-0.01em]">HighRiskIntel</Link>
          <nav className="hidden gap-5 text-sm font-medium text-[#6B7280] md:flex">
            <Link href="/chargeback-alerts" className="hover:text-[#111111]">Alerts</Link>
            <Link href="/payment-solutions" className="hover:text-[#111111]">Payments</Link>
            <Link href="/how-it-works" className="hover:text-[#111111]">How it works</Link>
            <Link href="/about" className="hover:text-[#111111]">About</Link>
          </nav>
          <Link href="/risk-audit" className="shrink-0 rounded-lg bg-[#111827] px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(17,24,39,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1E2A38] sm:px-4">
            Request review
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(30,42,56,0.08),transparent_40%)]" />
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(17,17,17,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.03)_1px,transparent_1px)] [background-size:92px_92px]" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">Case studies</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            Real high-risk merchant situations and how they were resolved.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#4B5563] sm:text-lg sm:leading-8">
            These scenarios represent the types of situations HighRiskIntel is built for. Merchant names and identifying details have been omitted. The problems, actions, and outcomes are real operating patterns.
          </p>
        </div>
      </section>

      {/* Scenarios */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="space-y-10">
            {scenarios.map((s, idx) => (
              <div key={s.category} className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] overflow-hidden">
                <div className="border-b border-[#E5E7EB] bg-white px-7 py-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#1E2A38] px-3 py-1 text-xs font-semibold text-white">{s.category}</span>
                    <span className="rounded-full border border-[#E5E7EB] bg-[#F7F7F8] px-3 py-1 text-xs font-medium text-[#4B5563]">{s.vertical}</span>
                  </div>
                </div>
                <div className="px-7 py-6">
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">Situation</p>
                    <p className="mt-2 text-sm leading-7 text-[#4B5563]">{s.situation}</p>
                  </div>
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">What was done</p>
                    <ul className="mt-3 space-y-2">
                      {s.actions.map((action) => (
                        <li key={action} className="flex gap-2.5 text-sm leading-6 text-[#374151]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E2A38]" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-[#D1FAE5] bg-[#F0FDF4] px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#166534]">Outcome</p>
                    <p className="mt-2 text-sm leading-6 text-[#166534]">{s.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem selector */}
      <section className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Find your scenario</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            Which of these describes your situation?
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "My chargeback ratio is rising", href: "/chargeback-alerts" },
              { label: "My processor is holding my funds", href: "/processor-fund-hold" },
              { label: "I need a high-risk merchant account", href: "/payment-solutions" },
              { label: "I need offshore or crypto-backed processing", href: "/payment-solutions" },
              { label: "My processor asked for a remediation plan", href: "/acquirer-readiness" },
              { label: "I need a backup MID before something breaks", href: "/payment-solutions" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-4 text-sm font-medium text-[#111111] shadow-[0_4px_16px_rgba(17,24,39,0.04)] transition hover:-translate-y-0.5 hover:border-[#C9CED6] hover:shadow-[0_12px_32px_rgba(17,24,39,0.08)]"
              >
                {item.label} →
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
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Your situation</p>
              <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">
                Submit your situation and see what is possible.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-white/60">
                Free risk audit. Tell us your vertical, current dispute data, and what is happening with your processor. We will map what needs to change.
              </p>
            </div>
            <Link href="/risk-audit" className="w-fit rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#111827] shadow-[0_16px_36px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F1F2F4]">
              Request free review
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
