"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Industries", href: "#industries" },
  { label: "High-risk pages", href: "/high-risk" },
  { label: "Tools", href: "/tools/chargeback-rate-calculator" },
  { label: "Audit", href: "/risk-audit" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

const pillars = [
  {
    title: "Chargeback visibility",
    copy: "Track dispute pressure, refund behavior, and recent account movement in one operating view.",
  },
  {
    title: "Processor-risk workflow",
    copy: "Organize notes, alerts, and follow-up work before account pressure becomes a larger problem.",
  },
  {
    title: "Operational reporting",
    copy: "Give operations, finance, and support teams a shared picture of what changed and what matters next.",
  },
];

const modules = [
  {
    eyebrow: "01",
    title: "Know if your account is drifting into danger",
    copy: "Track the metrics processors care about before they show up as reserve changes, payout holds, or difficult risk-team conversations.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12.4 7.6L18.4 8.4L14.2 12.5L15.3 18.5L10 15.6L4.7 18.5L5.8 12.5L1.6 8.4L7.6 7.6L10 2Z" stroke="#6366F1" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    eyebrow: "02",
    title: "Give your team a short action list",
    copy: "Surface the transactions, refund delays, dispute patterns, and account signals that should be reviewed first.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="14" height="14" rx="3" stroke="#6366F1" strokeWidth="1.5"/>
        <path d="M7 10L9 12L13 8" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    eyebrow: "03",
    title: "Prepare for processor conversations",
    copy: "Keep the evidence, changes, and remediation notes you need when a processor starts asking questions.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 4H16C16.6 4 17 4.4 17 5V13C17 13.6 16.6 14 16 14H11L8 17V14H4C3.4 14 3 13.6 3 13V5C3 4.4 3.4 4 4 4Z" stroke="#6366F1" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    eyebrow: "04",
    title: "Move faster without guessing",
    copy: "Make refund, review, and escalation decisions from one shared workspace instead of fragmented dashboards and spreadsheets.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 10H17M13 5L18 10L13 15" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const operatingBlocks = [
  {
    title: "For operations",
    badge: "Ops",
    points: ["Review priority transactions", "Track dispute pressure", "Keep action items visible"],
  },
  {
    title: "For finance",
    badge: "Finance",
    points: ["Understand reserve impact", "Monitor refund movement", "See account changes quickly"],
  },
  {
    title: "For support",
    badge: "Support",
    points: ["Spot customer confusion", "Track repeat issues", "Keep notes tied to the account"],
  },
];

const articles = [
  {
    title: "Chargeback Prevention for High-Risk Merchants",
    href: "/blog/chargeback-prevention-high-risk-merchants",
    copy: "A practical operator-focused playbook for reducing dispute pressure.",
    tag: "Guide",
  },
  {
    title: "Visa VAMP 2026 Guide",
    href: "/blog/visa-vamp-2026-guide",
    copy: "A clearer explanation of the model, thresholds, and what merchants should actually monitor.",
    tag: "Analysis",
  },
  {
    title: "MID Termination Warning Signs",
    href: "/blog/mid-termination-warning-signs",
    copy: "The account signals teams often notice too late.",
    tag: "Risk",
  },
];

const tools = [
  {
    title: "Visa VAMP calculator",
    href: "/tools/visa-vamp-calculator",
    copy: "Estimate Visa dispute exposure and prepare for processor conversations.",
  },
  {
    title: "MID termination risk checker",
    href: "/tools/mid-termination-risk-checker",
    copy: "Triage shutdown, reserve, payout hold, and chargeback warning signs.",
  },
  {
    title: "Payment processor hold checklist",
    href: "/resources/payment-processor-hold-checklist",
    copy: "Collect the evidence merchants need when funds are delayed or reviewed.",
  },
];

const organicPages = [
  {
    title: "Supplement merchants",
    href: "/industries/supplement-merchants",
    copy: "Chargeback and refund-risk visibility for supplement and nutraceutical brands.",
  },
  {
    title: "Subscription merchants",
    href: "/industries/subscription-merchants",
    copy: "Recurring billing, cancellation friction, refund timing, and dispute tracking.",
  },
  {
    title: "Travel merchants",
    href: "/industries/travel-merchants",
    copy: "Monitor cancellation, fulfillment, refund, and seasonal dispute pressure.",
  },
  {
    title: "CBD merchants",
    href: "/industries/cbd-merchants",
    copy: "Processor-risk visibility for high-risk wellness and CBD merchant accounts.",
  },
  {
    title: "200 high-risk merchant pages",
    href: "/high-risk",
    copy: "A new directory for peptide, replica, digital, regulated, resale, travel, and subscription merchant searches.",
  },
];

const stats = [
  { value: "4", label: "Audit checks", sub: "Dispute · Refund · Auth · Processor" },
  { value: "200+", label: "Merchant types covered", sub: "High-risk verticals" },
  { value: "<24h", label: "Audit turnaround", sub: "Free, no contract" },
];

export function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA]">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#09090B]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/25">
              HR
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-white">HighRiskIntel</span>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/signin")}
              className="text-sm font-medium text-zinc-400 transition hover:text-white"
            >
              Sign in
            </button>
            <button
              onClick={() => router.push("/risk-audit")}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-violet-500"
            >
              Free audit →
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/[0.06]">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/[0.12] blur-[120px]" />
            <div className="absolute left-[10%] top-[30%] h-[300px] w-[400px] rounded-full bg-violet-600/[0.08] blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-[1440px] px-6 py-20 xl:py-28">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              For high-risk merchants with chargeback pressure
            </div>

            <h1 className="mt-6 max-w-4xl text-[52px] font-bold leading-[1.04] tracking-[-0.04em] text-white sm:text-[68px]">
              Find out if chargebacks are{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                putting your merchant account at risk.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-[18px] leading-8 text-zinc-400">
              Get a free risk audit of your dispute ratio, refund behavior, authorization trends, and processor-risk signals. Then use HighRiskIntel to keep those signals organized before your account is under pressure.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/risk-audit")}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500"
              >
                Get free risk audit →
              </button>
              <button
                onClick={() => router.push("/demo")}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
              >
                View live demo
              </button>
            </div>

            {/* Stats row */}
            <div className="mt-14 flex flex-wrap gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-bold tracking-tight text-white">{s.value}</p>
                  <p className="mt-1 text-sm font-medium text-zinc-300">{s.label}</p>
                  <p className="text-xs text-zinc-500">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Dashboard mockup */}
            <div className="mt-16 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1 shadow-2xl">
              <div className="rounded-xl border border-white/[0.06] bg-[#111113]">
                {/* Mockup topbar */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-zinc-700" />
                      <span className="h-3 w-3 rounded-full bg-zinc-700" />
                      <span className="h-3 w-3 rounded-full bg-zinc-700" />
                    </div>
                    <span className="text-xs font-medium text-zinc-500">HighRiskIntel — Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-zinc-400">Last 30 days</span>
                    <span className="rounded-full bg-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-300">● Live</span>
                  </div>
                </div>

                <div className="grid gap-4 p-5 lg:grid-cols-[180px_minmax(0,1fr)]">
                  {/* Sidebar */}
                  <aside className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="space-y-1">
                      {["Dashboard", "Analytics", "Alerts", "Transactions", "Settings"].map((item, i) => (
                        <div
                          key={item}
                          className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                            i === 0
                              ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </aside>

                  {/* Content */}
                  <div className="space-y-4">
                    {/* Metric cards */}
                    <div className="grid gap-3 sm:grid-cols-4">
                      {[
                        { label: "Dispute ratio", value: "Check", hint: "Trending toward monitoring?" },
                        { label: "Refund timing", value: "Check", hint: "Preventable disputes?" },
                        { label: "Auth rate", value: "Check", hint: "Approvals dropping?" },
                        { label: "Processor risk", value: "Check", hint: "Warning signs scattered?" },
                      ].map((m) => (
                        <div key={m.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{m.label}</p>
                          <p className="mt-2 text-xl font-bold text-white">{m.value}</p>
                          <p className="mt-1 text-xs text-zinc-500">{m.hint}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_240px]">
                      {/* Chart */}
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-white">Risk trend</p>
                            <p className="mt-0.5 text-xs text-zinc-500">Average risk score across recent windows</p>
                          </div>
                          <span className="text-xs text-zinc-600">Updated daily</span>
                        </div>
                        <div className="mt-4 h-40 rounded-lg border border-white/[0.04] bg-[#0D0D10] p-3">
                          <svg viewBox="0 0 440 140" className="h-full w-full" fill="none">
                            <defs>
                              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path d="M0 108H440M0 78H440M0 48H440" stroke="white" strokeOpacity="0.04" />
                            <path
                              d="M0 94C38 84 66 78 96 76C126 74 154 54 188 56C222 58 240 84 278 86C316 88 350 56 388 48C409 44 424 46 440 42"
                              fill="url(#lineGrad)"
                            />
                            <path
                              d="M0 94C38 84 66 78 96 76C126 74 154 54 188 56C222 58 240 84 278 86C316 88 350 56 388 48C409 44 424 46 440 42"
                              stroke="#6366F1"
                              strokeWidth="2"
                            />
                            {[
                              { cx: 96, cy: 76 },
                              { cx: 188, cy: 56 },
                              { cx: 278, cy: 86 },
                              { cx: 388, cy: 48 },
                            ].map(({ cx, cy }) => (
                              <circle key={cx} cx={cx} cy={cy} r="4" fill="#6366F1" stroke="#09090B" strokeWidth="2" />
                            ))}
                          </svg>
                        </div>
                      </div>

                      {/* Alerts */}
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-white">Alerts</p>
                          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-400">3 open</span>
                        </div>
                        <div className="mt-4 space-y-2.5">
                          {[
                            { label: "Critical", copy: "Dispute ratio needs immediate review.", color: "#EF4444", bg: "bg-red-500/10 border-red-500/20" },
                            { label: "Warning", copy: "Refund timing may be increasing exposure.", color: "#F59E0B", bg: "bg-amber-500/10 border-amber-500/20" },
                            { label: "Info", copy: "Processor-risk notes should be centralized.", color: "#6366F1", bg: "bg-indigo-500/10 border-indigo-500/20" },
                          ].map(({ label, copy, color, bg }) => (
                            <div key={label} className={`rounded-lg border ${bg} p-3`}>
                              <div className="flex items-start gap-2.5">
                                <span className="mt-1.5 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>{label}</p>
                                  <p className="mt-0.5 text-xs leading-5 text-zinc-300">{copy}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                      <p className="text-sm font-semibold text-white">Recent transactions</p>
                      <div className="mt-4 overflow-hidden rounded-lg border border-white/[0.06]">
                        <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] bg-white/[0.03] px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          <span>Transaction</span>
                          <span>Amount</span>
                          <span>Risk</span>
                          <span>Status</span>
                        </div>
                        {[
                          { id: "TX-19384", amt: "$1,240", risk: "82", status: "Review", riskColor: "text-red-400", statusColor: "text-amber-400" },
                          { id: "TX-19372", amt: "$340", risk: "31", status: "Approved", riskColor: "text-emerald-400", statusColor: "text-emerald-400" },
                          { id: "TX-19355", amt: "$2,010", risk: "76", status: "Escalated", riskColor: "text-red-400", statusColor: "text-red-400" },
                        ].map((row) => (
                          <div key={row.id} className="grid grid-cols-[1.2fr_1fr_1fr_1fr] border-t border-white/[0.04] px-4 py-3 text-sm">
                            <span className="font-mono text-xs text-zinc-300">{row.id}</span>
                            <span className="text-white">{row.amt}</span>
                            <span className={`font-semibold ${row.riskColor}`}>{row.risk}</span>
                            <span className={`text-xs font-semibold ${row.statusColor}`}>{row.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product */}
        <section id="product" className="border-b border-white/[0.06] bg-[#09090B]">
          <div className="mx-auto max-w-[1440px] px-6 py-20">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-400">Product</div>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-white">
                Built around the moments that cost merchants money.
              </h2>
              <p className="max-w-md text-base leading-7 text-zinc-400">
                If your processor starts asking questions, you need a clear picture fast: what changed, why it matters, and what you're doing about it.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {modules.map((module) => (
                <div
                  key={module.title}
                  className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition hover:border-indigo-500/30 hover:bg-indigo-500/[0.04]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
                      {module.icon}
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">{module.eyebrow}</p>
                  </div>
                  <h3 className="mt-4 text-xl font-bold tracking-tight text-white">{module.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">{module.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform / who it's for */}
        <section id="platform" className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-[1440px] px-6 py-20">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-400">Platform</div>
            <h2 className="text-4xl font-bold tracking-tight text-white">Who this is for right now.</h2>

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {operatingBlocks.map((block) => (
                <div key={block.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-300">
                      {block.badge}
                    </span>
                    <h3 className="text-lg font-bold text-white">{block.title}</h3>
                  </div>
                  <div className="mt-6 space-y-3">
                    {block.points.map((point) => (
                      <div key={point} className="flex items-start gap-3 text-sm text-zinc-400">
                        <svg className="mt-1 h-4 w-4 flex-shrink-0 text-indigo-500" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="leading-6">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section id="industries" className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-[1440px] px-6 py-20">
            <div className="grid gap-12 xl:grid-cols-[320px_minmax(0,1fr)]">
              <div>
                <div className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-400">Organic pages</div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Built for the verticals most likely to search for help.</h2>
                <p className="mt-4 text-base leading-7 text-zinc-400">
                  These pages target specific high-risk merchant searches and route visitors into the free audit.
                </p>
                <Link
                  href="/high-risk"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-violet-500"
                >
                  Browse high-risk pages →
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {organicPages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition hover:border-indigo-500/30 hover:bg-indigo-500/[0.04]"
                  >
                    <h3 className="text-base font-bold tracking-tight text-white">{page.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">{page.copy}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 transition group-hover:gap-2">
                      Open page →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-[1440px] px-6 py-20">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-400">Resources</div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Helpful resources for merchants under pressure.</h2>
              </div>
              <Link href="/blog" className="text-sm font-semibold text-indigo-400 transition hover:text-indigo-300">
                View all articles →
              </Link>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.href}
                  href={article.href}
                  className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition hover:border-indigo-500/30 hover:bg-indigo-500/[0.04]"
                >
                  <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-300">
                    {article.tag}
                  </span>
                  <h3 className="mt-4 text-base font-bold tracking-tight text-white">{article.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">{article.copy}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 transition group-hover:gap-2">
                    Read article →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Tools */}
        <section className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-[1440px] px-6 py-20">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-400">Free tools</div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Linkable assets for urgent merchant searches.</h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-zinc-400">
              Calculators and checklists help merchants diagnose account pressure and create better organic entry points.
            </p>

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition hover:border-indigo-500/30 hover:bg-indigo-500/[0.04]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 2v14M2 9h14" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-base font-bold tracking-tight text-white">{tool.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">{tool.copy}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 transition group-hover:gap-2">
                    Open tool →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/[0.10] blur-[100px]" />
          </div>
          <div className="relative mx-auto flex max-w-[1440px] flex-col items-center justify-center gap-8 px-6 py-24 text-center">
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-400">Get started</div>
            <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Send us your situation.{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                We'll tell you what to look at first.
              </span>
            </h2>
            <p className="max-w-lg text-lg text-zinc-400">
              Free audit, no contract. Know exactly where your chargeback risk stands in under 24 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => router.push("/risk-audit")}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500"
              >
                Get free risk audit →
              </button>
              <button
                onClick={() => router.push("/contact")}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
              >
                Contact sales
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.06]">
          <div className="mx-auto max-w-[1440px] px-6 py-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] font-bold text-white">
                  HR
                </div>
                <span className="text-sm font-semibold text-white">HighRiskIntel</span>
              </div>
              <p className="text-xs text-zinc-600">© 2026 HighRiskIntel. All rights reserved.</p>
              <div className="flex gap-4 text-xs text-zinc-600">
                <Link href="/privacy" className="hover:text-zinc-400 transition">Privacy</Link>
                <Link href="/terms" className="hover:text-zinc-400 transition">Terms</Link>
                <Link href="/contact" className="hover:text-zinc-400 transition">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export function HRIAuthPage({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-1/4 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/[0.10] blur-[100px]" />
      </div>
      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-xl shadow-indigo-500/25">
            HR
          </div>
          <h1 className="text-2xl font-bold text-white">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {mode === "signin" ? "Sign in to your HighRiskIntel account" : "Start your free risk audit today"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-indigo-500/50 focus:bg-white/[0.06]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-indigo-500/50 focus:bg-white/[0.06]"
              />
            </div>
            <button className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-violet-500">
              {mode === "signin" ? "Sign in →" : "Create account →"}
            </button>
          </div>
          <p className="mt-6 text-center text-xs text-zinc-500">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => router.push(mode === "signin" ? "/signup" : "/signin")}
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
