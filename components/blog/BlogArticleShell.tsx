import Link from "next/link";
import Script from "next/script";
import { BLOG_POSTS, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

type BlogArticleShellProps = {
  slug: (typeof BLOG_POSTS)[number]["slug"];
  children: React.ReactNode;
  sources?: { label: string; href: string }[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export function articleSchemaFor(slug: (typeof BLOG_POSTS)[number]["slug"]) {
  const post = BLOG_POSTS.find((item) => item.slug === slug)!;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl() },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
      logo: { "@type": "ImageObject", url: absoluteUrl(DEFAULT_OG_IMAGE) },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
  };
}

export function BlogArticleShell({ slug, children, sources = [] }: BlogArticleShellProps) {
  const post = BLOG_POSTS.find((item) => item.slug === slug)!;

  return (
    <>
      <Script id={`schema-${slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchemaFor(slug)) }} />
      <div style={{ fontFamily: "'Inter',sans-serif", background: "#07070A", color: "#F1F1F3", minHeight: "100vh" }}>
        <nav style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(7,7,10,0.9)", backdropFilter: "blur(20px)", padding: "0 48px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: "-0.5px", textDecoration: "none" }}>HighRiskIntel</Link>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <Link href="/blog" style={{ fontSize: 14, color: "#8C8C9A", textDecoration: "none" }}>All articles</Link>
              <Link href="/risk-audit" style={{ background: "#1E2A38", color: "#fff", padding: "9px 18px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Free audit</Link>
            </div>
          </div>
        </nav>

        <article style={{ maxWidth: 780, margin: "0 auto", padding: "64px 48px 100px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#3B82F6", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", padding: "3px 10px", borderRadius: 100 }}>{post.tag}</span>
            <span style={{ fontSize: 12, color: "#55555F" }}>{formatDate(post.datePublished)} · {post.readTime}</span>
          </div>

          <h1 style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.08, marginBottom: 24 }}>{post.title}</h1>
          <p style={{ fontSize: 18, color: "#A1A1AA", lineHeight: 1.8, marginBottom: 44 }}>{post.description}</p>

          <div className="seo-article-body">{children}</div>

          {sources.length > 0 && (
            <section style={{ marginTop: 56, padding: "24px 28px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, background: "#0C0C10" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Sources</h2>
              <ul style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 18 }}>
                {sources.map((source) => (
                  <li key={source.href} style={{ color: "#8C8C9A", fontSize: 14, lineHeight: 1.7 }}>
                    <a href={source.href} style={{ color: "#60A5FA" }}>{source.label}</a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section style={{ marginTop: 56, padding: "36px 40px", borderRadius: 16, background: "#0C0C10", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.6px", marginBottom: 12 }}>Want us to review your account risk?</h2>
            <p style={{ fontSize: 14, color: "#A1A1AA", lineHeight: 1.8, maxWidth: 520, margin: "0 auto 24px" }}>
              Send us your situation and we will tell you what to review first: dispute pressure, refund timing, processor signals, or documentation gaps.
            </p>
            <Link href="/risk-audit" style={{ display: "inline-block", background: "#1E2A38", color: "#fff", padding: "13px 28px", borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              Request free audit
            </Link>
          </section>
        </article>
      </div>
    </>
  );
}
