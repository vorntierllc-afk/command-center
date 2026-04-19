import type { Metadata } from "next";
import Link from "next/link";
import { BlogArticleShell } from "@/components/blog/BlogArticleShell";
import { BLOG_POSTS, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

const slug = "high-risk-merchant-account-shutdown";
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
    tags: [post.tag, "merchant account shutdown", "processor review"],
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: post.title }],
  },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [DEFAULT_OG_IMAGE] },
};

export default function HighRiskMerchantAccountShutdownPage() {
  return (
    <BlogArticleShell slug={slug}>
      <section style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.22)", borderRadius: 12, padding: "24px 28px", marginBottom: 44 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>First 24 hours</h2>
        <p style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.9 }}>
          If your account may be shut down, your first job is to organize facts. Pull dispute trend, refund activity, recent volume changes, processor messages, fulfillment issues, and any changes to offers or traffic sources.
        </p>
      </section>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Do not go silent</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        Silence can make a processor assume the risk is not being managed. A short, organized response is usually better than a long defensive message.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        You want to show that you know what changed, have contained the source, and are tracking whether the account is improving.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Shutdown response checklist</h2>
      <ol style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 0, listStyle: "none", marginBottom: 36 }}>
        {[
          "Export the last 30 to 90 days of transactions, disputes, refunds, and approvals.",
          "Identify any sudden changes in volume, geography, product mix, or acquisition source.",
          "Tag disputes by root cause instead of treating all chargebacks as one problem.",
          "Pause traffic sources or offers that appear tied to dispute spikes.",
          "Write a remediation plan with owners, dates, and measurement.",
          "Prepare backup processing options, but do not misrepresent the current account situation.",
        ].map((item, index) => (
          <li key={item} style={{ display: "flex", gap: 14, background: "#0C0C10", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 18px" }}>
            <span style={{ minWidth: 26, height: 26, borderRadius: "50%", background: "rgba(239,68,68,0.12)", color: "#F87171", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>{index + 1}</span>
            <span style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.75 }}>{item}</span>
          </li>
        ))}
      </ol>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Get a second set of eyes</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9 }}>
        If you are under review or worried about shutdown, request a <Link href="/risk-audit" style={{ color: "#60A5FA" }}>free HighRiskIntel risk audit</Link>. The goal is to find the first account signal to explain, fix, or monitor before the processor escalates further.
      </p>
    </BlogArticleShell>
  );
}

