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

export default function VisaVampGuidePage() {
  return (
    <BlogArticleShell
      slug={slug}
      sources={[
        { label: "Visa VAMP program fact sheet", href: "https://usa.visa.com/dam/VCOM/global/support-legal/documents/vamp-program-fact-sheet.pdf" },
        { label: "Stripe monitoring programs documentation", href: "https://docs.stripe.com/disputes/monitoring-programs" },
      ]}
    >
      <section style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.22)", borderRadius: 12, padding: "24px 28px", marginBottom: 44 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>2026 merchant takeaway</h2>
        <p style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.9 }}>
          Visa&apos;s own VAMP fact sheet lists a merchant “excessive” threshold of 0.9% starting April 1, 2026. Treat that as a hard operating ceiling, not a target. High-risk merchants should aim to stay materially below it.
        </p>
      </section>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>What changed with VAMP?</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        VAMP stands for Visa Acquirer Monitoring Program. The big shift is that Visa combines fraud and non-fraud dispute pressure into a more unified monitoring model. That matters because merchants can no longer think about fraud disputes and service disputes in separate silos.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        If the processor sees your account trending toward VAMP exposure, they may ask for remediation, increase reserves, limit processing, or decide the account is no longer worth the risk. A merchant dashboard should therefore show the ratio before the processor does.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>The practical formula</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        For merchant operators, the useful version is simple: reported fraud plus non-fraud disputes divided by sales count. Your acquirer may expose this differently, but your internal control should track both the count and the direction.
      </p>
      <div style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "22px 24px", marginBottom: 34 }}>
        <p style={{ fontSize: 15, color: "#F1F1F3", lineHeight: 1.8, margin: 0 }}>
          <strong>VAMP ratio:</strong> reported fraud + non-fraud disputes / total sales count
        </p>
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>What to do if you are trending up</h2>
      <ul style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 0, listStyle: "none", marginBottom: 36 }}>
        {[
          "Audit the last 30 days by dispute reason: fraud, not recognized, product not received, cancellation, subscription, and duplicate billing.",
          "Turn on pre-dispute workflows where available so eligible disputes can be resolved before they inflate your ratio.",
          "Tighten transaction scoring for country/BIN mismatches, velocity spikes, unusual ticket size, proxy traffic, and disposable emails.",
          "Shorten refund latency. A refund today is usually better than a formal chargeback tomorrow.",
          "Create a remediation timeline that your processor can read in five minutes.",
        ].map((item) => (
          <li key={item} style={{ display: "flex", gap: 12, color: "#A1A1AA", fontSize: 15, lineHeight: 1.8 }}>
            <span style={{ color: "#22C55E", fontWeight: 900 }}>✓</span>
            {item}
          </li>
        ))}
      </ul>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>How this connects to MID protection</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9 }}>
        VAMP is not just a compliance acronym. It is an early warning layer for processor confidence. If your VAMP exposure is rising alongside declining authorization rate, more reserves, or slower settlements, read the <Link href="/blog/mid-termination-warning-signs" style={{ color: "#60A5FA" }}>MID termination warning signs guide</Link> and move from reporting to remediation immediately.
      </p>
    </BlogArticleShell>
  );
}

