import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { BULK_BLOG_POSTS } from "@/lib/bulk-blog";
import { BLOG_POSTS, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog — Chargeback Prevention & High-Risk Merchant Guides",
  description:
    "Expert guides on chargeback prevention, MID protection, high-risk merchant accounts, Visa and Mastercard thresholds, and dispute management strategies.",
  alternates: { canonical: "https://highriskintel.com/blog" },
  openGraph: {
    type: "website",
    url: "https://highriskintel.com/blog",
    title: "HighRiskIntel Blog — Chargeback & High-Risk Merchant Guides",
    description:
    "Expert guides on chargeback prevention, MID protection, and high-risk merchant account management.",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "HighRiskIntel blog" }],
  },
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "HighRiskIntel Blog",
  description:
    "Expert guides on chargeback prevention, MID protection, high-risk merchant accounts, and dispute management strategies.",
  url: absoluteUrl("/blog"),
  publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl() },
  mainEntity: [...BLOG_POSTS, ...BULK_BLOG_POSTS.slice(0, 60)].map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.datePublished,
    dateModified: post.dateModified,
  })),
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export default function BlogPage() {
  return (
    <>
      <Script id="schema-blog-collection" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <div style={{ fontFamily: "'Inter',sans-serif", background: "#07070A", color: "#F1F1F3", minHeight: "100vh" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(7,7,10,0.9)", backdropFilter: "blur(20px)", padding: "0 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: "-0.5px" }}>HighRiskIntel</Link>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {[["Product", "/product"], ["Pricing", "/pricing"], ["Blog", "/blog"], ["Docs", "/docs"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: 14, color: l === "Blog" ? "#fff" : "#8C8C9A" }}>{l}</Link>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/signin" style={{ fontSize: 14, color: "#8C8C9A", padding: "8px 16px" }}>Sign in</Link>
            <Link href="/signup" style={{ background: "linear-gradient(180deg,#4F8EF7 0%,#2563EB 100%)", color: "#fff", padding: "9px 22px", borderRadius: 8, fontSize: 14, fontWeight: 600 }}>Get started →</Link>
          </div>
        </div>
      </nav>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "80px 48px" }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color: "#3B82F6", marginBottom: 16, display: "block" }}>Blog</span>
        <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-2px", marginBottom: 16, lineHeight: 1.05 }}>
          Chargeback & Risk Intelligence
        </h1>
        <p style={{ fontSize: 17, color: "#8C8C9A", lineHeight: 1.8, marginBottom: 64 }}>
          Practical guides for high-risk merchants navigating chargebacks, processor relationships, and MID protection.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 1, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display: "block", padding: "36px 40px", background: "#0C0C10", borderBottom: "1px solid rgba(255,255,255,0.06)", textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#3B82F6", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", padding: "3px 10px", borderRadius: 100 }}>{post.tag}</span>
                <span style={{ fontSize: 12, color: "#55555F" }}>{formatDate(post.datePublished)} · {post.readTime}</span>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F1F1F3", marginBottom: 10, letterSpacing: "-0.4px", lineHeight: 1.3 }}>{post.title}</h2>
              <p style={{ fontSize: 14, color: "#8C8C9A", lineHeight: 1.75 }}>{post.description}</p>
              <span style={{ display: "inline-block", marginTop: 16, fontSize: 13, color: "#3B82F6", fontWeight: 500 }}>Read article →</span>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#F1F1F3", marginBottom: 10, letterSpacing: "-0.8px" }}>
            Merchant risk guide library
          </h2>
          <p style={{ fontSize: 14, color: "#8C8C9A", lineHeight: 1.75, marginBottom: 24 }}>
            Long-tail guides for high-risk categories, processor holds, reserves, descriptors, refunds, and dispute evidence.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
            {BULK_BLOG_POSTS.slice(0, 72).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display: "block", padding: 18, background: "#0C0C10", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, textDecoration: "none" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#8C8C9A" }}>{post.tag}</span>
                <h3 style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: "#F1F1F3", lineHeight: 1.35 }}>{post.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
