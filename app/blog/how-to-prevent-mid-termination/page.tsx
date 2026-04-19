import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { BLOG_POSTS, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

const post = BLOG_POSTS.find((item) => item.slug === "how-to-prevent-mid-termination")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: absoluteUrl("/blog/how-to-prevent-mid-termination") },
  openGraph: {
    type: "article",
    url: absoluteUrl("/blog/how-to-prevent-mid-termination"),
    title: post.title,
    description: post.description,
    siteName: SITE_NAME,
    publishedTime: post.datePublished,
    modifiedTime: post.dateModified,
    authors: [SITE_NAME],
    tags: [post.tag, "MID termination", "chargeback prevention"],
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: post.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.description,
    images: [DEFAULT_OG_IMAGE],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.description,
  image: absoluteUrl(DEFAULT_OG_IMAGE),
  datePublished: post.datePublished,
  dateModified: post.dateModified,
  author: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl() },
  publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl(), logo: { "@type": "ImageObject", url: absoluteUrl(DEFAULT_OG_IMAGE) } },
  mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl("/blog/how-to-prevent-mid-termination") },
};

const STEPS = [
  {
    n: "01",
    title: "Know your chargeback rate at all times",
    body: "Most merchants only see their dispute ratio when their processor sends a monthly statement — by then it's often too late. Connect your processor API to get real-time visibility. Your target is under 0.65% (Visa's Early Warning threshold). If you're above 0.9%, treat it as an emergency.",
  },
  {
    n: "02",
    title: "Join EDR networks immediately",
    body: "Early Dispute Resolution networks (Ethoca, Verifi CDRN) alert you when a cardholder files a dispute — before it converts to a formal chargeback. You have 24–72 hours to issue a refund. The dispute never hits your ratio. This single tactic can cut your chargeback rate by 20–40%.",
  },
  {
    n: "03",
    title: "Refund before dispute, always",
    body: "When a customer calls to dispute a charge, refund it immediately — don't wait to 'win' the chargeback. A won chargeback still counts against your ratio. A refund costs you the margin on one sale. A chargeback costs you the margin, $15–$100 in fees, and a point against your ratio.",
  },
  {
    n: "04",
    title: "Use clear merchant descriptors",
    body: "A huge percentage of 'friendly fraud' chargebacks happen because customers don't recognize the charge on their statement. Your descriptor should include your brand name and a customer service phone number. Confusion-based disputes are completely preventable.",
  },
  {
    n: "05",
    title: "Implement 3DS2 authentication",
    body: "3D Secure 2 shifts chargeback liability to the issuing bank on fraud disputes (reason code 10.4). For high-risk merchants in verticals with elevated card-not-present fraud, this is non-negotiable. Yes, it adds friction — but a terminated MID adds more.",
  },
  {
    n: "06",
    title: "Score and decline high-risk transactions",
    body: "Not all orders are equal. Transactions from high-risk countries, with disposable email addresses, unusual velocity, or mismatched billing/shipping are far more likely to result in disputes. Declining 2% of orders can prevent 15–20% of chargebacks.",
  },
  {
    n: "07",
    title: "Send order confirmations and shipping updates",
    body: "The #1 reason for 'item not received' chargebacks is poor communication. Automated confirmation emails with tracking numbers eliminate most fulfillment disputes before they happen. Document every touchpoint.",
  },
  {
    n: "08",
    title: "Monitor your authorization rate",
    body: "A sudden drop in authorization rate is often a leading indicator of processor concern. If your approval rate drops from 87% to 79% without a clear reason, your processor's risk systems have flagged your account. Investigate immediately.",
  },
  {
    n: "09",
    title: "Communicate proactively with your processor",
    body: "If you know you're going to have a bad month — a viral product return wave, a fulfillment delay, a fraud attack — call your processor's risk team before they call you. Processors are far more likely to work with merchants who are transparent than those who go quiet when numbers get bad.",
  },
];

export default function PreventMIDTerminationPage() {
  return (
    <>
      <Script id="schema-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <div style={{ fontFamily: "'Inter',sans-serif", background: "#07070A", color: "#F1F1F3", minHeight: "100vh" }}>
        <nav style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(7,7,10,0.9)", backdropFilter: "blur(20px)", padding: "0 48px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: "-0.5px" }}>HighRiskIntel</Link>
            <Link href="/blog" style={{ fontSize: 14, color: "#8C8C9A" }}>← All articles</Link>
          </div>
        </nav>

        <article style={{ maxWidth: 720, margin: "0 auto", padding: "64px 48px 100px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#3B82F6", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", padding: "3px 10px", borderRadius: 100 }}>MID Protection</span>
            <span style={{ fontSize: 12, color: "#55555F" }}>April 3, 2026 · 8 min read</span>
          </div>

          <h1 style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.08, marginBottom: 24 }}>
            How to Prevent MID Termination: 9 Steps That Actually Work
          </h1>
          <p style={{ fontSize: 18, color: "#8C8C9A", lineHeight: 1.8, marginBottom: 48 }}>
            MID termination is the worst outcome for any high-risk merchant — and it&apos;s almost always preventable. Here&apos;s the playbook processors don&apos;t want you to have.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 32, marginBottom: 64 }}>
            {STEPS.map((step) => (
              <div key={step.n} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#3B82F6", fontVariantNumeric: "tabular-nums", letterSpacing: "0.5px", flexShrink: 0, paddingTop: 3, minWidth: 20 }}>{step.n}</span>
                <div style={{ borderLeft: "1px solid rgba(255,255,255,0.07)", paddingLeft: 24 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#F1F1F3", marginBottom: 10, letterSpacing: "-0.3px" }}>{step.title}</h2>
                  <p style={{ fontSize: 15, color: "#8C8C9A", lineHeight: 1.85 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(99,102,241,0.08))", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 14, padding: "36px 40px", textAlign: "center" }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 12 }}>Get ahead of MID termination</h3>
            <p style={{ fontSize: 14, color: "#8C8C9A", lineHeight: 1.75, marginBottom: 24, maxWidth: 440, margin: "0 auto 24px" }}>
              HighRiskIntel monitors your chargeback rate 24/7, alerts you when you&apos;re approaching thresholds, and tells you exactly which transactions to act on first.
            </p>
            <Link href="/signup" style={{ display: "inline-block", background: "linear-gradient(180deg,#4F8EF7 0%,#2563EB 100%)", color: "#fff", padding: "13px 28px", borderRadius: 9, fontSize: 14, fontWeight: 600 }}>
              Start protecting your MID →
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
