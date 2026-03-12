import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] shell-border px-6 py-16 shadow-glow sm:px-10 lg:px-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,185,66,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.14),transparent_25%)]" />
      <div className="relative max-w-4xl">
        <div className="inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-1 text-xs uppercase tracking-[0.24em] text-amber-100">
          Built for difficult merchant categories
        </div>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Risk intelligence that helps high-risk merchants stay approved, funded, and bankable.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          HighRiskIntel combines merchant intake, processor connectivity, statement analysis, and live risk monitoring into one white-label operating layer for businesses that need more than a generic fraud dashboard.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-200">
            Start onboarding
          </Link>
          <Link href="/signin" className="rounded-full border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-100 hover:border-amber-300/40 hover:text-amber-100">
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
