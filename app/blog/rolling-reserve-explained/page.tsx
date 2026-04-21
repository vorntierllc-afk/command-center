import type { Metadata } from "next";
import Link from "next/link";
import { BlogArticleShell } from "@/components/blog/BlogArticleShell";
import { BLOG_POSTS, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

const slug = "rolling-reserve-explained";
const post = BLOG_POSTS.find((item) => item.slug === slug)!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: absoluteUrl(`/blog/${slug}`) },
  openGraph: {
    type: "article",
    url: absoluteUrl(`/blog/${slug}`),
    title: post.title,
    description: post.description,
    siteName: SITE_NAME,
    publishedTime: post.datePublished,
    modifiedTime: post.dateModified,
    authors: [SITE_NAME],
    tags: [post.tag, "rolling reserve", "high-risk merchant"],
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: post.title }],
  },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [DEFAULT_OG_IMAGE] },
};

const reserveTypes = [
  {
    type: "Rolling reserve",
    description: "A percentage of each settlement is held back and released on a rolling schedule — typically 90–180 days later. The most common reserve type for high-risk merchants.",
    rate: "5–15% typical",
    release: "90–180 days",
  },
  {
    type: "Upfront reserve",
    description: "A fixed lump sum deposited before processing begins. Common for new accounts or merchants with no processing history.",
    rate: "1–3 months volume equivalent",
    release: "At account closure or per agreement",
  },
  {
    type: "Capped reserve",
    description: "Rolling reserve that stops accruing once a maximum dollar amount is reached. Better for merchants — the processor should disclose the cap at onboarding.",
    rate: "Same as rolling until cap",
    release: "Same as rolling after cap hit",
  },
  {
    type: "Enhanced reserve",
    description: "Processor increases the reserve percentage above the original agreement — typically triggered by a dispute ratio spike or risk event. A warning that the relationship is under pressure.",
    rate: "Varies — often 15–25%",
    release: "Often extended or held until relationship resolves",
  },
];

const scenarioExample = [
  { month: "Jan", processed: "$200,000", reserveHeld: "$20,000", reserveReleased: "$0", netPayout: "$180,000" },
  { month: "Feb", processed: "$210,000", reserveHeld: "$21,000", reserveReleased: "$0", netPayout: "$189,000" },
  { month: "Mar", processed: "$195,000", reserveHeld: "$19,500", reserveReleased: "$0", netPayout: "$175,500" },
  { month: "Apr", processed: "$205,000", reserveHeld: "$20,500", reserveReleased: "$20,000", netPayout: "$184,500 + $20K release" },
  { month: "May", processed: "$215,000", reserveHeld: "$21,500", reserveReleased: "$21,000", netPayout: "$193,500 + $21K release" },
];

const faqItems = [
  {
    q: "Is a rolling reserve normal for high-risk merchants?",
    a: "Yes. A rolling reserve at 5–10% is standard operating practice for high-risk merchant accounts. It is not a sign of impending termination. The reserve exists because processors need security against future chargebacks or refunds that may arrive after a settlement batch has paid out. If your reserve is at 10% and your dispute ratio is under 1%, the relationship is likely healthy.",
  },
  {
    q: "When does a rolling reserve become a problem?",
    a: "A rolling reserve becomes a problem when: (1) the rate increases without a clear reason, (2) the release schedule is extended beyond what your agreement states, (3) the hold percentage goes above 20%, (4) it arrives simultaneously with a payout hold or processor review letter, or (5) you are running on tight cash flow and the held amount is material to operations.",
  },
  {
    q: "Can I negotiate a lower reserve rate?",
    a: "Yes, typically after 6–12 months of clean processing history. If your chargeback ratio has been consistently below 1%, refund rate is under control, and your authorization rate is stable, you have a reasonable case to request a reserve step-down. Come to that conversation with 6 months of metrics — not just a verbal ask.",
  },
  {
    q: "What happens to my reserve if my account gets terminated?",
    a: "The processor holds the reserve until the chargeback risk window expires for your last batch of transactions — typically 120–180 days. Any chargebacks, refunds, or fees during that period are deducted from the reserve. The remainder is released. If the processor claims more in chargebacks or fees than the reserve amount, they may pursue the balance separately. Always document the termination in writing and track the release timeline.",
  },
  {
    q: "Can an offshore processor hold reserves for longer?",
    a: "Yes, and this is one of the most common offshore processing surprises. Offshore reserves are often 10–15% held for 120–180 days, but some agreements extend to 12–24 months or tie release to chargeback ratio targets. Read the reserve release clause before signing any offshore processing agreement. Ask specifically: 'Under what conditions is my reserve released, and what is the maximum hold period?'",
  },
  {
    q: "Does a reserve protect me from a full payout hold?",
    a: "No. A rolling reserve and a payout hold are separate mechanisms. A processor can have a reserve in place and still place a full payout hold if the account triggers a separate risk event. The reserve is a security deposit — it does not prevent other risk actions.",
  },
];

export default function RollingReserveExplainedPage() {
  return (
    <BlogArticleShell
      slug={slug}
      sources={[
        { label: "Mastercard reserve and chargeback program overview", href: "https://www.mastercard.com/us/en/business/cybersecurity-fraud-prevention/dispute-management.html" },
        { label: "Visa rules and compliance — merchant category", href: "https://usa.visa.com/support/consumer/visa-rules.html" },
      ]}
    >
      <section style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "24px 28px", marginBottom: 44 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Quick answer</h2>
        <p style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.9 }}>
          A rolling reserve is money your processor holds back from each settlement as security against future chargebacks or refunds. For high-risk merchants, reserves are normal and expected — typically 5–15% held for 90–180 days. A reserve becomes urgent when the rate increases unexpectedly, the release schedule changes, or it arrives alongside a payout hold or processor review letter.
        </p>
      </section>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>How rolling reserves work</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        When you process transactions, your processor does not immediately release 100% of the settled funds. Instead, a percentage — typically 5–15% for high-risk accounts — is held back and placed into a reserve account. That reserve is then released on a rolling schedule, usually 90–180 days later.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        The logic is simple: if a customer files a chargeback 90 days after a transaction, the processor needs to be able to cover it even if your account is no longer active. The reserve is the buffer.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 20 }}>The four types of reserves</h2>
      <div style={{ overflowX: "auto", marginBottom: 40 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}>Reserve type</th>
              <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}>What it means</th>
              <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}>Typical rate</th>
              <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}>Release timing</th>
            </tr>
          </thead>
          <tbody>
            {reserveTypes.map((row, i) => (
              <tr key={row.type} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: i % 2 === 0 ? "#0C0C10" : "transparent" }}>
                <td style={{ padding: "12px 14px", fontWeight: 600, color: "#F1F1F3" }}>{row.type}</td>
                <td style={{ padding: "12px 14px", color: "#A1A1AA" }}>{row.description}</td>
                <td style={{ padding: "12px 14px", color: "#A1A1AA", whiteSpace: "nowrap" }}>{row.rate}</td>
                <td style={{ padding: "12px 14px", color: "#A1A1AA" }}>{row.release}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>How the math works: a concrete example</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        A supplement merchant processing $200K/month with a 10% rolling reserve at 90-day release schedule would see their cash flow look like this:
      </p>
      <div style={{ overflowX: "auto", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              {["Month", "Processed", "10% reserve held", "Reserve released (90-day lag)", "Net payout"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scenarioExample.map((row, i) => (
              <tr key={row.month} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: i % 2 === 0 ? "#0C0C10" : "transparent" }}>
                <td style={{ padding: "10px 12px", fontWeight: 600, color: "#F1F1F3" }}>{row.month}</td>
                <td style={{ padding: "10px 12px", color: "#A1A1AA" }}>{row.processed}</td>
                <td style={{ padding: "10px 12px", color: "#DC2626" }}>{row.reserveHeld}</td>
                <td style={{ padding: "10px 12px", color: row.reserveReleased === "$0" ? "#6B7280" : "#16A34A" }}>{row.reserveReleased || "—"}</td>
                <td style={{ padding: "10px 12px", color: "#A1A1AA" }}>{row.netPayout}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, marginBottom: 40 }}>
        By month 4, the reserve releases start flowing back — making the net cash impact neutral for steady-state operations. The initial 3-month startup is where cash flow pressure is highest.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>When a reserve becomes a warning signal</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        A stable rolling reserve is not a problem. The signals that matter are changes: an unexpected rate increase, an extended release schedule, or a reserve change arriving alongside other risk escalations.
      </p>
      <ul style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36, paddingLeft: 0, listStyle: "none" }}>
        {[
          "Reserve rate increases without your chargeback ratio changing — the processor is recalibrating risk exposure unilaterally",
          "Release schedule is extended beyond what your agreement states — read the exact terms in your agreement",
          "Enhanced reserve notice arrives alongside a risk review letter or payout hold",
          "Reserve is increasing at the same time as authorization rate declines — the processor may be reducing their exposure across all levers",
          "Total reserve balance is now more than 2 months of operating expenses — a business continuity risk",
        ].map((item) => (
          <li key={item} style={{ display: "flex", gap: 12, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: 10, padding: "14px 18px" }}>
            <span style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.8 }}>{item}</span>
          </li>
        ))}
      </ul>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>What to monitor weekly</h2>
      <ul style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36, paddingLeft: 0, listStyle: "none" }}>
        {[
          "Reserve percentage and whether it has changed since account opening",
          "Exact release schedule — which month's reserve was just released",
          "Dispute count and chargeback ratio direction (week over week)",
          "Refund volume and refund latency (time from request to completion)",
          "Authorization rate — declines often precede reserve changes",
          "Any processor communications mentioning risk review, account review, or underwriting",
        ].map((item) => (
          <li key={item} style={{ display: "flex", gap: 12, color: "#A1A1AA", fontSize: 15, lineHeight: 1.8 }}>
            <span style={{ color: "#22C55E", fontWeight: 900, flexShrink: 0 }}>✓</span>
            {item}
          </li>
        ))}
      </ul>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Frequently asked questions</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
        {faqItems.map((item) => (
          <div key={item.q} style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "22px 24px" }}>
            <p style={{ fontWeight: 700, color: "#F1F1F3", marginBottom: 10, fontSize: 15 }}>{item.q}</p>
            <p style={{ fontSize: 14, color: "#A1A1AA", lineHeight: 1.85 }}>{item.a}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Where HighRiskIntel fits</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        HighRiskIntel tracks reserve pressure alongside dispute ratio, refund latency, and authorization health — giving you a single view of account-level risk instead of monitoring each metric in isolation. When reserve changes appear alongside other signals, the system surfaces the combination as a review item.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9 }}>
        If your reserve just changed, or if a payout hold was placed alongside a reserve escalation, start with the <Link href="/processor-fund-hold" style={{ color: "#60A5FA" }}>processor fund hold guide</Link> or submit a <Link href="/risk-audit" style={{ color: "#60A5FA" }}>free risk audit request</Link>.
      </p>
    </BlogArticleShell>
  );
}
