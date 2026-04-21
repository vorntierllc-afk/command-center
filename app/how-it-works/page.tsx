import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How HighRiskIntel Works | Risk Intelligence for High-Risk Merchants",
  description:
    "HighRiskIntel connects to your processor data, monitors chargeback and authorization health, routes dispute alerts, and generates processor-ready documentation. Here is exactly how it works.",
  alternates: { canonical: absoluteUrl("/how-it-works") },
};

const workflowSteps = [
  {
    step: "01",
    title: "Connect your processor data",
    detail: "Import statement data, dispute reports, and transaction history from your existing processor. HighRiskIntel accepts CSV exports from most major processors — no API integration required to start.",
    output: "Baseline dispute ratio, refund ratio, authorization rate, and volume trend",
  },
  {
    step: "02",
    title: "Surface what matters before processors act",
    detail: "The platform highlights chargeback ratio movement, authorization decline trends, refund velocity, MID health signals, and reserve pressure — the same signals your processor's risk team watches.",
    output: "Live operating dashboard with weekly trend direction for each key metric",
  },
  {
    step: "03",
    title: "Route dispute alerts into a decision queue",
    detail: "EDR, CDRN, RDR, Verifi, and Ethoca alerts map to the original order, customer risk signals, and a recommended action: refund, review, fight, or escalate. Each alert logs the decision and timing.",
    output: "Alert response queue with order context, risk flags, and tracked response time",
  },
  {
    step: "04",
    title: "Generate processor-ready documentation",
    detail: "When a processor asks for a remediation plan, an underwriting narrative, or a root-cause explanation, HighRiskIntel produces a structured document — not a spreadsheet dump — that risk teams can actually evaluate.",
    output: "Formatted risk file with root cause, corrective actions, monitoring plan, and current metrics",
  },
  {
    step: "05",
    title: "Plan payment routes with real data",
    detail: "If the current processor relationship is under pressure, HighRiskIntel maps which payment routes — US-backed, offshore, backup MID, crypto-backed — are realistic given the merchant's actual dispute profile.",
    output: "Payment route assessment with documentation gaps and application readiness by route",
  },
  {
    step: "06",
    title: "Track remediation progress",
    detail: "Corrective actions are assigned owners and dates. As the dispute ratio improves, the platform tracks which changes moved the needle — giving the merchant an evidence trail for the next processor conversation.",
    output: "Timestamped remediation log showing what changed, when, and the measurable impact",
  },
];

const faqItems = [
  {
    q: "How does HighRiskIntel get my processor data?",
    a: "Most merchants start by uploading statement exports (CSV or PDF) from their existing processor. This covers dispute history, transaction volume, refund data, and authorization summary. For merchants who want live monitoring, we support direct data feeds from select processors. No integration is required to do a risk audit or generate documentation.",
  },
  {
    q: "How long does the initial risk audit take?",
    a: "A basic risk audit typically takes 24–48 hours after you submit your information and processing history. Complex situations — multiple MIDs, prior termination, MATCH/TMF, compliance questions — take 3–5 business days. We do not guess; we wait for enough data to give you an accurate assessment.",
  },
  {
    q: "Do I need to cancel my current processor to use HighRiskIntel?",
    a: "No. HighRiskIntel works alongside your existing processing relationships. The output — documentation, dispute tracking, remediation files — is designed to improve your standing with your current processor, not replace it. If the relationship cannot be saved, we help you plan alternatives.",
  },
  {
    q: "What does the chargeback alert workflow look like in practice?",
    a: "When an alert comes in (EDR, CDRN, Verifi, Ethoca), it appears in your alert queue alongside the original transaction data: customer info, order amount, product, fulfillment status, and any prior dispute history from that customer. The system recommends refund, review, or fight based on your current chargeback ratio and the cost/benefit of each option. You log the decision and the timing. This creates a documented response record that shows processors you have a real alert management process.",
  },
  {
    q: "What format does the processor documentation take?",
    a: "The output is a structured PDF document suitable for sending to a processor risk team, acquirer underwriting department, or ISO. It includes a business summary, dispute ratio trend (with explanation of any spikes), corrective actions taken (with dates), monitoring plan going forward, and current operating metrics. It does not look like it came from a spreadsheet.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F7F8] font-[var(--font-inter)] text-[#111111]">
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="text-sm font-semibold tracking-[-0.01em]">HighRiskIntel</Link>
          <nav className="hidden gap-5 text-sm font-medium text-[#6B7280] md:flex">
            <Link href="/chargeback-alerts" className="hover:text-[#111111]">Alerts</Link>
            <Link href="/payment-solutions" className="hover:text-[#111111]">Payments</Link>
            <Link href="/how-it-works" className="font-semibold text-[#111111]">How it works</Link>
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">How it works</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            From messy processor data to a file your acquirer can actually evaluate.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#4B5563] sm:text-lg sm:leading-8">
            HighRiskIntel takes your existing transaction and dispute data and turns it into structured risk visibility, alert workflows, and processor-ready documentation — without requiring an engineering team or a complicated integration.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/risk-audit" className="rounded-lg bg-[#111827] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(17,24,39,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1E2A38]">
              Start with a free risk audit
            </Link>
            <Link href="/demo" className="rounded-lg border border-[#C9CED6] bg-white px-5 py-3 text-sm font-semibold text-[#111111] shadow-[0_10px_24px_rgba(17,24,39,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#111827]">
              View live demo
            </Link>
          </div>
        </div>
      </section>

      {/* 6-step workflow */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">The workflow</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            Six steps from raw data to processor-ready documentation.
          </h2>
          <div className="mt-10 space-y-6">
            {workflowSteps.map((item, idx) => (
              <div key={item.step} className="grid gap-6 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6 lg:grid-cols-[80px_minmax(0,1fr)_280px] lg:items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E2A38] text-sm font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.015em] text-[#111111]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#4B5563]">{item.detail}</p>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">Output</p>
                  <p className="mt-2 text-sm leading-6 text-[#374151]">{item.output}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The three products */}
      <section className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Core tools</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            Three tools in one operating system.
          </h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Risk dashboard</p>
              <h3 className="mt-3 text-lg font-semibold">Merchant risk monitoring</h3>
              <p className="mt-3 text-sm leading-7 text-[#4B5563]">
                Track chargeback ratio, refund ratio, authorization rate, volume, and MID health signals in one view. Weekly trend direction surfaces what is moving before your processor notices.
              </p>
              <Link href="/high-risk-merchant-solutions" className="mt-4 inline-block text-sm font-semibold text-[#1E2A38] underline underline-offset-4">
                Merchant solutions →
              </Link>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Alert queue</p>
              <h3 className="mt-3 text-lg font-semibold">Dispute alert operations</h3>
              <p className="mt-3 text-sm leading-7 text-[#4B5563]">
                Route EDR, CDRN, RDR, Verifi, and Ethoca alerts into a structured queue with order context, risk signals, and refund/fight recommendations. Every decision is logged with timing.
              </p>
              <Link href="/chargeback-alerts" className="mt-4 inline-block text-sm font-semibold text-[#1E2A38] underline underline-offset-4">
                Alert solutions →
              </Link>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Documentation</p>
              <h3 className="mt-3 text-lg font-semibold">Processor-ready reports</h3>
              <p className="mt-3 text-sm leading-7 text-[#4B5563]">
                Generate structured remediation plans, underwriting narratives, and risk files that processor risk teams can actually evaluate — not generic summaries or spreadsheet exports.
              </p>
              <Link href="/acquirer-readiness" className="mt-4 inline-block text-sm font-semibold text-[#1E2A38] underline underline-offset-4">
                Acquirer readiness →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">FAQ</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">Common questions about how HighRiskIntel works.</h2>
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

      {/* CTA */}
      <section className="bg-[#111827]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Get started</p>
              <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">
                Start with a free risk audit — no integration required.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-white/60">
                Submit your processing history and current situation. We will map your dispute data, identify the gaps, and tell you exactly what needs to change.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/risk-audit" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#111827] shadow-[0_16px_36px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F1F2F4]">
                Request free review
              </Link>
              <Link href="/demo" className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:border-white/40 hover:bg-white/5">
                View demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
