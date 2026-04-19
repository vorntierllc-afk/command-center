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

export default function PaymentProcessorHoldPage() {
  return (
    <BlogArticleShell slug={slug}>
      <section style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.22)", borderRadius: 12, padding: "24px 28px", marginBottom: 44 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>First response</h2>
        <p style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.9 }}>
          If your processor is holding funds, do not start with panic. Start with evidence: recent disputes, refunds, volume changes, fulfillment issues, policy changes, and any processor communications.
        </p>
      </section>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Why processors hold funds</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        Funds can be held when a processor believes future chargebacks, refunds, or compliance issues could exceed the normal risk tolerance for the account. The hold is usually a risk-control mechanism, not a random punishment.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        That means the fastest path forward is not arguing. It is showing that you understand the issue, have contained the source, and can measure improvement.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>What to check first</h2>
      <ol style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 0, listStyle: "none", marginBottom: 36 }}>
        {[
          "Did dispute count or chargeback ratio move up recently?",
          "Did monthly volume spike faster than your processing history supports?",
          "Did refunds slow down or customer-service backlog increase?",
          "Did a new campaign, affiliate, product, or traffic source launch?",
          "Did fulfillment or delivery times change?",
        ].map((item, index) => (
          <li key={item} style={{ display: "flex", gap: 14, background: "#0C0C10", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 18px" }}>
            <span style={{ minWidth: 26, height: 26, borderRadius: "50%", background: "rgba(59,130,246,0.12)", color: "#60A5FA", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>{index + 1}</span>
            <span style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.75 }}>{item}</span>
          </li>
        ))}
      </ol>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>What to send back</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9 }}>
        Send a short, structured response with numbers, timeline, root causes, and actions taken. If you need help identifying those points quickly, start with the <Link href="/risk-audit" style={{ color: "#60A5FA" }}>free HighRiskIntel audit</Link>.
      </p>
    </BlogArticleShell>
  );
}

