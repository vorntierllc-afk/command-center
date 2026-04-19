import type { Metadata } from "next";
import Link from "next/link";
import { BlogArticleShell } from "@/components/blog/BlogArticleShell";
import { BLOG_POSTS, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

const slug = "billing-descriptor-chargebacks";
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
    tags: [post.tag, "billing descriptor", "not recognized chargeback"],
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: post.title }],
  },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [DEFAULT_OG_IMAGE] },
};

export default function BillingDescriptorChargebacksPage() {
  return (
    <BlogArticleShell slug={slug}>
      <section style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "24px 28px", marginBottom: 44 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Quick answer</h2>
        <p style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.9 }}>
          Billing descriptor chargebacks happen when customers do not recognize the charge on their statement. For high-risk merchants, descriptor confusion can turn normal customer questions into avoidable disputes.
        </p>
      </section>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Why descriptor confusion is expensive</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        A customer may remember your brand, product, or offer, but see a legal entity name, processor descriptor, or shortened label on the statement. When that happens, the bank becomes the easiest support channel.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        The fix is not only changing the descriptor. You also need receipts, confirmation emails, subscription reminders, support details, and refund workflows that connect the customer’s memory to the statement charge.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Descriptor checklist</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
        {[
          "Does the descriptor include the brand name customers recognize?",
          "Does the descriptor or receipt include support contact information?",
          "Do receipts show the same name customers will see on the statement?",
          "Do subscription reminders explain what will appear on the card statement?",
          "Do support agents tag not-recognized complaints before they become disputes?",
        ].map((item) => (
          <div key={item} style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 18px", color: "#A1A1AA", fontSize: 15, lineHeight: 1.8 }}>
            {item}
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>How to know if this is your problem</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9 }}>
        Look for dispute notes, support tickets, and customer messages that mention not recognizing the charge. If that pattern is present, request a <Link href="/risk-audit" style={{ color: "#60A5FA" }}>free risk audit</Link> and review descriptor confusion alongside refund timing and dispute trend.
      </p>
    </BlogArticleShell>
  );
}

