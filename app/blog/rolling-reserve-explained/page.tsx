import type { Metadata } from "next";
import Link from "next/link";
import { BlogArticleShell } from "@/components/blog/BlogArticleShell";
import { BLOG_POSTS, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

const slug = "rolling-reserve-explained";
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
    tags: [post.tag, "rolling reserve", "high-risk merchant"],
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: post.title }],
  },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [DEFAULT_OG_IMAGE] },
};

export default function RollingReserveExplainedPage() {
  return (
    <BlogArticleShell slug={slug}>
      <section style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "24px 28px", marginBottom: 44 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Quick answer</h2>
        <p style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.9 }}>
          A rolling reserve is money your processor holds back from settlements to cover future chargebacks, refunds, or account losses. For high-risk merchants, reserve pressure is often a warning sign worth tracking closely.
        </p>
      </section>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Why rolling reserves matter</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        Reserves are not just a finance issue. They tell you how much confidence your processor has in the account. A reserve increase can signal that the processor sees more exposure than it wants to carry.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        The operational mistake is treating reserve terms as fixed background noise. If reserves change alongside rising disputes, refund delays, or approval-rate movement, your team should investigate the account as a whole.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>What to monitor weekly</h2>
      <ul style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 0, listStyle: "none", marginBottom: 36 }}>
        {[
          "Reserve percentage and release timing",
          "Dispute count and chargeback ratio trend",
          "Refund volume and refund latency",
          "Authorization-rate changes",
          "Processor emails mentioning account review, risk review, or underwriting",
        ].map((item) => (
          <li key={item} style={{ display: "flex", gap: 12, color: "#A1A1AA", fontSize: 15, lineHeight: 1.8 }}>
            <span style={{ color: "#22C55E", fontWeight: 900 }}>✓</span>
            {item}
          </li>
        ))}
      </ul>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>When a reserve becomes urgent</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9 }}>
        A reserve change becomes urgent when it arrives with other signals: rising disputes, payout holds, a request for financials, or a processor asking for a plan. If that is happening, use the <Link href="/risk-audit" style={{ color: "#60A5FA" }}>free risk audit</Link> to identify what is driving the pressure first.
      </p>
    </BlogArticleShell>
  );
}

