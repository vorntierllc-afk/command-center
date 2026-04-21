import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Partners & Payment Network | HighRiskIntel",
  description:
    "HighRiskIntel works alongside processors, ISOs, payment consultants, and fintech tools that serve high-risk merchants. Learn how the payment network fits together and who HighRiskIntel works with.",
  alternates: { canonical: absoluteUrl("/partners") },
};

const networkRoles = [
  {
    role: "Acquiring banks",
    copy: "Acquiring banks hold the actual merchant account relationships and set baseline risk tolerances. When a processor says they are reviewing your account, it is often the acquiring bank's risk policy driving the decision.",
    hriRole: "HighRiskIntel prepares the documentation acquiring bank risk teams need: dispute trend analysis, root cause, corrective actions, and monitoring evidence.",
  },
  {
    role: "ISOs (Independent Sales Organizations)",
    copy: "ISOs act as intermediaries between merchants and acquiring banks. They can place merchant accounts with multiple banks and often have more flexibility on vertical approval than dealing direct.",
    hriRole: "HighRiskIntel helps merchants arrive at ISO conversations with a complete risk file instead of a blank application — which dramatically improves approval odds for borderline verticals.",
  },
  {
    role: "Payment facilitators (PayFacs)",
    copy: "PayFacs like Stripe, Square, and Braintree aggregate merchants under their own master MID. They have lower barriers to entry but terminate high-risk accounts without warning. They are not a stable long-term solution for most high-risk verticals.",
    hriRole: "HighRiskIntel can document why a merchant was terminated from a PayFac and what has changed, which is required for traditional processor applications afterward.",
  },
  {
    role: "Chargeback alert networks",
    copy: "Ethoca (Mastercard), Verifi (Visa), and independent networks like Chargebacks911 operate pre-dispute alert systems. When a cardholder calls their bank, these networks can alert the merchant before the dispute becomes a formal chargeback.",
    hriRole: "HighRiskIntel integrates alert network data into an operational queue — routing each alert to a refund, review, or fight decision with full order context.",
  },
  {
    role: "Payment consultants and advisors",
    copy: "Independent payment consultants help merchants navigate processor relationships, negotiate reserves, and find new acquiring relationships. They typically work on a fee or referral basis.",
    hriRole: "HighRiskIntel provides the documentation layer consultants need to present a merchant's situation credibly. Consultants who work with high-risk merchants use HRI data in their client presentations.",
  },
  {
    role: "Offshore processors",
    copy: "Offshore acquiring banks and processors are incorporated outside the US and accept verticals domestic banks decline. Common jurisdictions: Malta, Cyprus, Seychelles, Belize, Cayman Islands.",
    hriRole: "HighRiskIntel builds the offshore application file: chargeback history, fulfillment evidence, refund controls, compliance documentation, and descriptor plan.",
  },
];

const whoWeWorkWith = [
  {
    type: "High-risk merchants",
    detail: "Directly — as the software platform for dispute monitoring, alert operations, and processor documentation.",
  },
  {
    type: "Payment consultants",
    detail: "As a documentation and data layer for consultants preparing clients for processor or ISO conversations.",
  },
  {
    type: "High-risk ISOs",
    detail: "As a pre-qualification tool — merchants who complete a HRI risk audit arrive at ISO conversations with a ready application file.",
  },
  {
    type: "Fintech and compliance tools",
    detail: "As a complementary layer to transaction fraud tools, KYC platforms, and compliance monitoring systems focused on the processor relationship specifically.",
  },
];

export default function PartnersPage() {
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">Partners & network</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            How the high-risk payment network fits together.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#4B5563] sm:text-lg sm:leading-8">
            HighRiskIntel is not a processor or ISO. We are the documentation and intelligence layer that makes merchants more credible to the processors, ISOs, and acquiring banks they work with. Here is how the network fits together and where HighRiskIntel fits within it.
          </p>
        </div>
      </section>

      {/* Network roles */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">The payment network</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            Who is who in high-risk payment processing.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4B5563]">
            Understanding each player&apos;s role helps you know who to talk to, what they need, and where HighRiskIntel fits.
          </p>
          <div className="mt-8 space-y-5">
            {networkRoles.map((item) => (
              <div key={item.role} className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6">
                <p className="text-lg font-semibold text-[#111111]">{item.role}</p>
                <p className="mt-3 text-sm leading-7 text-[#4B5563]">{item.copy}</p>
                <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7280]">HighRiskIntel&apos;s role</p>
                  <p className="mt-2 text-sm leading-6 text-[#374151]">{item.hriRole}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we work with */}
      <section className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Relationships</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            Who HighRiskIntel works with directly.
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {whoWeWorkWith.map((item) => (
              <div key={item.type} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
                <p className="font-semibold text-[#111111]">{item.type}</p>
                <p className="mt-3 text-sm leading-7 text-[#4B5563]">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner / consultant CTA */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Work with us</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            Are you a payment consultant or ISO serving high-risk merchants?
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#4B5563]">
            HighRiskIntel works alongside consultants and ISOs who need a documentation and data layer for their clients. If you regularly help merchants navigate processor reviews, fund holds, or offshore transitions, and you want a structured tool that produces the files you need — reach out.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-lg bg-[#111827] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(17,24,39,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1E2A38]">
              Get in touch
            </Link>
            <Link href="/how-it-works" className="rounded-lg border border-[#C9CED6] bg-white px-5 py-3 text-sm font-semibold text-[#111111] shadow-[0_10px_24px_rgba(17,24,39,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#111827]">
              How HighRiskIntel works
            </Link>
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
                Start with a free risk audit.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-white/60">
                We will map your situation, identify the documentation gaps, and tell you which part of the payment network you should be talking to and with what.
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
