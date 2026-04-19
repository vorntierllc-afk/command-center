import type { Metadata } from "next";
import Link from "next/link";
import { BlogArticleShell } from "@/components/blog/BlogArticleShell";
import { BLOG_POSTS, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

const slug = "chargeback-prevention-high-risk-merchants";
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
    tags: [post.tag, "high-risk merchants", "chargeback prevention", "MID protection"],
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: post.title }],
  },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [DEFAULT_OG_IMAGE] },
};

const playbook = [
  "Measure your dispute ratio weekly, not when the monthly statement arrives.",
  "Separate fraud disputes, friendly fraud, fulfillment disputes, and descriptor confusion.",
  "Use pre-dispute alerts so eligible disputes can be refunded before they become chargebacks.",
  "Decline or review orders that combine high-risk country, BIN, velocity, proxy, and disposable-email signals.",
  "Track authorization rate drops because processor risk systems often move before your account manager calls.",
  "Keep a remediation file ready with refund policy changes, descriptor fixes, fraud controls, and fulfillment improvements.",
];

export default function ChargebackPreventionPlaybookPage() {
  return (
    <BlogArticleShell
      slug={slug}
      sources={[
        { label: "Visa VAMP fact sheet", href: "https://usa.visa.com/dam/VCOM/global/support-legal/documents/vamp-program-fact-sheet.pdf" },
        { label: "Stripe dispute prevention documentation", href: "https://docs.stripe.com/disputes/prevention-preview" },
        { label: "Mastercard dispute management overview", href: "https://www.mastercard.com/us/en/business/cybersecurity-fraud-prevention/dispute-management.html" },
      ]}
    >
      <section style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "24px 28px", marginBottom: 44 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Quick answer</h2>
        <p style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.9 }}>
          The best chargeback prevention strategy for a high-risk merchant is not one tool. It is a daily operating system: measure network thresholds, catch pre-dispute alerts, refund fast when the math says to, tighten transaction screening, and document every remediation step before your processor asks for it.
        </p>
      </section>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Why high-risk chargeback prevention is different</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        A low-risk merchant can often treat chargebacks as a support workflow. A high-risk merchant cannot. If you sell in supplements, CBD, travel, adult, crypto, continuity offers, coaching, gaming, or other monitored categories, your dispute ratio affects processor confidence, rolling reserves, approval rates, and whether your MID survives the next risk review.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        The goal is not just winning chargebacks. In many cases, the smarter move is preventing the dispute from becoming a chargeback at all. That is why HighRiskIntel focuses on the signals before termination: chargeback velocity, authorization health, refund latency, volume spikes, and processor-risk patterns.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>The 2026 prevention playbook</h2>
      <ol style={{ display: "flex", flexDirection: "column", gap: 14, paddingLeft: 0, listStyle: "none", marginBottom: 36 }}>
        {playbook.map((item, index) => (
          <li key={item} style={{ display: "flex", gap: 16, background: "#0C0C10", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 20px" }}>
            <span style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(59,130,246,0.16)", color: "#60A5FA", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{index + 1}</span>
            <span style={{ fontSize: 15, color: "#A1A1AA", lineHeight: 1.75 }}>{item}</span>
          </li>
        ))}
      </ol>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Start with the ratios that can get you in trouble</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        Your first dashboard should show dispute count, dispute amount, sales count, refund count, refund latency, and week-over-week direction. Network programs change, and enforcement can vary by acquirer, but the operating habit is stable: if your ratio is rising, do not wait for a statement.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        For Visa, review the new VAMP model in our <Link href="/blog/visa-vamp-2026-guide" style={{ color: "#60A5FA" }}>Visa VAMP 2026 guide</Link>. For Mastercard exposure, treat 100+ monthly chargebacks plus elevated ratio as a board-level risk even before your acquirer sends formal notice.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Use alerts before representment</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        Representment is still useful, but it is not the same as prevention. If the chargeback already exists, you may still lose time, fees, inventory, and ratio health. Pre-dispute alert systems such as Ethoca and Verifi can help merchants resolve eligible disputes earlier, often through refund or deflection workflows.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        If you are comparing alert coverage, start with our <Link href="/blog/ethoca-verifi-chargeback-alerts" style={{ color: "#60A5FA" }}>Ethoca vs Verifi alerts guide</Link>. The most important internal metric is response speed: an alert that sits in a queue is not a prevention program.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Build a processor-ready remediation file</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 22 }}>
        When processor risk teams get nervous, they usually want evidence that the merchant is changing behavior. Keep a living document with descriptor fixes, refund-policy changes, fraud rules, customer-service SLA improvements, fulfillment controls, and the exact dates each change went live.
      </p>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9, marginBottom: 34 }}>
        If your processor has already asked for a remediation plan, read <Link href="/blog/mid-termination-warning-signs" style={{ color: "#60A5FA" }}>MID termination warning signs</Link> next and prioritize actions that can produce measurable ratio improvement within 7 to 30 days.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 48, marginBottom: 16 }}>Where HighRiskIntel fits</h2>
      <p style={{ fontSize: 16, color: "#A1A1AA", lineHeight: 1.9 }}>
        HighRiskIntel turns the playbook into a workflow: connect processor data, monitor chargeback and authorization health, flag risky transactions, generate weekly risk reports, and surface actions before your acquirer escalates. If you are still relying on spreadsheets and processor emails, your warning system is too slow.
      </p>
    </BlogArticleShell>
  );
}

