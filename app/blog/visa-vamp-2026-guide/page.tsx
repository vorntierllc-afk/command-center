import type { Metadata } from "next";
import Link from "next/link";
import { BlogArticleShell } from "@/components/blog/BlogArticleShell";
import { BLOG_POSTS, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

const slug = "visa-vamp-2026-guide";
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
    tags: [post.tag, "Visa Acquirer Monitoring Program", "VAMP ratio"],
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: post.title }],
  },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [DEFAULT_OG_IMAGE] },
};

const vampThresholds = [
  { category: "Standard (caution)", vampRatio: "≥ 0.5%", disputeCount: "≥ 75/month", consequence: "Processor likely starts internal monitoring. No formal program enrollment yet." },
  { category: "Excessive (formal program)", vampRatio: "≥ 0.9%", disputeCount: "≥ 1,000/month", consequence: "Formal VAMP enrollment. Acquirer receives notification. Remediation timeline required." },
  { category: "High-risk vertical standard", vampRatio: "≥ 0.5%", disputeCount: "≥ 75/month", consequence: "Same threshold, but processors for high-risk merchants often react before formal enrollment." },
];

const fraudTypes = [
  { code: "10.1–10.4", category: "Fraud disputes", included: "Yes", notes: "EMV counterfeit, lost/stolen card, card not present fraud" },
  { code: "11.x", category: "Authorization disputes", included: "Partial", notes: "Card recovery, expired card, no auth — these may feed fraud side of ratio" },
  { code: "12.x", category: "Processing errors", included: "No", notes: "Currency, duplicate, late presentment — not counted in VAMP ratio" },
  { code: "13.1–13.9", category: "Consumer disputes", included: "Yes", notes: "Merchandise not received, not as described, cancelled — counts as non-fraud" },
];

const remediationSteps = [
  { step: "1", action: "Audit last 30 days by reason code", detail: "Break disputes by fraud (10.x) vs service (13.x). The split determines whether the root cause is authorization controls, fulfillment, or customer service." },
  { step: "2", action: "Activate pre-dispute alert workflows", detail: "EDR and CDRN alerts can intercept eligible disputes before they formalize. Every deflected dispute improves your ratio before Visa counts it." },
  { step: "3", action: "Shorten refund latency to under 72 hours", detail: "A refund issued before the chargeback cutoff is typically not counted in VAMP. A refund after the chargeback files does not help your ratio." },
  { step: "4", action: "Tighten transaction screening for top fraud signals", detail: "Country/BIN mismatch, velocity patterns, proxy IP, disposable email, unusual ticket size. Block or require step-up auth on high-risk combinations." },
  { step: "5", action: "Fix descriptor confusion", detail: "Many 'not recognized' chargebacks (reason code 13.7) happen because the billing descriptor does not match the product name the customer saw at purchase." },
  { step: "6", action: "Build a processor-ready remediation file", detail: "Document what you found, what changed, when each change went live, and what you are measuring going forward. Processors need evidence, not promises." },
];

const faqItems = [
  {
    q: "What is the VAMP ratio and how is it calculated?",
    a: "The VAMP ratio (Visa Acquirer Monitoring Program) combines fraud disputes (reason codes 10.x) and non-fraud disputes (reason codes 13.x) and divides by total sales count. The formula: (reported fraud disputes + non-fraud disputes) / total monthly transactions. Effective April 1, 2025, Visa set the 'excessive' threshold at 0.9% with 1,000+ disputes per month. Acquirers can apply tighter thresholds than Visa's published limits.",
  },
  {
    q: "What happens when a merchant reaches the VAMP 'excessive' threshold?",
    a: "At the 0.9% excessive threshold, the merchant's acquirer is formally notified by Visa. The acquirer is then responsible for ensuring the merchant remediates — or they face their own acquirer-level consequences. In practice, this means the acquirer will either: (1) demand a remediation plan and timeline, (2) increase reserves or restrict processing volume, or (3) terminate the account. The processor's appetite for escalation varies, but few ISOs will absorb VAMP liability indefinitely.",
  },
  {
    q: "Do all disputes count toward the VAMP ratio?",
    a: "No. Processing error disputes (reason code 12.x) — like duplicates, late presentment, and currency issues — are generally not counted in the VAMP ratio. Fraud disputes (10.x) and consumer service disputes (13.x) are the primary inputs. Authorization disputes (11.x) are a partial contributor depending on how the acquirer reports. Your processor should be able to give you a breakdown of which disputes are counting against your VAMP exposure.",
  },
  {
    q: "Is VAMP the same as the Visa Dispute Monitoring Program (VDMP)?",
    a: "No. VDMP was an older program focused on chargeback count and ratio at the merchant level. VAMP is newer (effective 2025) and operates at the acquirer level, combining both fraud and non-fraud dispute pressure into a single ratio. VDMP still exists in some contexts, but VAMP is the primary mechanism Visa uses to pressure acquirers whose merchant portfolios have elevated dispute exposure.",
  },
  {
    q: "My chargeback ratio is 0.7%. Am I at VAMP risk?",
    a: "You are in the caution zone. At 0.7%, you are above the 0.5% internal monitoring threshold most acquirers use, but below the 0.9% formal enrollment trigger. However: (1) the VAMP calculation may be slightly different from your internal chargeback ratio calculation — ask your processor how they calculate it, (2) some processors use tighter thresholds than Visa's published limits, and (3) direction matters as much as level — if your ratio is rising, 0.7% today can become 0.9% in 30–60 days.",
  },
  {
    q: "Will fixing my VAMP ratio remove me from the program?",
    a: "Yes, but exit requires sustained improvement. Most programs require three consecutive months under the threshold before formal program exit. The faster you act and document the remediation, the faster the timeline. A well-documented remediation plan also gives your acquirer evidence to show Visa that active corrective measures are in place — which can affect how aggressively Visa pursues the acquirer during the program period.",
  },
];

export default function VisaVampGuidePage() {
  return (
    <BlogArticleShell
      slug={slug}
      sources={[
        { label: "Visa VAMP program fact sheet", href: "https://usa.visa.com/dam/VCOM/global/support-legal/documents/vamp-program-fact-sheet.pdf" },
        { label: "Stripe monitoring programs documentation", href: "https://docs.stripe.com/disputes/monitoring-programs" },
        { label: "Mastercard dispute monitoring overview", href: "https://www.mastercard.com/us/en/business/cybersecurity-fraud-prevention/dispute-management.html" },
      ]}
    >
      <section style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.22)", borderRadius: 12, padding: "24px 28px", marginBottom: 44 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>2026 merchant takeaway</h2>
        <p style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.9 }}>
          Visa&apos;s VAMP program sets a 0.9% excessive threshold for combined fraud and non-fraud dispute ratios, effective April 2025. High-risk merchants should treat 0.9% as a hard ceiling, not a target. Most processors begin internal intervention much earlier — at 0.5% or below. Track your combined ratio weekly, not monthly.
        </p>
      </section>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>What is VAMP and why it changed</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        VAMP stands for Visa Acquirer Monitoring Program. It operates at the acquirer level — meaning Visa monitors the acquiring bank&apos;s entire merchant portfolio, not just individual merchants. When a merchant exceeds the VAMP threshold, their acquirer is formally notified and held accountable for remediation.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        The key change from previous Visa programs is that VAMP combines fraud disputes (10.x reason codes) and non-fraud consumer disputes (13.x reason codes) into a single unified ratio. Before VAMP, merchants could have a high non-fraud dispute rate without triggering the fraud-focused monitoring programs. That gap is now closed.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        For high-risk merchants, this matters because service-side disputes — subscriptions billed without clear consent, products not matching descriptions, fulfillment failures — now count against the same ratio as fraud. A supplement merchant with clean fraud rates but messy subscription billing can now trigger VAMP through non-fraud disputes alone.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 20 }}>VAMP thresholds and what they trigger</h2>
      <div style={{ overflowX: "auto", marginBottom: 40 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              {["Level", "VAMP ratio", "Dispute count", "What happens"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vampThresholds.map((row, i) => (
              <tr key={row.category} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: i % 2 === 0 ? "#0C0C10" : "transparent" }}>
                <td style={{ padding: "12px 14px", fontWeight: 600, color: "#F1F1F3" }}>{row.category}</td>
                <td style={{ padding: "12px 14px", color: "#DC2626", fontWeight: 700 }}>{row.vampRatio}</td>
                <td style={{ padding: "12px 14px", color: "#A1A1AA" }}>{row.disputeCount}</td>
                <td style={{ padding: "12px 14px", color: "#A1A1AA" }}>{row.consequence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 20 }}>Which dispute types count toward VAMP</h2>
      <div style={{ overflowX: "auto", marginBottom: 40 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              {["Reason code", "Category", "Counts in VAMP?", "Notes"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fraudTypes.map((row, i) => (
              <tr key={row.code} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: i % 2 === 0 ? "#0C0C10" : "transparent" }}>
                <td style={{ padding: "12px 14px", fontWeight: 600, color: "#F1F1F3" }}>{row.code}</td>
                <td style={{ padding: "12px 14px", color: "#A1A1AA" }}>{row.category}</td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: row.included === "Yes" ? "rgba(220,38,38,0.12)" : row.included === "Partial" ? "rgba(245,158,11,0.12)" : "rgba(22,163,74,0.12)", color: row.included === "Yes" ? "#DC2626" : row.included === "Partial" ? "#D97706" : "#16A34A" }}>
                    {row.included}
                  </span>
                </td>
                <td style={{ padding: "12px 14px", color: "#A1A1AA" }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 20 }}>The VAMP ratio formula</h2>
      <div style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "24px 28px", marginBottom: 40 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Formula</p>
        <p style={{ fontSize: 18, color: "#F1F1F3", lineHeight: 1.6, fontFamily: "monospace" }}>
          VAMP ratio = (fraud disputes + non-fraud disputes) ÷ total monthly sales count
        </p>
        <p style={{ fontSize: 14, color: "#A1A1AA", lineHeight: 1.8, marginTop: 16 }}>
          Example: 180 fraud + 520 non-fraud disputes in a month with 80,000 transactions = 700 / 80,000 = <strong style={{ color: "#DC2626" }}>0.875% VAMP ratio</strong> — approaching the 0.9% excessive threshold.
        </p>
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Six steps to take if your ratio is trending up</h2>
      <ol style={{ display: "flex", flexDirection: "column", gap: 14, paddingLeft: 0, listStyle: "none", marginBottom: 40 }}>
        {remediationSteps.map((item) => (
          <li key={item.step} style={{ display: "flex", gap: 16, background: "#0C0C10", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 20px" }}>
            <span style={{ minWidth: 30, height: 30, borderRadius: "50%", background: "rgba(30,42,56,0.8)", color: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{item.step}</span>
            <div>
              <p style={{ fontWeight: 700, color: "#F1F1F3", marginBottom: 4, fontSize: 15 }}>{item.action}</p>
              <p style={{ fontSize: 14, color: "#A1A1AA", lineHeight: 1.75 }}>{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Frequently asked questions</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
        {faqItems.map((item) => (
          <div key={item.q} style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "22px 24px" }}>
            <p style={{ fontWeight: 700, color: "#F1F1F3", marginBottom: 10, fontSize: 15 }}>{item.q}</p>
            <p style={{ fontSize: 14, color: "#A1A1AA", lineHeight: 1.85 }}>{item.a}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>VAMP and MID protection</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        VAMP is not just a compliance acronym — it is an early warning layer for processor confidence. If your VAMP exposure is rising alongside declining authorization rate, increasing reserves, or slower settlements, you are seeing multiple risk signals moving simultaneously.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9 }}>
        Read the <Link href="/blog/mid-termination-warning-signs" style={{ color: "#60A5FA" }}>MID termination warning signs guide</Link> for the full picture, and check our <Link href="/blog/chargeback-prevention-high-risk-merchants" style={{ color: "#60A5FA" }}>chargeback prevention playbook</Link> for the operational response. If you are already in or near program enrollment, submit a <Link href="/risk-audit" style={{ color: "#60A5FA" }}>free risk audit request</Link> and we will help you build the remediation file.
      </p>
    </BlogArticleShell>
  );
}
