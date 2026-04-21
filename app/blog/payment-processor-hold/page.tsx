import type { Metadata } from "next";
import Link from "next/link";
import { BlogArticleShell } from "@/components/blog/BlogArticleShell";
import { BLOG_POSTS, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

const slug = "payment-processor-hold";
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
    tags: [post.tag, "processor hold", "payout hold"],
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: post.title }],
  },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [DEFAULT_OG_IMAGE] },
};

const holdTypes = [
  { type: "Rolling reserve", description: "Pre-agreed percentage held back from each settlement, released on a 90–180 day rolling schedule. This is normal — not an emergency.", urgency: "Normal" },
  { type: "Enhanced reserve", description: "Processor increases the reserve percentage above the original agreement — usually triggered by dispute ratio movement. Still within the relationship.", urgency: "Warning" },
  { type: "Payout hold", description: "Processor pauses all settlements entirely. This is an emergency risk action triggered by a specific event or threshold breach.", urgency: "Urgent" },
  { type: "Termination hold", description: "Account is being closed and funds are held pending final dispute resolution — typically 90–180 days.", urgency: "Critical" },
];

const firstSteps = [
  { step: "1", action: "Get the reason in writing", detail: "Email the processor immediately asking for the specific trigger, the amount held, and the release criteria. Do not accept a phone call." },
  { step: "2", action: "Pull your chargeback ratio for last 30/60/90 days", detail: "You need to know your actual numbers before you respond. Check dispute count, dispute amount, and total transaction volume." },
  { step: "3", action: "Check for a recent volume spike", detail: "A sudden volume increase — from a campaign, affiliate, or seasonal push — is one of the most common non-dispute hold triggers." },
  { step: "4", action: "Document your fulfillment evidence", detail: "Gather shipping confirmations, delivery receipts, or digital delivery logs. If the hold is fulfillment-related, this is your immediate defense." },
  { step: "5", action: "Do not immediately move all volume", detail: "Shifting all volume to a new processor without a plan can accelerate termination at your current processor. Get advice before you move." },
  { step: "6", action: "Prepare a written remediation response", detail: "A risk team needs to see root cause, controls in place, and a monitoring plan — not just an apology email." },
];

const faqItems = [
  {
    q: "How long can my processor legally hold my funds?",
    a: "There is no universal legal limit — hold duration is governed by your merchant processing agreement. Most agreements allow processors to hold funds for 90–180 days, or until the chargeback risk window for your last transactions expires. Read the 'reserve' and 'hold' clauses in your agreement carefully. If funds are held beyond the stated period with no clear reason, consult a payments attorney.",
  },
  {
    q: "What is the difference between a rolling reserve and a payout hold?",
    a: "A rolling reserve is a pre-agreed security deposit — a percentage of gross volume held back and released on a rolling schedule, typically 90–180 days later. A payout hold is a unilateral decision by the processor to stop releasing all settlements — usually triggered by a risk event like a dispute ratio spike. Rolling reserves are normal and expected. Payout holds are emergency risk actions that require a response.",
  },
  {
    q: "Will disputing the hold with my bank help?",
    a: "No. Attempting to chargeback or reverse a processor hold through your bank constitutes a contract breach. It almost always results in immediate account termination and placement on the MATCH/TMF list, which blocks you from most processing relationships for up to 5 years. Do not do this regardless of how frustrated you are.",
  },
  {
    q: "Can I open a new merchant account while my funds are held?",
    a: "Yes, but carefully. Opening a backup account is usually the right move if the hold will extend beyond 30 days. However, do not terminate your existing account until the hold is resolved — you may lose negotiation leverage on fund release. Some processors will release held funds faster if the relationship ends cleanly rather than in a dispute.",
  },
  {
    q: "What should I include in my remediation response to the processor?",
    a: "A credible remediation response includes: (1) the specific cause — what metric triggered the hold, (2) root cause — why it happened (campaign, affiliate, product issue, fulfillment lag), (3) corrective actions already implemented with exact dates, (4) monitoring plan showing what you are tracking going forward, and (5) a projected metrics improvement timeline. Processors want to release holds — they need a reason that satisfies their risk team.",
  },
  {
    q: "What happens to my held funds if the account gets terminated?",
    a: "The processor still owes you the held funds, but the release timeline extends to the chargeback window expiry for your last transactions — typically 120–180 days. The processor will deduct any outstanding chargebacks, fees, and penalties from the held amount before releasing the remainder. You may need a payments attorney if the processor becomes unresponsive.",
  },
];

export default function PaymentProcessorHoldPage() {
  return (
    <BlogArticleShell
      slug={slug}
      sources={[
        { label: "Mastercard dispute management overview", href: "https://www.mastercard.com/us/en/business/cybersecurity-fraud-prevention/dispute-management.html" },
        { label: "Visa merchant hold and reserve policies", href: "https://usa.visa.com/support/small-business/security-compliance.html" },
      ]}
    >
      <section style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.22)", borderRadius: 12, padding: "24px 28px", marginBottom: 44 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Quick answer</h2>
        <p style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.9 }}>
          A processor fund hold is a risk escalation, not necessarily account termination. How you respond in the first 48–72 hours determines whether funds get released and whether the account survives. Start with documentation — get the reason in writing, pull your dispute data, and prepare a structured remediation response before you do anything else.
        </p>
      </section>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Why processors hold funds</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        Funds can be held when a processor believes future chargebacks, refunds, or compliance issues could exceed the normal risk tolerance for the account. The hold is a risk-control mechanism — it is not random. That means the fastest path forward is not arguing. It is showing that you understand the issue, have contained the source, and can measure improvement.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        The most common triggers are: elevated chargeback ratio, sudden volume spike, rising refund rate, compliance flag from a network audit, or a negative option / subscription dispute pattern.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 20 }}>The four types of holds — and which one you have</h2>

      <div style={{ overflowX: "auto", marginBottom: 40 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}>Hold type</th>
              <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}>What it means</th>
              <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {holdTypes.map((row, i) => (
              <tr key={row.type} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: i % 2 === 0 ? "#0C0C10" : "transparent" }}>
                <td style={{ padding: "12px 14px", fontWeight: 600, color: "#F1F1F3" }}>{row.type}</td>
                <td style={{ padding: "12px 14px", color: "#A1A1AA" }}>{row.description}</td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{
                    display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                    background: row.urgency === "Normal" ? "rgba(22,163,74,0.12)" : row.urgency === "Warning" ? "rgba(245,158,11,0.12)" : row.urgency === "Urgent" ? "rgba(239,68,68,0.12)" : "rgba(220,38,38,0.16)",
                    color: row.urgency === "Normal" ? "#16A34A" : row.urgency === "Warning" ? "#D97706" : "#DC2626",
                  }}>
                    {row.urgency}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>The six steps to take in the first 72 hours</h2>
      <ol style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 0, listStyle: "none", marginBottom: 40 }}>
        {firstSteps.map((item) => (
          <li key={item.step} style={{ display: "flex", gap: 16, background: "#0C0C10", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 20px" }}>
            <span style={{ minWidth: 30, height: 30, borderRadius: "50%", background: "rgba(30,42,56,0.8)", color: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{item.step}</span>
            <div>
              <p style={{ fontWeight: 700, color: "#F1F1F3", marginBottom: 4, fontSize: 15 }}>{item.action}</p>
              <p style={{ fontSize: 14, color: "#A1A1AA", lineHeight: 1.75 }}>{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>What to include in your remediation response</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        A processor risk team needs a written document — not a phone call or a vague email. The document needs to show: what happened, why it happened, what has already been fixed, what you are monitoring going forward, and a projected timeline for metric improvement.
      </p>

      <div style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "24px 28px", marginBottom: 40 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#F1F1F3", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Remediation response structure</p>
        {[
          ["1. Specific trigger", "Which metric breached, by how much, and when"],
          ["2. Root cause", "Why it happened — campaign, affiliate, fulfillment lag, descriptor confusion, product issue"],
          ["3. Corrective actions", "What you changed, with exact dates and evidence"],
          ["4. Monitoring plan", "What you are measuring, how often, and who owns it"],
          ["5. Projected improvement", "Expected metric trajectory over next 30, 60, 90 days"],
        ].map(([label, detail]) => (
          <div key={label} style={{ display: "flex", gap: 16, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ minWidth: 140, fontWeight: 700, fontSize: 13, color: "#9CA3AF" }}>{label}</span>
            <span style={{ fontSize: 13, color: "#A1A1AA", lineHeight: 1.7 }}>{detail}</span>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>What not to do when your funds are held</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        There are several common mistakes that turn a recoverable hold into a permanent termination or a MATCH listing.
      </p>
      <ul style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36, paddingLeft: 0, listStyle: "none" }}>
        {[
          "Do not attempt to chargeback or reverse the hold through your bank — this is a contract breach that triggers MATCH listing",
          "Do not move all volume to a new processor without a plan — it can accelerate termination at your current one",
          "Do not ignore processor communications — every day without a response makes the hold longer",
          "Do not accept verbal explanations — get everything in writing, especially the release criteria",
          "Do not threaten legal action immediately — it closes off negotiation channels that could release funds faster",
        ].map((item) => (
          <li key={item} style={{ display: "flex", gap: 12, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 10, padding: "14px 18px" }}>
            <span style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.75 }}>{item}</span>
          </li>
        ))}
      </ul>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Planning a backup processing path</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        If the hold is going to last weeks, you need a parallel payment path now — not after the account terminates. The application process for a new processor takes time, and most processors check your recent history including the hold situation.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        Go into any new processor application with your remediation documentation ready. A merchant who can explain what happened, what changed, and how they are monitoring it is dramatically more approvable than a merchant who submits a blank application and hopes for the best.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 36 }}>
        See our <Link href="/payment-solutions" style={{ color: "#60A5FA" }}>high-risk payment solutions guide</Link> for the comparison of US-backed, offshore, and crypto-backed options based on your vertical and dispute profile.
      </p>

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
        HighRiskIntel analyzes your dispute data, identifies the root cause of the hold, and produces the structured remediation file your processor needs to release it. We also assess backup payment route options so you are not starting from zero if the relationship cannot be saved.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9 }}>
        If your processor just placed a hold, start with the <Link href="/processor-fund-hold" style={{ color: "#60A5FA" }}>processor fund hold response guide</Link> or submit a <Link href="/risk-audit" style={{ color: "#60A5FA" }}>free risk audit request</Link> and we will map the situation.
      </p>
    </BlogArticleShell>
  );
}
