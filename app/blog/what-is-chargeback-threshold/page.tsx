import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { BLOG_POSTS, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

const post = BLOG_POSTS.find((item) => item.slug === "what-is-chargeback-threshold")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: absoluteUrl("/blog/what-is-chargeback-threshold") },
  openGraph: {
    type: "article",
    url: absoluteUrl("/blog/what-is-chargeback-threshold"),
    title: post.title,
    description: post.description,
    siteName: SITE_NAME,
    publishedTime: post.datePublished,
    modifiedTime: post.dateModified,
    authors: [SITE_NAME],
    tags: [post.tag, "chargeback thresholds", "high-risk merchant account"],
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
  mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl("/blog/what-is-chargeback-threshold") },
};

export default function ChargebackThresholdPage() {
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
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#3B82F6", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", padding: "3px 10px", borderRadius: 100 }}>Chargebacks</span>
            <span style={{ fontSize: 12, color: "#55555F" }}>April 5, 2026 · 6 min read</span>
          </div>

          <h1 style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.08, marginBottom: 24 }}>
            Visa & Mastercard Chargeback Thresholds Explained (2026)
          </h1>
          <p style={{ fontSize: 18, color: "#8C8C9A", lineHeight: 1.8, marginBottom: 48 }}>
            Every high-risk merchant needs to know these numbers. Exceed them and your processor will terminate your MID — often without warning.
          </p>

          <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "24px 28px", marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#3B82F6", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>Quick Reference</p>
            <p style={{ fontSize: 14, color: "#F1F1F3", lineHeight: 1.8, margin: 0 }}>
              <strong>Visa Early Warning:</strong> 0.65% &nbsp;|&nbsp; <strong>Visa Standard:</strong> 0.9% &nbsp;|&nbsp; <strong>Visa Excessive (termination):</strong> 1.8%<br />
              <strong>Mastercard threshold:</strong> 1.0% with 100+ disputes/month
            </p>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 16, marginTop: 48 }}>What is a chargeback threshold?</h2>
          <p style={{ fontSize: 16, color: "#8C8C9A", lineHeight: 1.9, marginBottom: 24 }}>
            A chargeback threshold is the maximum dispute rate a merchant can maintain before their card network (Visa or Mastercard) places them in a monitoring program — or terminates their ability to accept cards entirely. Your chargeback rate is calculated monthly as: <strong style={{ color: "#F1F1F3" }}>number of chargebacks ÷ number of transactions × 100</strong>.
          </p>
          <p style={{ fontSize: 16, color: "#8C8C9A", lineHeight: 1.9, marginBottom: 48 }}>
            Processors are required by Visa and Mastercard to enforce these thresholds. If you exceed them for multiple consecutive months, your acquirer will terminate your MID (Merchant ID) and potentially place you on the MATCH list — a permanent industry blacklist.
          </p>

          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 16, marginTop: 48 }}>Visa Chargeback Monitoring Program (VAMP)</h2>
          <p style={{ fontSize: 16, color: "#8C8C9A", lineHeight: 1.9, marginBottom: 16 }}>
            Visa's program has three escalating tiers:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
            {[
              { tier: "Early Warning", rate: "0.65%", count: "75+ disputes", color: "#EAB308", action: "Processor notified. You should take immediate action." },
              { tier: "Standard", rate: "0.9%", count: "100+ disputes", color: "#F97316", action: "Formal monitoring begins. Monthly fees apply ($25–$50/dispute)." },
              { tier: "Excessive", rate: "1.8%", count: "1,000+ disputes", color: "#EF4444", action: "Highest fees. MID termination imminent if not resolved within 3 months." },
            ].map(t => (
              <div key={t.tier} style={{ background: "#0C0C10", border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 10, padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.color, flexShrink: 0, marginTop: 5 }} />
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#F1F1F3", marginBottom: 4 }}>{t.tier}: {t.rate} / {t.count}</p>
                  <p style={{ fontSize: 13, color: "#8C8C9A", lineHeight: 1.7 }}>{t.action}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 16, marginTop: 48 }}>Mastercard Excessive Chargeback Program (ECP)</h2>
          <p style={{ fontSize: 16, color: "#8C8C9A", lineHeight: 1.9, marginBottom: 48 }}>
            Mastercard's threshold is simpler: <strong style={{ color: "#F1F1F3" }}>1.0% chargeback rate AND 100+ chargebacks per month</strong>. Both conditions must be true. Merchants in ECP pay $1,000/month in fees and face escalating penalties. At 1.5%+ for 3 months, termination is standard.
          </p>

          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 16, marginTop: 48 }}>What happens when you breach a threshold?</h2>
          <p style={{ fontSize: 16, color: "#8C8C9A", lineHeight: 1.9, marginBottom: 24 }}>
            Breaching a threshold triggers a sequence that most merchants don't survive:
          </p>
          <ol style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 0, listStyle: "none", marginBottom: 48 }}>
            {[
              "Your acquirer receives a notification from Visa/Mastercard.",
              "Your processing fees increase immediately (up to $100/dispute).",
              "You receive a formal remediation plan request.",
              "If not resolved in 3–6 months, your MID is terminated.",
              "You may be placed on the MATCH list, blocking you from new accounts.",
            ].map((step, i) => (
              <li key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "#0C0C10", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "16px 20px" }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#60A5FA", flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 14, color: "#8C8C9A", lineHeight: 1.7, paddingTop: 2 }}>{step}</span>
              </li>
            ))}
          </ol>

          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 16, marginTop: 48 }}>How to stay below the threshold</h2>
          <p style={{ fontSize: 16, color: "#8C8C9A", lineHeight: 1.9, marginBottom: 24 }}>
            The most effective tactics for high-risk merchants:
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 0, listStyle: "none", marginBottom: 48 }}>
            {[
              "Connect to EDR networks (Ethoca, Verifi) to receive dispute alerts before they become chargebacks",
              "Issue refunds proactively on flagged transactions — a refund costs you the margin, a chargeback costs you the margin plus $25–$100 in fees plus the dispute counts against your ratio",
              "Implement 3DS2 authentication to shift liability to the issuing bank on fraud disputes",
              "Score every transaction before processing and decline high-risk orders",
              "Use clear merchant descriptors so customers recognize your charge and don't dispute out of confusion",
              "Monitor your ratio weekly — don't wait for month-end statements",
            ].map((tip, i) => (
              <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 14, color: "#8C8C9A", lineHeight: 1.75 }}>
                <span style={{ color: "#22C55E", fontWeight: 700, flexShrink: 0 }}>✓</span>
                {tip}
              </li>
            ))}
          </ul>

          <div style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(99,102,241,0.08))", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 14, padding: "36px 40px", textAlign: "center" }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 12 }}>Monitor your chargeback rate in real time</h3>
            <p style={{ fontSize: 14, color: "#8C8C9A", lineHeight: 1.75, marginBottom: 24, maxWidth: 440, margin: "0 auto 24px" }}>
              HighRiskIntel shows you your exact dispute ratio, flags transactions before they become chargebacks, and alerts you when you're approaching Visa/Mastercard thresholds.
            </p>
            <Link href="/signup" style={{ display: "inline-block", background: "linear-gradient(180deg,#4F8EF7 0%,#2563EB 100%)", color: "#fff", padding: "13px 28px", borderRadius: 9, fontSize: 14, fontWeight: 600 }}>
              Start monitoring free →
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
