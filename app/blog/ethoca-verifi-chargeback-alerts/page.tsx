import type { Metadata } from "next";
import Link from "next/link";
import { BlogArticleShell } from "@/components/blog/BlogArticleShell";
import { BLOG_POSTS, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

const slug = "ethoca-verifi-chargeback-alerts";
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
    tags: [post.tag, "Ethoca", "Verifi", "chargeback alerts"],
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: post.title }],
  },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [DEFAULT_OG_IMAGE] },
};

export default function EthocaVerifiAlertsPage() {
  return (
    <BlogArticleShell
      slug={slug}
      sources={[
        { label: "Mastercard dispute management and Ethoca overview", href: "https://www.mastercard.com/us/en/business/cybersecurity-fraud-prevention/dispute-management.html" },
        { label: "Stripe dispute prevention documentation", href: "https://docs.stripe.com/disputes/prevention-preview" },
      ]}
    >
      <section style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "24px 28px", marginBottom: 44 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Short version</h2>
        <p style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.9 }}>
          Ethoca and Verifi both help merchants see dispute intent earlier, but they are not interchangeable. High-risk merchants should care less about the logo and more about coverage, response speed, automation rules, refund economics, and whether the workflow lowers the ratio that processors watch.
        </p>
      </section>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Why alerts matter more than win rate</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        A high chargeback win rate can still hide a failing risk program. If disputes are already formal chargebacks, they may still create operational drag and ratio pressure. Alerts move the decision earlier: refund, cancel, deflect, or investigate before the dispute becomes a bigger processor problem.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        This is why alert handling belongs inside your risk dashboard, not just your support inbox. A delayed response can turn a preventable dispute into a permanent data point against your MID.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Ethoca vs Verifi: what to compare</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 36 }}>
        {[
          ["Coverage", "Which issuers, geographies, and card types are represented?"],
          ["Speed", "How long after cardholder contact does the alert reach your team?"],
          ["Automation", "Can low-margin or high-risk alerts be refunded automatically?"],
          ["Attribution", "Can you map alerts back to campaign, SKU, descriptor, and agent?"],
        ].map(([title, body]) => (
          <div key={title} style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "20px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{title}</h3>
            <p style={{ fontSize: 14, color: "#A1A1AA", lineHeight: 1.75 }}>{body}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>A practical alert policy</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        Start with a simple decision tree. Auto-refund low-ticket alerts when the customer has no repeat purchase value. Manually review high-ticket alerts, repeat purchasers, shipped orders, and possible friendly fraud. Immediately tag every alert by source so you can measure which products and campaigns are generating the most dispute intent.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        Then link the alert outcome back to your broader <Link href="/blog/chargeback-prevention-high-risk-merchants" style={{ color: "#60A5FA" }}>chargeback prevention playbook</Link>. Alerts are not a standalone fix; they are one control inside a processor-survival system.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>What HighRiskIntel tracks</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9 }}>
        HighRiskIntel helps merchants monitor alert volume, refund latency, chargeback conversion, risk score history, and account-level exposure. The end goal is simple: know what to refund, what to fight, what to block, and what to fix in the business.
      </p>
    </BlogArticleShell>
  );
}

