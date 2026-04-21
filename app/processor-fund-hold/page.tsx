import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Processor Holding Your Funds? Here Is What To Do | HighRiskIntel",
  description:
    "If your payment processor placed a payout hold on your merchant account, this guide covers the exact steps to take: documentation, communication, remediation, and alternative processing paths.",
  keywords: [
    "processor holding funds",
    "payment processor hold",
    "merchant account payout hold",
    "processor fund hold high risk",
    "payout hold remediation",
  ],
  alternates: { canonical: absoluteUrl("/processor-fund-hold") },
};

const holdReasons = [
  {
    reason: "Elevated chargeback ratio",
    detail: "Your dispute-to-transaction ratio exceeded the processor's internal threshold. This is the most common cause for high-risk merchants.",
    urgency: "High",
  },
  {
    reason: "Sudden volume spike",
    detail: "Volume increased sharply without warning. Processors interpret unforecast spikes as potential fraud or fulfillment risk.",
    urgency: "Medium",
  },
  {
    reason: "Refund ratio increase",
    detail: "A rising refund rate signals fulfillment or product quality issues that could convert into chargebacks.",
    urgency: "Medium",
  },
  {
    reason: "Compliance flag",
    detail: "A card network audit, AML trigger, or regulatory inquiry prompted the processor to pause settlements.",
    urgency: "High",
  },
  {
    reason: "Negative option or subscription dispute",
    detail: "Continuity billing or subscription products received complaints from cardholders or the issuing bank directly.",
    urgency: "High",
  },
  {
    reason: "Fulfillment complaint",
    detail: "Product was not delivered or did not match the description. Processor received signal from issuer or network.",
    urgency: "Medium",
  },
];

const immediateSteps = [
  {
    step: "1",
    title: "Get the reason in writing",
    detail: "Do not accept a phone call explanation. Send an email asking for the specific reason for the hold, the amount held, and the release criteria. Everything must be in writing.",
  },
  {
    step: "2",
    title: "Pull your dispute data",
    detail: "Check your chargeback ratio, refund ratio, dispute count, and authorization health for the last 30, 60, and 90 days. Know your numbers before you respond.",
  },
  {
    step: "3",
    title: "Document your fulfillment evidence",
    detail: "Gather shipping confirmations, delivery receipts, tracking data, or digital delivery logs. If the hold is fulfillment-related, this evidence is your first defense.",
  },
  {
    step: "4",
    title: "Do not move all volume immediately",
    detail: "Opening a new processor account and moving all volume can accelerate account termination at your current processor. Get advice before shifting volume.",
  },
  {
    step: "5",
    title: "Prepare a written remediation response",
    detail: "A processor risk team needs to see what caused the issue, what you have already changed, and what monitoring is now in place. This file is your path to releasing the hold.",
  },
  {
    step: "6",
    title: "Assess backup processing options",
    detail: "If this hold is going to last weeks, you need a parallel payment path. Start the application process now with documentation prepared — not after the account terminates.",
  },
];

const faqItems = [
  {
    q: "How long can a processor legally hold my funds?",
    a: "There is no universal legal limit on hold duration — it is governed by your merchant processing agreement. Most agreements allow processors to hold funds for 90–180 days, or until the chargeback risk period for your transaction type expires. Read your agreement's 'reserve' and 'hold' clauses carefully. If funds are held beyond the stated period with no clear reason, consult a payments attorney.",
  },
  {
    q: "Will disputing the hold with my bank (chargeback) help?",
    a: "No. Attempting to chargeback or reverse a processor hold through your bank creates a contract breach situation. It almost always results in immediate account termination and potentially landing on the MATCH/TMF list, which blacklists you from most processing relationships for up to 5 years. Do not do this.",
  },
  {
    q: "Can I open a new merchant account while my funds are held?",
    a: "Yes, but carefully. Opening a backup account is usually the right move if the hold is going to be extended. However, do not terminate your existing account until the hold is resolved — you may lose leverage in fund release negotiations. Some processors will release held funds faster if the relationship ends properly rather than with a dispute.",
  },
  {
    q: "What is a rolling reserve and how is it different from a payout hold?",
    a: "A rolling reserve is a pre-agreed percentage of your gross volume held back as a security deposit and released on a rolling schedule (usually 90–180 days later). A payout hold is a unilateral decision by the processor to stop releasing your funds entirely — usually triggered by a risk event. Rolling reserves are normal. Payout holds are emergency risk actions.",
  },
  {
    q: "How do I get my held funds released faster?",
    a: "The fastest path is a credible written remediation response that addresses the processor's stated concern. Show the data, explain the root cause, document the controls you have put in place, and give them a monitoring plan. Processors want to release held funds — they do not want the liability of holding merchant money indefinitely. A clean, professional response dramatically improves release speed.",
  },
  {
    q: "What happens if my account gets terminated while funds are held?",
    a: "The processor still owes you the held funds, but the timeline extends significantly — often to the chargeback window expiry for your last transactions (typically 120–180 days). The processor will deduct any chargebacks or fees from the held amount before releasing the remainder. You may need a payments attorney to recover funds if the processor is unresponsive.",
  },
];

export default function ProcessorFundHoldPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F7F8] font-[var(--font-inter)] text-[#111111]">
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="text-sm font-semibold tracking-[-0.01em]">HighRiskIntel</Link>
          <nav className="hidden gap-5 text-sm font-medium text-[#6B7280] md:flex">
            <Link href="/chargeback-alerts" className="hover:text-[#111111]">Alerts</Link>
            <Link href="/high-risk-merchant-solutions" className="hover:text-[#111111]">Merchants</Link>
            <Link href="/payment-solutions" className="hover:text-[#111111]">Payments</Link>
            <Link href="/acquirer-readiness" className="hover:text-[#111111]">Acquirers</Link>
          </nav>
          <Link href="/risk-audit" className="shrink-0 rounded-lg bg-[#111827] px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(17,24,39,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1E2A38] sm:px-4">
            Get help now
          </Link>
        </div>
      </header>

      {/* Emergency hero */}
      <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(220,38,38,0.06),transparent_40%)]" />
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(17,17,17,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.03)_1px,transparent_1px)] [background-size:92px_92px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FCA5A5] bg-[#FEF2F2] px-3 py-1.5 text-xs font-semibold text-[#991B1B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" />
            Urgent situation
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-[3.25rem]">
            Your processor is holding funds. Here is what to do right now.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#4B5563] sm:text-lg sm:leading-8">
            A payout hold is a risk escalation, not necessarily account termination. How you respond in the first 48–72 hours determines whether funds get released and whether the account survives. Start with documentation, not panic.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/risk-audit" className="rounded-lg bg-[#111827] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(17,24,39,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1E2A38]">
              Submit a risk audit request
            </Link>
            <Link href="/payment-solutions" className="rounded-lg border border-[#C9CED6] bg-white px-5 py-3 text-sm font-semibold text-[#111111] shadow-[0_10px_24px_rgba(17,24,39,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#111827]">
              See payment alternatives
            </Link>
          </div>
        </div>
      </section>

      {/* Why processors hold funds */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Root causes</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            Why processors place payout holds on merchant accounts.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4B5563]">
            The stated reason matters. Your response should be targeted at the specific cause — not a generic appeal.
          </p>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-[#E5E7EB]">
            <table className="w-full min-w-[600px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7280]">Cause</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7280]">What it means</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7280]">Urgency</th>
                </tr>
              </thead>
              <tbody>
                {holdReasons.map((row, i) => (
                  <tr key={row.reason} className={`border-b border-[#F3F4F6] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}`}>
                    <td className="px-5 py-4 font-semibold text-[#111111]">{row.reason}</td>
                    <td className="px-5 py-4 text-[#4B5563]">{row.detail}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.urgency === "High" ? "bg-[#FEF2F2] text-[#991B1B]" : "bg-[#FFFBEB] text-[#92400E]"}`}>
                        {row.urgency}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Immediate action steps */}
      <section className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Response protocol</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            The six steps to take in the first 72 hours.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {immediateSteps.map((item) => (
              <div key={item.step} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E2A38] text-sm font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold text-[#111111]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What HRI does */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[480px_minmax(0,1fr)] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">How we help</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
                HighRiskIntel builds the remediation file that gets your hold reviewed.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#4B5563]">
                Processors release payout holds when they have a credible reason to believe the underlying risk is under control. That requires documentation — not just a phone call. HighRiskIntel analyzes your dispute and refund data and produces the written remediation file a processor risk team can actually evaluate.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Root-cause analysis of what triggered the hold",
                  "Current chargeback ratio, refund ratio, and authorization health summary",
                  "Evidence of corrective actions already in place",
                  "Monitoring plan the processor can reference going forward",
                  "Payment route alternatives if the relationship cannot be saved",
                ].map((item) => (
                  <li key={item} className="flex gap-3 rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] p-3.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E2A38]" />
                    <p className="text-sm leading-6 text-[#374151]">{item}</p>
                  </li>
                ))}
              </ul>
              <Link href="/risk-audit" className="mt-6 inline-block rounded-lg bg-[#111827] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(17,24,39,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1E2A38]">
                Submit a risk audit request
              </Link>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6">
                <p className="text-sm font-semibold text-[#111111]">Do not do these when your funds are held</p>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "Do not attempt to chargeback or reverse funds through your bank — this triggers MATCH listing",
                    "Do not move all volume to a new processor without a plan — it can accelerate termination",
                    "Do not ignore processor communications — every day without a response hurts your case",
                    "Do not accept verbal explanations — get the hold reason and release criteria in writing",
                    "Do not publicly post about the processor dispute — it complicates legal resolution",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-6 text-[#374151]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#DC2626]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6">
                <p className="text-sm font-semibold text-[#111111]">What a good remediation response includes</p>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "The specific dispute event or metric that caused the hold",
                    "Root cause — why it happened, not just what happened",
                    "Changes already implemented (with dates and evidence)",
                    "Ongoing monitoring: what you are tracking and how often",
                    "Expected metrics improvement timeline",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-6 text-[#374151]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">FAQ</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">Common questions about processor fund holds.</h2>
          <div className="mt-8 space-y-5">
            {faqItems.map((item) => (
              <div key={item.q} className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
                <p className="font-semibold text-[#111111]">{item.q}</p>
                <p className="mt-3 text-sm leading-7 text-[#4B5563]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related reading */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Related reading</p>
          <h2 className="mt-3 text-xl font-semibold tracking-[-0.02em]">More on processor holds and payment risk</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Payment processor hold — full guide", href: "/blog/payment-processor-hold" },
              { label: "Rolling reserve explained", href: "/blog/rolling-reserve-explained" },
              { label: "MID termination warning signs", href: "/blog/mid-termination-warning-signs" },
              { label: "High-risk merchant account shutdown prevention", href: "/blog/high-risk-merchant-account-shutdown" },
              { label: "Payment solutions for high-risk merchants", href: "/payment-solutions" },
              { label: "Chargeback remediation plan guide", href: "/blog/chargeback-remediation-plan" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] px-5 py-4 text-sm font-medium text-[#1E2A38] transition hover:-translate-y-0.5 hover:border-[#C9CED6] hover:bg-white hover:shadow-[0_12px_32px_rgba(17,24,39,0.08)]"
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
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Get help now</p>
              <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">
                Submit your situation and we will build your remediation file.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-white/60">
                Tell us what your processor told you, share your recent dispute data, and we will prepare the written response that gives you the best chance of releasing the hold.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/risk-audit" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#111827] shadow-[0_16px_36px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F1F2F4]">
                Submit risk audit request
              </Link>
              <Link href="/payment-solutions" className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:border-white/40 hover:bg-white/5">
                View payment alternatives
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
