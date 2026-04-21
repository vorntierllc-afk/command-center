import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About HighRiskIntel | Risk Intelligence for High-Risk Merchants",
  description:
    "HighRiskIntel is risk intelligence software built for high-risk merchants. We help teams track disputes, manage chargeback pressure, prepare processor documentation, and plan payment solution paths.",
  alternates: { canonical: absoluteUrl("/about") },
};

const values = [
  {
    title: "No fake certainty",
    copy: "We do not promise impossible chargeback elimination. The product shows operators which signals need attention before processors do. If we cannot help you, we say so.",
  },
  {
    title: "Processor-ready evidence",
    copy: "Risk reviews, alert decisions, refund reasoning, and corrective actions are organized into files a payment partner can actually evaluate — not internal dashboards that never leave the building.",
  },
  {
    title: "High-risk context",
    copy: "The workflow is built specifically for merchants dealing with reserves, processor reviews, alert programs, backup MIDs, offshore options, and crypto-backed routes. Generic risk tools were not built for your situation.",
  },
  {
    title: "Operators, not just founders",
    copy: "HighRiskIntel was built by people who have worked inside high-risk payment operations — not just fintech founders who read about the problem. The workflows reflect how processor conversations actually go.",
  },
];

const whatWeDo = [
  {
    area: "Chargeback alert operations",
    copy: "Route EDR, CDRN, RDR, Verifi, and Ethoca alerts into a structured decision queue with order context, risk signals, and refund or fight recommendations.",
  },
  {
    area: "Merchant risk monitoring",
    copy: "Track chargeback ratio, refund ratio, authorization rate, volume trends, and MID health signals before processor intervention becomes inevitable.",
  },
  {
    area: "Processor documentation",
    copy: "Build the underwriting narrative, remediation plan, and root-cause file that processors and acquirers need when reviewing a high-risk merchant relationship.",
  },
  {
    area: "Payment solution planning",
    copy: "Map realistic payment route options — US-backed, offshore, backup MID, and crypto-backed — based on the merchant's actual dispute data and risk profile.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F7F8] font-[var(--font-inter)] text-[#111111]">
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="text-sm font-semibold tracking-[-0.01em]">HighRiskIntel</Link>
          <nav className="hidden gap-5 text-sm font-medium text-[#6B7280] md:flex">
            <Link href="/chargeback-alerts" className="hover:text-[#111111]">Alerts</Link>
            <Link href="/payment-solutions" className="hover:text-[#111111]">Payments</Link>
            <Link href="/how-it-works" className="hover:text-[#111111]">How it works</Link>
            <Link href="/about" className="font-semibold text-[#111111]">About</Link>
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">About</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            Risk intelligence software built for high-risk merchants.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#4B5563] sm:text-lg sm:leading-8">
            HighRiskIntel helps high-risk merchants track disputes, manage chargeback pressure, prepare processor documentation, and plan payment solution paths — before a processor forces the conversation.
          </p>
        </div>
      </section>

      {/* What we do */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">What we do</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            Four operating areas for high-risk merchants.
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {whatWeDo.map((item) => (
              <div key={item.area} className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6">
                <p className="font-semibold text-[#111111]">{item.area}</p>
                <p className="mt-3 text-sm leading-7 text-[#6B7280]">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Who we serve</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            Built specifically for high-risk merchant operations.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4B5563]">
            HighRiskIntel is not a general-purpose risk platform. It is built for merchants operating in categories that processors and acquirers monitor more closely.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Supplement and nutraceutical merchants",
              "CBD and hemp product sellers",
              "Travel and vacation package merchants",
              "Subscription and continuity billing businesses",
              "Adult content and entertainment platforms",
              "Gaming and online gambling operators",
              "Crypto and digital asset businesses",
              "Peptide and research compound merchants",
              "Replica and branded goods sellers",
              "High-ticket coaching and education offers",
              "Forex and financial services businesses",
              "Any merchant under processor review or reserve pressure",
            ].map((item) => (
              <div key={item} className="flex gap-2.5 rounded-xl border border-[#E5E7EB] bg-white p-4 text-sm leading-6 text-[#374151] shadow-[0_4px_16px_rgba(17,24,39,0.03)]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E2A38]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">How we operate</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            What you should expect from HighRiskIntel.
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {values.map((item) => (
              <div key={item.title} className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6">
                <p className="font-semibold text-[#111111]">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-[#6B7280]">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we are not */}
      <section className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Transparency</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">What HighRiskIntel is not.</h2>
          <div className="mt-6 space-y-3">
            {[
              { label: "Not a payment processor or ISO", copy: "We do not approve merchant accounts, set processing terms, or earn referral fees from processors. We prepare you for those conversations." },
              { label: "Not a legal or compliance firm", copy: "We produce operating documentation, not legal advice. For MATCH/TMF situations, compliance investigations, or contract disputes, work with a payments attorney." },
              { label: "Not a chargeback guarantee service", copy: "No tool can eliminate chargebacks. We help you reduce them systematically and document what you are doing about them. The outcome depends on your operations, not just your software." },
              { label: "Not a generic risk platform", copy: "We are not built for ecommerce fraud prevention, marketplace trust and safety, or enterprise AML. We are specifically built for high-risk merchant processor relationships." },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-[#E5E7EB] bg-white p-5">
                <p className="font-semibold text-[#111111]">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">{item.copy}</p>
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
                See if HighRiskIntel is the right fit for your situation.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-white/60">
                Submit a free risk audit request and we will tell you clearly what we can help with and what we cannot.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/risk-audit" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#111827] shadow-[0_16px_36px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F1F2F4]">
                Request free review
              </Link>
              <Link href="/how-it-works" className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:border-white/40 hover:bg-white/5">
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
