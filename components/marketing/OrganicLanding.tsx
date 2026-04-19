import Link from "next/link";

type OrganicLandingProps = {
  eyebrow: string;
  title: string;
  description: string;
  audience: string;
  painPoints: string[];
  auditChecks: string[];
  relatedLinks?: { label: string; href: string }[];
};

export function OrganicLanding({
  eyebrow,
  title,
  description,
  audience,
  painPoints,
  auditChecks,
  relatedLinks = [],
}: OrganicLandingProps) {
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
              <div className="text-xs text-[#6B7280]">Merchant risk operations</div>
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
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">{eyebrow}</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] lg:text-5xl">{title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#6B7280]">{description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/risk-audit" className="rounded-xl bg-[#1E2A38] px-5 py-3 text-sm font-medium text-white">
                  Request free audit
                </Link>
                <Link href="/tools/chargeback-rate-calculator" className="rounded-xl border border-[#D5D9DF] bg-white px-5 py-3 text-sm font-medium">
                  Calculate chargeback rate
                </Link>
              </div>
            </div>

            <aside className="rounded-[24px] border border-[#E5E7EB] bg-[#F7F7F8] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Best for</p>
              <p className="mt-3 text-xl font-semibold tracking-tight">{audience}</p>
              <div className="mt-6 space-y-3">
                {auditChecks.map((check) => (
                  <div key={check} className="rounded-xl border border-[#E5E7EB] bg-white p-3 text-sm leading-6 text-[#111111]">
                    {check}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Why merchants search for this</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">The problem is usually visible before it becomes urgent.</h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {painPoints.map((point) => (
                <div key={point} className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                  <p className="text-sm leading-7 text-[#111111]">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {relatedLinks.length > 0 ? (
          <section className="bg-white">
            <div className="mx-auto max-w-6xl px-6 py-14">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Related resources</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {relatedLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-5 text-sm font-medium text-[#1E2A38]">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
