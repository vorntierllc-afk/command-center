import type { Metadata } from "next";
import Link from "next/link";
import { BlogArticleShell } from "@/components/blog/BlogArticleShell";
import { BLOG_POSTS, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

const slug = "friendly-fraud-prevention";
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
    tags: [post.tag, "friendly fraud", "chargeback prevention"],
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: post.title }],
  },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [DEFAULT_OG_IMAGE] },
};

export default function FriendlyFraudPreventionPage() {
  return (
    <BlogArticleShell slug={slug}>
      <section style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "24px 28px", marginBottom: 44 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Quick answer</h2>
        <p style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.9 }}>
          Friendly fraud is not always malicious. Many disputes come from confusion, frustration, forgotten subscriptions, unclear descriptors, or customers choosing the bank because it feels easier than contacting the merchant.
        </p>
      </section>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Where friendly fraud usually starts</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        For high-risk merchants, friendly fraud often begins before the transaction is disputed. It starts with a mismatch between what the customer expected and what appeared on their statement, delivery timeline, cancellation path, or support response.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        The best prevention work is operational: reduce confusion, make refunds easier when they are cheaper than disputes, and keep evidence organized when a dispute should be fought.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Five controls that reduce friendly fraud</h2>
      <ul style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 0, listStyle: "none", marginBottom: 36 }}>
        {[
          "Use a recognizable billing descriptor with support contact details where possible.",
          "Send clear receipts, subscription reminders, and shipping updates.",
          "Make cancellation and refund rules easy to find before a customer calls the bank.",
          "Track repeat dispute reasons by product, offer, campaign, and support queue.",
          "Keep fulfillment proof, communication history, and refund notes tied to the order.",
        ].map((item) => (
          <li key={item} style={{ display: "flex", gap: 12, color: "#A1A1AA", fontSize: 15, lineHeight: 1.8 }}>
            <span style={{ color: "#22C55E", fontWeight: 900 }}>✓</span>
            {item}
          </li>
        ))}
      </ul>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Refund or fight?</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9 }}>
        The right decision depends on value, evidence, customer history, and account risk. If your dispute pressure is already rising, refunding preventable cases quickly may protect the account better than trying to win every fight. A <Link href="/risk-audit" style={{ color: "#60A5FA" }}>free risk audit</Link> can help identify which pattern is hurting you first.
      </p>
    </BlogArticleShell>
  );
}

