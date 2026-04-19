import type { Metadata } from "next";
import Link from "next/link";
import { HIGH_RISK_SEO_PAGES } from "@/lib/high-risk-seo";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "High-Risk Merchant SEO Directory",
  description:
    "Browse HighRiskIntel pages for high-risk merchant verticals, chargeback prevention, processor risk, rolling reserves, and MID shutdown prevention.",
  alternates: { canonical: absoluteUrl("/high-risk") },
};

export default function HighRiskDirectoryPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#111111]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-semibold tracking-tight">
            HighRiskIntel
          </Link>
          <Link href="/risk-audit" className="rounded-xl bg-[#1E2A38] px-4 py-2.5 text-sm font-medium text-white">
            Free risk audit
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">High-risk merchant pages</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] lg:text-5xl">Payment-risk pages for high-risk verticals.</h1>
          <p className="mt-5 text-base leading-8 text-[#6B7280]">
            These pages target long-tail searches from merchants who need help reducing chargebacks, processor-risk signals, reserve pressure, and possible MID shutdowns.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {HIGH_RISK_SEO_PAGES.map((page) => (
            <Link key={page.slug} href={`/high-risk/${page.slug}`} className="rounded-2xl border border-[#E5E7EB] bg-white p-5 transition hover:border-[#D5D9DF]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">{page.topic.label}</p>
              <h2 className="mt-3 text-lg font-semibold tracking-tight">{page.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#6B7280]">{page.description}</p>
              <span className="mt-5 inline-block text-sm font-medium text-[#1E2A38]">Open page</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
