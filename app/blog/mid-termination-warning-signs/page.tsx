import type { Metadata } from "next";
import Link from "next/link";
import { BlogArticleShell } from "@/components/blog/BlogArticleShell";
import { BLOG_POSTS, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

const slug = "mid-termination-warning-signs";
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
    tags: [post.tag, "MID termination", "processor risk", "rolling reserve"],
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: post.title }],
  },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [DEFAULT_OG_IMAGE] },
};

const signs = [
  "Your authorization rate drops sharply without a pricing, traffic, or processor configuration change.",
  "Reserve terms change or your processor asks for updated financials.",
  "Settlements slow down or payout holds become more frequent.",
  "Your account manager asks for a written remediation plan.",
  "Chargeback notices arrive faster than your support team can process them.",
  "Refund volume spikes because customers cannot recognize your descriptor.",
  "Cross-border or high-ticket orders increase faster than your processing history supports.",
  "The processor requests SKU, fulfillment, or marketing funnel details.",
  "You see more issuer declines from specific BIN ranges or geographies.",
  "Your dispute ratio rises for two consecutive weeks.",
  "A fraud attack causes a sudden batch of similar orders.",
  "Your processor starts asking questions about a vertical, product, or traffic source you recently added.",
];

export default function MidTerminationWarningSignsPage() {
  return (
    <BlogArticleShell slug={slug}>
      <section style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.22)", borderRadius: 12, padding: "24px 28px", marginBottom: 44 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>If you remember one thing</h2>
        <p style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.9 }}>
          MID termination rarely feels sudden to the processor. It feels sudden to the merchant because the warning signs were scattered across statements, declines, reserves, support tickets, and emails. Bring those signals into one dashboard.
        </p>
      </section>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>12 warning signs to watch</h2>
      <ol style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 0, listStyle: "none", marginBottom: 36 }}>
        {signs.map((sign, index) => (
          <li key={sign} style={{ display: "flex", gap: 14, background: "#0C0C10", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 18px" }}>
            <span style={{ minWidth: 26, height: 26, borderRadius: "50%", background: "rgba(239,68,68,0.12)", color: "#F87171", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>{index + 1}</span>
            <span style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.75 }}>{sign}</span>
          </li>
        ))}
      </ol>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>What to do in the first 72 hours</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        First, stop guessing. Pull the last 30 days of transaction count, chargebacks, refunds, auth rate, decline reasons, high-risk geographies, SKU mix, and traffic sources. Then identify whether the issue is fraud, product delivery, descriptor confusion, cancellation policy, or a processor confidence problem.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        Second, create a remediation note before the processor asks. Include what changed, what you turned off, what you refunded, what you blocked, and what metric should improve by what date. The best remediation plan is specific enough to verify.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Do not fight every dispute</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        High-risk merchants often over-focus on representment because winning feels like justice. Processor risk teams care more about future exposure. If a fast refund prevents a chargeback from counting against your ratio, it may be the better account-protection decision.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        Pair this guide with the <Link href="/blog/chargeback-prevention-high-risk-merchants" style={{ color: "#60A5FA" }}>2026 chargeback prevention playbook</Link> and the <Link href="/blog/ethoca-verifi-chargeback-alerts" style={{ color: "#60A5FA" }}>Ethoca/Verifi alerts guide</Link> to build a full prevention system.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>How HighRiskIntel helps</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9 }}>
        HighRiskIntel is built to catch these warning signs early: authorization health shifts, chargeback ratio movement, refund latency, volume anomalies, and processor-risk changes. Instead of waiting for a shutdown notice, you get the action list while there is still time to fix the account.
      </p>
    </BlogArticleShell>
  );
}

