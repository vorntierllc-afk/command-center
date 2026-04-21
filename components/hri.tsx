"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Live demo", href: "#live-demo" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Industries", href: "#industries" },
  { label: "Free tools", href: "/free-tools" },
  { label: "Resources", href: "/blog" },
  { label: "Audit", href: "/risk-audit" },
];

const productMenu = [
  { label: "Chargeback alert solutions", href: "/chargeback-alerts", copy: "EDR, CDRN, RDR, Verifi, Ethoca, and alert response routing." },
  { label: "High-risk merchant solutions", href: "/high-risk-merchant-solutions", copy: "Risk monitoring, MID protection, reserve pressure, and processor readiness." },
  { label: "Payment solutions", href: "/payment-solutions", copy: "US-backed, offshore, and crypto-backed payment solution planning." },
  { label: "Acquirer readiness", href: "/acquirer-readiness", copy: "Processor-facing risk packs, remediation notes, and underwriting support." },
];

const productLines = [
  {
    eyebrow: "Chargeback alerts",
    title: "EDR, CDRN, RDR, Verifi and Ethoca workflows",
    href: "/chargeback-alerts",
    copy: "Route early dispute alerts into a decision queue with order context, risk signals, refund guidance, and response timing.",
    reason: "Why it matters: early alerts are one of the few places a merchant can reduce dispute count before processor ratios move against the account.",
    points: ["Alert intake and triage", "Auto-refund decision support", "Dispute ratio impact tracking"],
  },
  {
    eyebrow: "Merchant risk",
    title: "High-risk merchant account protection",
    href: "/high-risk-merchant-solutions",
    copy: "Monitor chargeback pressure, reserve exposure, payout-hold risk, authorization decline movement, and MID termination signals.",
    reason: "Why it matters: processors rarely warn cleanly before reserves, holds, or termination pressure. Operators need account-health evidence ready first.",
    points: ["MID health scoring", "Processor review packs", "Reserve and hold documentation"],
  },
  {
    eyebrow: "Payment solutions",
    title: "US-backed, offshore and crypto-backed options",
    href: "/payment-solutions",
    copy: "Support high-risk merchants that need payment routing options, backup processor planning, and clearer underwriting narratives.",
    reason: "Why it matters: payment approvals are easier to defend when the business can show risk controls, fulfillment logic, and a backup route plan.",
    points: ["US-backed payment paths", "Offshore processor positioning", "Crypto-backed solution support"],
  },
  {
    eyebrow: "Acquirer readiness",
    title: "Acquirer and processor risk intelligence",
    href: "/acquirer-readiness",
    copy: "Prepare clear risk files for acquiring banks, ISOs, processors, and underwriting teams when a merchant account is under review.",
    reason: "Why it matters: a structured acquirer file turns scattered operations into a credible story a risk team can actually evaluate.",
    points: ["Risk narrative drafting", "Root-cause analysis", "Corrective action tracking"],
  },
];

const mobileProductModules = [
  { title: "Alerts", detail: "EDR/CDRN/RDR", reason: "Catch disputes before ratios rise.", color: "bg-[#DC2626]" },
  { title: "Merchant risk", detail: "MID health", reason: "Track holds, reserves, shutdown pressure.", color: "bg-[#1E2A38]" },
  { title: "Payments", detail: "US/offshore/crypto", reason: "Plan backup routes with cleaner data.", color: "bg-[#F59E0B]" },
  { title: "Acquirer", detail: "Readiness pack", reason: "Give processors a defensible file.", color: "bg-[#16A34A]" },
];

const preventionLayers = [
  {
    label: "EDR",
    title: "Early Dispute Resolution",
    copy: "EDR gives merchants a chance to resolve eligible disputes before they mature into chargebacks. HighRiskIntel turns those alerts into a clear refund, review, or fight queue.",
  },
  {
    label: "CDRN",
    title: "Consumer Dispute Resolution Network",
    copy: "CDRN alerts can reduce chargeback count when teams respond quickly. We centralize alert timing, order context, customer signals, and the action taken.",
  },
  {
    label: "Filters",
    title: "Early dispute filters",
    copy: "Rules highlight high-risk order patterns before the dispute arrives: unusual geography, disposable email domains, overnight orders, high tickets, and repeat-risk behavior.",
  },
  {
    label: "Payments",
    title: "Payment solution support",
    copy: "For merchants dealing with processor holds, reserves, shutdown risk, or rejected applications, HighRiskIntel helps frame US-backed, offshore, and crypto-backed payment solution paths.",
  },
];

const operatingMetrics = [
  { label: "Alerts routed", value: "186", detail: "EDR/CDRN queue" },
  { label: "MID health", value: "34", detail: "Critical review" },
  { label: "Payment paths", value: "3", detail: "US, offshore, crypto" },
  { label: "Processor pack", value: "Ready", detail: "Underwriting file" },
];

const riskTrend = [
  { label: "Mon", value: 62 },
  { label: "Tue", value: 58 },
  { label: "Wed", value: 71 },
  { label: "Thu", value: 67 },
  { label: "Fri", value: 74 },
  { label: "Sat", value: 69 },
  { label: "Sun", value: 57 },
];

const paymentRoutes = [
  { route: "US-backed", status: "Prepared", detail: "Processor narrative and MID-health pack ready" },
  { route: "Offshore", status: "Review", detail: "Fulfillment, refund, and chargeback controls mapped" },
  { route: "Crypto-backed", status: "Scoped", detail: "Use case, settlement, and compliance notes drafted" },
];

const signalCards = [
  { label: "EDR alert", x: "right-[8%]", y: "top-[12%]", tone: "border-[#DC2626]/20 bg-[#DC2626]/5 text-[#991B1B]" },
  { label: "CDRN queue", x: "right-[30%]", y: "top-[25%]", tone: "border-[#F59E0B]/25 bg-[#F59E0B]/7 text-[#92400E]" },
  { label: "MID health", x: "right-[5%]", y: "bottom-[30%]", tone: "border-[#1E2A38]/15 bg-white/80 text-[#1E2A38]" },
  { label: "Acquirer file", x: "right-[26%]", y: "bottom-[12%]", tone: "border-[#16A34A]/20 bg-[#16A34A]/5 text-[#166534]" },
];

const useCases = [
  {
    title: "Processor review preparation",
    copy: "A processor asks for an explanation of recent dispute movement, reserve pressure, or payout risk.",
    metric: "Response pack",
  },
  {
    title: "Refund pressure control",
    copy: "Refunds are rising and the team needs to know which policies, SKUs, or customer segments are creating friction.",
    metric: "Policy signals",
  },
  {
    title: "Authorization decline analysis",
    copy: "Authorization rate is moving down across a product, descriptor, geography, or payment route.",
    metric: "Auth health",
  },
  {
    title: "Backup MID and payment routing",
    copy: "The business needs cleaner data before applying for US-backed, offshore, or crypto-backed payment solutions.",
    metric: "Payment path",
  },
];

const industries = [
  { title: "Peptide merchants", href: "/high-risk/peptide-merchants-chargeback-prevention" },
  { title: "Replica goods merchants", href: "/high-risk/replica-goods-merchants-chargeback-prevention" },
  { title: "Supplement merchants", href: "/industries/supplement-merchants" },
  { title: "Subscription merchants", href: "/industries/subscription-merchants" },
  { title: "CBD merchants", href: "/industries/cbd-merchants" },
  { title: "Travel merchants", href: "/industries/travel-merchants" },
];

const trustStandards = [
  {
    title: "No fake certainty",
    copy: "We do not promise impossible chargeback elimination. The product shows operators which signals need attention before processors do.",
  },
  {
    title: "Processor-ready evidence",
    copy: "Risk reviews, alert decisions, refund reasoning, and corrective actions are organized into files a payment partner can actually evaluate.",
  },
  {
    title: "High-risk context",
    copy: "The workflow is built for merchants dealing with reserves, reviews, alert programs, backup MIDs, offshore options, and crypto-backed routes.",
  },
];

const freeGrowthAssets = [
  { title: "Free tools hub", href: "/free-tools", copy: "Calculators, checklists, and operating resources people can cite or share." },
  { title: "All blog topics", href: "/blog/all", copy: "A full searchable library of chargeback, payment, and high-risk merchant articles." },
  { title: "Link-to-us kit", href: "/link-to-us", copy: "Copy-paste snippets and a badge for partners, consultants, and directories." },
  { title: "High-risk directory", href: "/high-risk", copy: "Industry pages built for merchants searching by vertical and payment problem." },
];

const alerts = [
  { label: "Critical", copy: "Chargeback ratio moved above internal review threshold.", color: "bg-[#DC2626]" },
  { label: "Warning", copy: "Authorization rate declined across two recent windows.", color: "bg-[#F59E0B]" },
  { label: "Safe", copy: "Refund timing is within expected operating range.", color: "bg-[#16A34A]" },
];

const activity = [
  { event: "Refund policy review", owner: "Operations", status: "Open" },
  { event: "Descriptor mismatch check", owner: "Support", status: "In progress" },
  { event: "Processor response draft", owner: "Finance", status: "Ready" },
];

const riskFactors = [
  { label: "International high-risk traffic", value: "41%", tone: "bg-[#DC2626]" },
  { label: "Disposable email domains", value: "24%", tone: "bg-[#F59E0B]" },
  { label: "High-ticket single orders", value: "18%", tone: "bg-[#1E2A38]" },
  { label: "Off-hours transactions", value: "11%", tone: "bg-[#6B7280]" },
];

const actionQueue = [
  { priority: "Urgent", task: "Review two high-risk disputes before settlement cutoff", color: "text-[#DC2626]" },
  { priority: "High", task: "Require step-up verification for cross-border orders", color: "text-[#F59E0B]" },
  { priority: "Medium", task: "Prepare processor response notes for account review", color: "text-[#1E2A38]" },
];

const transactions = [
  { id: "TX-19384", amount: "$865", signal: "High", status: "Disputed" },
  { id: "TX-19372", amount: "$312", signal: "Low", status: "Settled" },
  { id: "TX-19355", amount: "$540", signal: "Review", status: "Open" },
  { id: "TX-19321", amount: "$189", signal: "Low", status: "Settled" },
];

function LogoMark() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#C8CDD4] bg-[linear-gradient(145deg,#FFFFFF,#EEF1F5_48%,#C9D0D8)] text-[13px] font-semibold text-[#1E2A38] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_24px_rgba(30,42,56,0.10)]">
      HR
    </div>
  );
}

export function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F7F8] text-[#111111]">
      <header className="sticky top-0 z-50 border-b border-[#DDE1E7] bg-white/88 shadow-[0_10px_30px_rgba(17,24,39,0.05)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="text-sm font-semibold leading-4 tracking-tight">HighRiskIntel</p>
              <p className="text-xs text-[#6B7280]">Merchant risk intelligence</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <div className="group relative pb-3 pt-3">
              <button className="rounded-lg px-3 py-2 text-sm font-medium text-[#4B5563] transition hover:bg-[linear-gradient(145deg,#FFFFFF,#EEF1F5)] hover:text-[#111111] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_24px_rgba(30,42,56,0.08)]">
                Product
              </button>
              <div className="invisible absolute left-0 top-[calc(100%-10px)] z-50 w-[540px] pt-3 opacity-0 transition duration-200 ease-out group-hover:visible group-hover:opacity-100">
                <div className="rounded-3xl border border-[#D5DAE1] bg-white/96 p-3 shadow-[0_30px_90px_rgba(17,24,39,0.16),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-xl">
                  <div className="mb-2 flex items-center justify-between border-b border-[#EEF0F3] px-2 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">Product suite</p>
                    <span className="rounded-full border border-[#D5DAE1] bg-[linear-gradient(145deg,#FFFFFF,#EEF1F5,#D8DEE6)] px-2.5 py-1 text-[11px] font-semibold text-[#4B5563] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">Risk OS</span>
                  </div>
                <div className="grid gap-2">
                  {productMenu.map((item) => (
                    <Link key={item.href} href={item.href} className="group/item rounded-2xl border border-transparent p-4 transition duration-200 hover:border-[#D7DCE3] hover:bg-[linear-gradient(145deg,#FFFFFF,#F3F5F8)] hover:shadow-[0_16px_38px_rgba(30,42,56,0.09)]">
                      <p className="text-sm font-semibold text-[#111111]">{item.label}</p>
                      <p className="mt-1 text-xs leading-5 text-[#6B7280]">{item.copy}</p>
                      <span className="mt-3 inline-flex text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1E2A38] opacity-0 transition group-hover/item:opacity-100">View product →</span>
                    </Link>
                  ))}
                </div>
                </div>
              </div>
            </div>
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} className="rounded-md px-3 py-2 text-sm font-medium text-[#4B5563] hover:bg-[#F1F2F4] hover:text-[#111111]">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/signin")} className="hidden text-sm font-medium text-[#4B5563] hover:text-[#111111] sm:block">
              Sign in
            </button>
            <button onClick={() => router.push("/demo")} className="shrink-0 rounded-lg bg-[#1E2A38] px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(30,42,56,0.18)] transition hover:-translate-y-0.5 hover:bg-[#111827] sm:px-4">
              <span className="sm:hidden">Demo</span>
              <span className="hidden sm:inline">Open app demo</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="live-demo" className="border-b border-[#E5E7EB] bg-[#FBFBFC]">
          <div className="relative isolate overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_70%_10%,rgba(30,42,56,0.08),transparent_42%)]" />
            <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(17,17,17,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.035)_1px,transparent_1px)] [background-size:96px_96px]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block">
              <div className="hri-orbit-line absolute right-[18%] top-[18%] h-[420px] w-[420px] rounded-full border border-[#C9D0D9]/70" />
              <div className="hri-orbit-line absolute right-[7%] top-[28%] h-[300px] w-[300px] rounded-full border border-[#E0E4EA]/90 [animation-delay:900ms]" />
              {signalCards.map((card, index) => (
                <div
                  key={card.label}
                  className={`hri-signal-card absolute ${card.x} ${card.y} rounded-full border px-3.5 py-2 text-[11px] font-semibold shadow-[0_16px_40px_rgba(30,42,56,0.10)] backdrop-blur ${card.tone}`}
                  style={{ animationDelay: `${index * 420}ms` }}
                >
                  {card.label}
                </div>
              ))}
            </div>

            <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:gap-12 lg:py-24">
              <div className="hri-soft-enter min-w-0 max-w-full">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#C9CED6] bg-[linear-gradient(145deg,#FFFFFF,#F1F3F6_54%,#D9DEE6)] px-3.5 py-2 text-xs font-semibold text-[#1E2A38] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_14px_32px_rgba(30,42,56,0.10)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                  Merchant risk intelligence
                </div>
              <h1 className="mt-7 max-w-[350px] break-words text-[34px] font-semibold leading-[1.04] tracking-[-0.025em] text-[#111111] sm:max-w-3xl sm:text-5xl lg:text-[60px] lg:leading-[0.96]">
                Payment risk operations for high-risk merchant teams.
              </h1>
              <p className="mt-6 max-w-[350px] text-base leading-7 text-[#4B5563] sm:mt-7 sm:max-w-2xl sm:text-lg sm:leading-8">
                HighRiskIntel organizes chargeback alerts, EDR and CDRN response, MID health, processor-readiness files, and payment-solution planning for merchants under pressure.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => router.push("/risk-audit")} className="group rounded-lg bg-[#111827] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(17,24,39,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1E2A38]">
                  Get a risk review
                  <span className="ml-2 inline-block transition group-hover:translate-x-0.5">→</span>
                </button>
                <button onClick={() => router.push("/demo")} className="rounded-lg border border-[#C9CED6] bg-white px-5 py-3 text-sm font-semibold text-[#111111] transition duration-300 hover:-translate-y-0.5 hover:border-[#111827] hover:bg-[#F7F7F8]">
                  View platform demo
                </button>
              </div>
              <div className="mt-10 hidden max-w-2xl grid-cols-2 gap-3 sm:grid sm:grid-cols-4">
                {operatingMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                    <p className="text-xl font-semibold tracking-tight">{metric.value}</p>
                    <p className="mt-1 text-xs font-medium text-[#4B5563]">{metric.label}</p>
                    <p className="mt-1 text-[11px] text-[#6B7280]">{metric.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 max-w-[350px] rounded-[26px] border border-[#D8DDE5] bg-[linear-gradient(145deg,#F9FAFB,#E8ECF2)] p-2.5 shadow-[0_28px_80px_rgba(30,42,56,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] lg:hidden">
                <div className="overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#DC2626]/80" />
                      <span className="h-2 w-2 rounded-full bg-[#F59E0B]/80" />
                      <span className="h-2 w-2 rounded-full bg-[#16A34A]/80" />
                    </div>
                    <p className="text-[11px] font-semibold text-[#6B7280]">Mobile risk cockpit</p>
                  </div>
                  <div className="grid grid-cols-[48px_minmax(0,1fr)]">
                    <aside className="border-r border-[#E5E7EB] bg-[#F7F7F8] p-2">
                      {["D", "A", "P", "R"].map((item, index) => (
                        <div key={item} className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-semibold ${index === 0 ? "bg-[#1E2A38] text-white shadow-[0_10px_24px_rgba(30,42,56,0.18)]" : "border border-[#E5E7EB] bg-white text-[#6B7280]"}`}>
                          {item}
                        </div>
                      ))}
                    </aside>
                    <div className="min-w-0 p-3">
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          ["Risk", "72"],
                          ["CB ratio", "1.42%"],
                          ["Auth", "84.6%"],
                          ["Refund", "6.8%"],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-xl border border-[#E5E7EB] bg-[#FBFBFC] p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">{label}</p>
                            <p className="mt-1 text-xl font-semibold tracking-tight text-[#111111]">{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 rounded-xl border border-[#E5E7EB] bg-[#FBFBFC] p-3">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-xs font-semibold">Products</p>
                          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-[#6B7280] ring-1 ring-[#E5E7EB]">4 live</span>
                        </div>
                        <div className="space-y-2">
                          {mobileProductModules.map((product) => (
                            <div key={product.title} className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white p-2.5">
                              <span className={`h-2 w-2 shrink-0 rounded-full ${product.color}`} />
                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-[#111111]">{product.title}</p>
                                <p className="truncate text-[11px] text-[#6B7280]">{product.detail}</p>
                                <p className="mt-0.5 line-clamp-1 text-[10px] leading-4 text-[#6B7280]">{product.reason}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden overflow-hidden rounded-[28px] border border-[#CCD2DA] bg-[linear-gradient(145deg,#F9FAFB,#E8EBF0_50%,#C9D0D9)] p-3 shadow-[0_34px_100px_rgba(30,42,56,0.18),inset_0_1px_0_rgba(255,255,255,0.92)] lg:block">
              <div className="pointer-events-none absolute inset-x-6 top-20 h-px bg-[#101820]/10" />
              <div className="flex items-center justify-between rounded-t-[20px] border border-b-0 border-[#E5E7EB] bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#DC2626]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#16A34A]/80" />
                </div>
                <p className="text-xs font-medium text-[#6B7280]">Risk operations dashboard</p>
                <span className="hidden rounded-md bg-[#F7F7F8] px-2.5 py-1 text-xs font-medium text-[#4B5563] sm:inline-block">Live sample</span>
              </div>
              <div className="rounded-b-[20px] border border-[#E5E7EB] bg-white">
                <div className="grid border-b border-[#E5E7EB] md:grid-cols-4">
                  {[
                    ["Risk score", "72", "Review", "text-[#DC2626]"],
                    ["Chargeback ratio", "1.42%", "+0.18%", "text-[#DC2626]"],
                    ["Authorization", "84.6%", "-2.1%", "text-[#F59E0B]"],
                    ["Refund rate", "6.8%", "Stable", "text-[#16A34A]"],
                  ].map(([label, value, note, tone]) => (
                    <div key={label} className="border-b border-[#E5E7EB] p-5 md:border-b-0 md:border-r last:md:border-r-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B7280]">{label}</p>
                      <div className="mt-3 flex items-end gap-2">
                        <p className="text-3xl font-semibold tracking-[-0.035em] text-[#111111]">{value}</p>
                        <p className={`pb-1 text-xs font-semibold ${tone}`}>{note}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="border-b border-[#E5E7EB] p-6 lg:border-b-0 lg:border-r">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">Dispute pressure trend</p>
                        <p className="mt-1 text-xs text-[#6B7280]">EDR, CDRN, refund, and chargeback movement</p>
                      </div>
                      <span className="rounded-full border border-[#E5E7EB] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4B5563]">7 days</span>
                    </div>
                    <div className="mt-8 h-64 rounded-2xl border border-[#E5E7EB] bg-[#FBFBFC] p-5">
                      <div className="relative h-full">
                        <div className="absolute inset-x-0 top-4 border-t border-dashed border-[#D1D5DB]" />
                        <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#D1D5DB]" />
                        <div className="absolute inset-x-0 bottom-8 border-t border-dashed border-[#D1D5DB]" />
                        <svg viewBox="0 0 520 170" className="hri-line-draw absolute inset-x-0 top-4 h-[170px] w-full overflow-visible" aria-hidden="true">
                          <path d="M0 122 C70 116 88 92 138 98 C188 104 202 58 260 66 C320 74 332 40 386 52 C442 64 466 92 520 74" fill="none" stroke="#1E2A38" strokeWidth="3" strokeLinecap="round" />
                          <path d="M0 122 C70 116 88 92 138 98 C188 104 202 58 260 66 C320 74 332 40 386 52 C442 64 466 92 520 74 L520 170 L0 170 Z" fill="url(#riskArea)" opacity="0.12" />
                          <defs>
                            <linearGradient id="riskArea" x1="0" x2="0" y1="0" y2="1">
                              <stop stopColor="#1E2A38" />
                              <stop offset="1" stopColor="#1E2A38" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-x-0 bottom-0 grid grid-cols-7 gap-2">
                          {riskTrend.map((point) => (
                            <div key={point.label} className="flex items-center justify-center">
                              <p className="text-[11px] font-medium text-[#6B7280]">{point.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-sm font-semibold">Payment solution routing</p>
                    <p className="mt-1 text-xs text-[#6B7280]">Commercial options backed by risk documentation</p>
                    <div className="mt-5 space-y-3">
                      {paymentRoutes.map((route) => (
                        <div key={route.route} className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-semibold">{route.route}</p>
                            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1E2A38] ring-1 ring-[#E5E7EB]">{route.status}</span>
                          </div>
                          <p className="mt-2 text-xs leading-5 text-[#6B7280]">{route.detail}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 rounded-2xl bg-[#101820] p-5 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/55">Action queue</p>
                      <p className="mt-3 text-lg font-semibold tracking-tight">Prepare processor response before reserve review.</p>
                      <button onClick={() => router.push("/risk-audit")} className="mt-5 rounded-full bg-white px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#101820]">
                        Start review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="grid gap-5 lg:grid-cols-3">
              {trustStandards.map((item) => (
                <div key={item.title} className="rounded-2xl border border-[#E5E7EB] bg-[#FBFBFC] p-5 shadow-[0_18px_50px_rgba(30,42,56,0.05)]">
                  <div className="mb-5 h-px w-full bg-[linear-gradient(90deg,#C7CDD6,transparent)]" />
                  <h2 className="text-sm font-semibold tracking-[-0.01em] text-[#111111]">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#6B7280]">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid gap-10 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Dispute prevention</p>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">EDR, CDRN, filters, and payment-risk support in one operating layer.</h2>
                <p className="mt-4 text-sm leading-7 text-[#6B7280]">
                  HighRiskIntel is not only a dashboard. It helps high-risk merchants catch disputes earlier, respond to alerts faster, document processor conversations, and understand payment solution paths when accounts are under pressure.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    "Route EDR and CDRN alerts into a decision queue.",
                    "Filter high-risk orders before they become disputes.",
                    "Support high-risk payment solution planning across US-backed, offshore, and crypto-backed options.",
                  ].map((item) => (
                    <div key={item} className="flex gap-3 rounded-lg border border-[#E5E7EB] bg-white p-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#1E2A38]" />
                      <p className="text-sm leading-6 text-[#374151]">{item}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => router.push("/risk-audit")} className="mt-6 rounded-md border border-[#1E2A38] bg-white px-5 py-3 text-sm font-semibold text-[#1E2A38] hover:bg-[#F1F2F4]">
                  Check my risk setup
                </button>
              </div>

              <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {preventionLayers.map((layer) => (
                    <div key={layer.label} className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-5">
                      <span className="rounded-md border border-[#D1D5DB] bg-white px-2.5 py-1 text-xs font-semibold text-[#1E2A38]">{layer.label}</span>
                      <h3 className="mt-4 text-base font-semibold">{layer.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#6B7280]">{layer.copy}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Payment solution coverage</p>
                    <span className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-[#4B5563] ring-1 ring-[#E5E7EB]">High-risk friendly</span>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {["US-backed processing", "Offshore payment paths", "Crypto-backed solutions"].map((item) => (
                      <div key={item} className="rounded-lg border border-[#E5E7EB] bg-white p-4">
                        <p className="text-sm font-semibold">{item}</p>
                        <p className="mt-2 text-xs leading-5 text-[#6B7280]">Position the merchant with cleaner risk data, remediation notes, and processor-ready reporting for high-risk payment conversations.</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="product" className="border-b border-[#E5E7EB]">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="grid gap-10 lg:grid-cols-[390px_minmax(0,1fr)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Product</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] lg:text-[38px] lg:leading-tight">A complete product suite for high-risk payment operations.</h2>
                <p className="mt-4 text-sm leading-7 text-[#6B7280]">
                  HighRiskIntel combines software, alert workflows, processor-ready reporting, and payment solution support for merchants that normal payment providers often avoid.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => router.push("/payment-solutions")} className="rounded-md bg-[#1E2A38] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#111827]">
                    Explore payment solutions
                  </button>
                  <button onClick={() => router.push("/chargeback-alerts")} className="rounded-md border border-[#D1D5DB] bg-white px-4 py-2.5 text-sm font-semibold text-[#111111] hover:bg-[#F7F7F8]">
                    View alert products
                  </button>
                </div>
              </div>
              <div className="grid gap-4">
                {productLines.map((product) => (
                  <Link key={product.href} href={product.href} className="group rounded-2xl border border-[#E5E7EB] bg-white p-6 transition hover:-translate-y-1 hover:border-[#1E2A38] hover:shadow-[0_24px_70px_rgba(30,42,56,0.10)]">
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">{product.eyebrow}</p>
                        <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] lg:text-[22px]">{product.title}</h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6B7280]">{product.copy}</p>
                        <p className="mt-3 max-w-2xl border-l border-[#CBD2DC] pl-3 text-xs leading-6 text-[#4B5563]">{product.reason}</p>
                      </div>
                      <span className="w-fit rounded-md border border-[#D1D5DB] px-3 py-2 text-xs font-semibold text-[#1E2A38] group-hover:bg-[#1E2A38] group-hover:text-white">
                        Learn more
                      </span>
                    </div>
                    <div className="mt-5 grid gap-2 md:grid-cols-3">
                      {product.points.map((point) => (
                        <div key={point} className="rounded-lg bg-[#F7F7F8] px-3 py-2 text-xs font-medium text-[#4B5563]">
                          {point}
                        </div>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Advanced detail</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] lg:text-[38px] lg:leading-tight">From alert to acquirer file, every step is documented.</h2>
                <p className="mt-4 text-sm leading-7 text-[#6B7280]">
                  The front page now explains the whole product list: chargeback alert solutions, high-risk merchant account support, payment solutions, and acquirer readiness.
                </p>
              </div>
              <div className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    ["Alert intake", "EDR/CDRN/RDR alerts are logged with transaction context and required response timing."],
                    ["Risk decision", "Orders are triaged using filters for velocity, geography, descriptor, email quality, and amount."],
                    ["Payment path", "US-backed, offshore, and crypto-backed options are framed with clean merchant risk data."],
                    ["Acquirer pack", "Processor-facing notes show root cause, corrective actions, monitoring cadence, and current metrics."],
                  ].map(([title, copy]) => (
                    <div key={title} className="rounded-xl border border-[#E5E7EB] bg-white p-5">
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="mt-2 text-xs leading-6 text-[#6B7280]">{copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="use-cases" className="border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Use cases</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] lg:text-[42px] lg:leading-tight">Built for the moments when payment risk becomes urgent.</h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-[#6B7280]">
                Bigger than monitoring. These are the operating scenarios where high-risk merchants need a system, not a spreadsheet.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {useCases.map((item) => (
                <div key={item.title} className="group relative min-h-[230px] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#1E2A38] hover:bg-white hover:shadow-[0_24px_70px_rgba(30,42,56,0.12)]">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#1E2A38]/5 transition group-hover:scale-150 group-hover:bg-[#1E2A38]/10" />
                  <span className="relative rounded-md border border-[#D1D5DB] bg-white px-2.5 py-1 text-xs font-semibold text-[#1E2A38]">{item.metric}</span>
                  <h3 className="relative mt-8 text-xl font-semibold tracking-[-0.02em] lg:text-2xl">{item.title}</h3>
                  <p className="relative mt-4 text-sm leading-7 text-[#4B5563]">{item.copy}</p>
                  <div className="relative mt-6 h-1.5 rounded-full bg-[#E5E7EB]">
                    <div className="h-1.5 w-2/3 rounded-full bg-[#1E2A38] transition-all duration-500 group-hover:w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Find your path</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">Which of these describes your situation right now?</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#6B7280]">Select your most urgent problem and we will take you to the right page.</p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "My chargeback ratio is rising", sub: "Alerts, prevention, and ratio monitoring", href: "/chargeback-alerts" },
                { label: "I need a high-risk merchant account", sub: "US-backed and offshore processing options", href: "/payment-solutions" },
                { label: "My processor is holding my funds", sub: "Fund hold response and remediation", href: "/processor-fund-hold" },
                { label: "I need offshore or crypto-backed options", sub: "Alternative payment route planning", href: "/payment-solutions" },
                { label: "I need a risk audit or remediation plan", sub: "Free review of your current situation", href: "/risk-audit" },
                { label: "My processor asked for documentation", sub: "Acquirer-ready reports and risk files", href: "/acquirer-readiness" },
              ].map((item) => (
                <a key={item.label} href={item.href} className="group flex flex-col gap-2 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_8px_28px_rgba(17,24,39,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#1E2A38] hover:shadow-[0_20px_56px_rgba(17,24,39,0.10)]">
                  <p className="font-semibold text-[#111111] group-hover:text-[#1E2A38]">{item.label}</p>
                  <p className="text-xs leading-5 text-[#6B7280]">{item.sub}</p>
                  <span className="mt-1 text-xs font-semibold text-[#1E2A38] transition group-hover:translate-x-1">Get help →</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="industries" className="border-b border-[#E5E7EB]">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Industries</p>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">High-risk search paths with real commercial intent.</h2>
              </div>
              <Link href="/high-risk" className="text-sm font-semibold text-[#1E2A38] hover:underline">
                Browse all high-risk pages
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((industry) => (
                <Link key={industry.href} href={industry.href} className="rounded-lg border border-[#E5E7EB] bg-white p-4 text-sm font-semibold hover:border-[#1E2A38]">
                  {industry.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid gap-10 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Organic assets</p>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">Pages worth linking to, not just pages made for search.</h2>
                <p className="mt-4 text-sm leading-7 text-[#6B7280]">
                  Anonymous visitors need a reason to stay. Search engines need clear internal paths. Partners need something useful enough to link.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {freeGrowthAssets.map((asset) => (
                  <Link key={asset.href} href={asset.href} className="group rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#1E2A38] hover:bg-white hover:shadow-[0_24px_70px_rgba(30,42,56,0.10)]">
                    <p className="text-base font-semibold tracking-[-0.01em]">{asset.title}</p>
                    <p className="mt-3 text-sm leading-7 text-[#6B7280]">{asset.copy}</p>
                    <span className="mt-5 inline-flex text-xs font-semibold uppercase tracking-[0.1em] text-[#1E2A38]">
                      Open resource
                      <span className="ml-2 transition group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#1E2A38]">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 text-white md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Free audit</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Get a plain-English view of your current risk signals.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
                Send your situation and we will identify the first metrics, pages, or operational issues to review.
              </p>
            </div>
            <button onClick={() => router.push("/risk-audit")} className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#1E2A38] hover:bg-[#F1F2F4]">
              Request free audit
            </button>
          </div>
        </section>

        <footer className="border-t border-[#E5E7EB] bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div>
              <div className="flex items-center gap-3">
                <LogoMark />
                <div>
                  <p className="text-sm font-semibold">HighRiskIntel</p>
                  <a href="mailto:hello@highriskintel.com" className="text-xs text-[#6B7280] hover:text-[#111111]">
                    hello@highriskintel.com
                  </a>
                </div>
              </div>
              <p className="mt-5 max-w-sm text-xs leading-6 text-[#6B7280]">
                Merchant risk intelligence for high-risk teams managing chargebacks, alert programs, processor reviews, reserves, and payment solution planning.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#111111]">Products</p>
              <div className="mt-4 grid gap-3 text-xs text-[#6B7280]">
                <Link href="/chargeback-alerts" className="hover:text-[#111111]">Chargeback alerts</Link>
                <Link href="/high-risk-merchant-solutions" className="hover:text-[#111111]">High-risk merchant solutions</Link>
                <Link href="/payment-solutions" className="hover:text-[#111111]">Payment solutions</Link>
                <Link href="/acquirer-readiness" className="hover:text-[#111111]">Acquirer readiness</Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#111111]">Resources</p>
              <div className="mt-4 grid gap-3 text-xs text-[#6B7280]">
                <Link href="/free-tools" className="hover:text-[#111111]">Free tools</Link>
                <Link href="/blog" className="hover:text-[#111111]">Blog</Link>
                <Link href="/blog/all" className="hover:text-[#111111]">All articles</Link>
                <Link href="/link-to-us" className="hover:text-[#111111]">Link-to-us kit</Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#111111]">Company</p>
              <div className="mt-4 grid gap-3 text-xs text-[#6B7280]">
                <Link href="/risk-audit" className="hover:text-[#111111]">Free audit</Link>
                <Link href="/about" className="hover:text-[#111111]">About</Link>
                <Link href="/how-it-works" className="hover:text-[#111111]">How it works</Link>
                <Link href="/case-studies" className="hover:text-[#111111]">Case studies</Link>
                <Link href="/partners" className="hover:text-[#111111]">Partners</Link>
                <Link href="/contact" className="hover:text-[#111111]">Contact</Link>
                <Link href="/security" className="hover:text-[#111111]">Security</Link>
                <Link href="/privacy" className="hover:text-[#111111]">Privacy</Link>
                <Link href="/terms" className="hover:text-[#111111]">Terms</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-[#E5E7EB]">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-[#6B7280] sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 HighRiskIntel. Built for high-risk merchant operators.</p>
              <div>
                <Link href="/sitemap.xml" className="hover:text-[#111111]">Sitemap</Link>
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
    <div className="flex min-h-screen items-center justify-center bg-[#F7F7F8] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex w-fit justify-center">
            <LogoMark />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#111111]">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            {mode === "signin" ? "Sign in to your HighRiskIntel account" : "Start your free risk audit today"}
          </p>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-8">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#4B5563]">Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full rounded-md border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#111111] outline-none focus:border-[#1E2A38]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#4B5563]">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-md border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#111111] outline-none focus:border-[#1E2A38]"
              />
            </div>
            <button className="w-full rounded-md bg-[#1E2A38] py-3 text-sm font-semibold text-white hover:bg-[#111827]">
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </div>
          <p className="mt-6 text-center text-xs text-[#6B7280]">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => router.push(mode === "signin" ? "/signup" : "/signin")}
              className="font-semibold text-[#1E2A38] hover:underline"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
