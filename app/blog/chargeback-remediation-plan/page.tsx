import type { Metadata } from "next";
import Link from "next/link";
import { BlogArticleShell } from "@/components/blog/BlogArticleShell";
import { BLOG_POSTS, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

const slug = "chargeback-remediation-plan";
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
    tags: [post.tag, "chargeback remediation", "processor risk"],
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: post.title }],
  },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [DEFAULT_OG_IMAGE] },
};

const sections = [
  ["Current risk summary", "State the dispute trend, refund trend, affected products, traffic sources, and dates. Do not bury the processor in narrative."],
  ["Root cause analysis", "Separate fraud, descriptor confusion, fulfillment gaps, cancellation friction, and customer-service delays."],
  ["Actions already taken", "List changes that are live now: refund workflow, descriptor updates, support scripts, fraud rules, fulfillment fixes, or blocked traffic sources."],
  ["Actions scheduled", "Give owners and dates. A vague promise to improve is not a remediation plan."],
  ["Measurement plan", "Explain which metrics you will monitor weekly and what improvement would prove the fix is working."],
];

export default function ChargebackRemediationPlanPage() {
  return (
    <BlogArticleShell slug={slug}>
      <section style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "24px 28px", marginBottom: 44 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Quick answer</h2>
        <p style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.9 }}>
          A serious remediation plan is not a paragraph saying you will “reduce chargebacks.” It is a short operating document that shows your current numbers, root causes, actions taken, owners, dates, and how you will prove the account is improving.
        </p>
      </section>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>What processors actually need to see</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        Processor risk teams are trying to answer one question: is this merchant getting risk under control, or is the account still getting worse? Your remediation plan should make that answer easy.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        The mistake most merchants make is sending explanations without numbers. A better plan connects the issue to dates, products, dispute reasons, customer complaints, refund timing, and the specific changes you made.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>The five-part remediation plan</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
        {sections.map(([title, copy], index) => (
          <div key={title} style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "20px" }}>
            <p style={{ fontSize: 12, color: "#60A5FA", fontWeight: 800, marginBottom: 8 }}>0{index + 1}</p>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{title}</h3>
            <p style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.8 }}>{copy}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>What not to send</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        Avoid blaming customers, blaming processors, or sending a generic promise. Processors care about whether the account risk is measurable and whether your team has changed behavior.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9 }}>
        If you do not know where the risk is coming from yet, start with a <Link href="/risk-audit" style={{ color: "#60A5FA" }}>free HighRiskIntel audit</Link> and identify the first metric to fix.
      </p>
    </BlogArticleShell>
  );
}

