import Link from "next/link";
import type { OrganicAsset } from "@/lib/organic-assets";

type OrganicAssetPageProps = {
  asset: OrganicAsset;
  kind: "tool" | "resource";
};

export function OrganicAssetPage({ asset, kind }: OrganicAssetPageProps) {
  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#111111]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D5D9DF] bg-[#F7F7F8] text-sm font-semibold text-[#1E2A38]">
              HR
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">HighRiskIntel</div>
              <div className="text-xs text-[#6B7280]">{kind === "tool" ? "Risk tools" : "Risk resources"}</div>
            </div>
          </Link>
          <Link href="/risk-audit" className="rounded-xl bg-[#1E2A38] px-4 py-2.5 text-sm font-medium text-white">
            Free risk audit
          </Link>
        </div>
      </header>

      <main>
        <section className="border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">{asset.eyebrow}</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.03em] lg:text-5xl">{asset.title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#6B7280]">{asset.description}</p>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-[#6B7280]">{asset.intent}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/risk-audit" className="rounded-xl bg-[#1E2A38] px-5 py-3 text-sm font-medium text-white">
                  Request free audit
                </Link>
                <Link href="/tools/chargeback-rate-calculator" className="rounded-xl border border-[#D5D9DF] bg-white px-5 py-3 text-sm font-medium">
                  Chargeback calculator
                </Link>
              </div>
            </div>

            <aside className="rounded-[24px] border border-[#E5E7EB] bg-[#F7F7F8] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">What to gather</p>
              <div className="mt-5 space-y-3">
                {asset.checklist.map((item) => (
                  <div key={item} className="rounded-xl border border-[#E5E7EB] bg-white p-3 text-sm leading-6">
                    {item}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="border-b border-[#E5E7EB]">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="grid gap-4 md:grid-cols-3">
              {["Identify the trigger", "Organize evidence", "Route to the audit"].map((step, index) => (
                <div key={step} className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Step {index + 1}</p>
                  <h2 className="mt-3 text-lg font-semibold tracking-tight">{step}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#6B7280]">
                    High-risk merchants need a calm process that turns scattered processor emails, dispute reports, and support notes into a clear action list.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">FAQ</p>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {asset.faq.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-5">
                  <h2 className="text-sm font-semibold leading-6">{faq.question}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#6B7280]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
