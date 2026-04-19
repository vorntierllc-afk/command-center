import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Risk Audit Request Received",
  description: "Your HighRiskIntel risk audit request has been received.",
  alternates: { canonical: absoluteUrl("/thank-you") },
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#111111]">
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
        <section className="w-full rounded-[28px] border border-[#E5E7EB] bg-white p-8 text-center lg:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ECFDF3] text-xl font-semibold text-[#16A34A]">
            ✓
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Audit request received</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em]">We have the request.</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#6B7280]">
            Next step: review the merchant account context, chargeback pressure, payout or reserve issues, and any processor-risk signals you shared.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/tools/chargeback-rate-calculator" className="rounded-xl border border-[#D5D9DF] bg-white px-5 py-3 text-sm font-medium">
              Use chargeback calculator
            </Link>
            <Link href="/high-risk" className="rounded-xl bg-[#1E2A38] px-5 py-3 text-sm font-medium text-white">
              Browse risk pages
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
