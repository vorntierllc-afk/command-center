import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { BLOG_POSTS, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

const post = BLOG_POSTS.find((item) => item.slug === "high-risk-merchant-guide")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: absoluteUrl("/blog/high-risk-merchant-guide") },
  openGraph: {
    type: "article",
    url: absoluteUrl("/blog/high-risk-merchant-guide"),
    title: post.title,
    description: post.description,
    siteName: SITE_NAME,
    publishedTime: post.datePublished,
    modifiedTime: post.dateModified,
    authors: [SITE_NAME],
    tags: [post.tag, "high-risk merchant account", "merchant processing"],
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
  mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl("/blog/high-risk-merchant-guide") },
};

const HIGH_RISK_INDUSTRIES = [
  "Nutraceuticals & Supplements", "Adult Content", "Online Gambling & Gaming",
  "Cryptocurrency & Digital Assets", "Travel & Timeshares", "Firearms & Ammunition",
  "CBD & Cannabis", "Debt Collection", "Subscription / Trial Offers", "Forex & Trading",
  "Online Pharmacies", "Telemarketing", "E-cigarettes & Vaping",
];

export default function HighRiskMerchantGuidePage() {
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
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#3B82F6", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", padding: "3px 10px", borderRadius: 100 }}>Getting Started</span>
            <span style={{ fontSize: 12, color: "#55555F" }}>April 1, 2026 · 10 min read</span>
          </div>

          <h1 style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.08, marginBottom: 24 }}>
            The Complete Guide to High-Risk Merchant Accounts in 2026
          </h1>
          <p style={{ fontSize: 18, color: "#8C8C9A", lineHeight: 1.8, marginBottom: 48 }}>
            What makes a merchant account high-risk, how to find a processor, what fees to expect, and how to keep your account alive long-term.
          </p>

          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 16 }}>What is a high-risk merchant account?</h2>
          <p style={{ fontSize: 16, color: "#8C8C9A", lineHeight: 1.9, marginBottom: 24 }}>
            A high-risk merchant account is a payment processing account issued to businesses that banks and card networks classify as elevated risk. This classification affects your processing fees, the reserves your acquirer holds against potential losses, and the level of monitoring your account receives.
          </p>
          <p style={{ fontSize: 16, color: "#8C8C9A", lineHeight: 1.9, marginBottom: 48 }}>
            Being classified as high-risk doesn&apos;t mean your business is doing anything wrong — it means you operate in an industry with statistically higher chargeback rates, regulatory exposure, or reputational risk. The classification is largely mechanical.
          </p>

          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 16 }}>Which industries are considered high-risk?</h2>
          <p style={{ fontSize: 16, color: "#8C8C9A", lineHeight: 1.9, marginBottom: 20 }}>
            The following industries are routinely classified as high-risk by major banks and processors:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 48 }}>
            {HIGH_RISK_INDUSTRIES.map(ind => (
              <span key={ind} style={{ fontSize: 13, color: "#8C8C9A", background: "#0C0C10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 14px" }}>{ind}</span>
            ))}
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 16 }}>What fees should you expect?</h2>
          <p style={{ fontSize: 16, color: "#8C8C9A", lineHeight: 1.9, marginBottom: 20 }}>
            High-risk processing costs significantly more than standard merchant accounts:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 48 }}>
            {[
              { label: "Processing rate", value: "2.5% – 4.5% per transaction (vs 1.5–2.5% standard)" },
              { label: "Monthly fee", value: "$25 – $100/month" },
              { label: "Chargeback fee", value: "$25 – $100 per dispute" },
              { label: "Rolling reserve", value: "5% – 15% of volume held for 90–180 days" },
              { label: "Setup fee", value: "$0 – $500 depending on processor" },
            ].map(f => (
              <div key={f.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "14px 20px", background: "#0C0C10", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10 }}>
                <span style={{ fontSize: 13, color: "#55555F", fontWeight: 500 }}>{f.label}</span>
                <span style={{ fontSize: 13, color: "#F1F1F3", maxWidth: "60%", textAlign: "right" }}>{f.value}</span>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 16 }}>What is a rolling reserve?</h2>
          <p style={{ fontSize: 16, color: "#8C8C9A", lineHeight: 1.9, marginBottom: 48 }}>
            A rolling reserve is a percentage of your processing volume that your acquirer holds back to cover potential chargebacks and refunds. Typically 5–15% of volume is held for 90–180 days, then released on a rolling basis. This is normal for high-risk accounts and not a sign of problems — but it has significant cash flow implications you need to plan for.
          </p>

          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 16 }}>How to keep your merchant account alive</h2>
          <p style={{ fontSize: 16, color: "#8C8C9A", lineHeight: 1.9, marginBottom: 20 }}>
            The single most important factor is your chargeback rate. Keep it under 0.65% (Visa&apos;s Early Warning threshold) and most processors will leave you alone. The mechanics:
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 0, listStyle: "none", marginBottom: 48 }}>
            {[
              "Monitor your dispute ratio weekly — don't wait for month-end statements",
              "Connect to EDR networks to catch disputes before they become chargebacks",
              "Score transactions before processing and decline obvious fraud",
              "Respond to all chargebacks with documented evidence",
              "Keep your fulfillment fast and your communication proactive",
              "Never lie to your processor — they will find out and it will accelerate termination",
            ].map((tip, i) => (
              <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "#8C8C9A", lineHeight: 1.75 }}>
                <span style={{ color: "#22C55E", fontWeight: 700, flexShrink: 0 }}>✓</span>
                {tip}
              </li>
            ))}
          </ul>

          <div style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(99,102,241,0.08))", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 14, padding: "36px 40px", textAlign: "center" }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 12 }}>Built for high-risk merchants</h3>
            <p style={{ fontSize: 14, color: "#8C8C9A", lineHeight: 1.75, marginBottom: 24, maxWidth: 440, margin: "0 auto 24px" }}>
              HighRiskIntel is the only risk intelligence platform built specifically for high-risk verticals. Connect your processor and start monitoring in minutes.
            </p>
            <Link href="/signup" style={{ display: "inline-block", background: "linear-gradient(180deg,#4F8EF7 0%,#2563EB 100%)", color: "#fff", padding: "13px 28px", borderRadius: 9, fontSize: 14, fontWeight: 600 }}>
              Get started free →
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
