import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BULK_BLOG_POSTS, getBulkBlogPost, getRelatedBulkBlogPosts } from "@/lib/bulk-blog";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

type BulkBlogPageProps = {
  params: {
    slug: string;
  };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return BULK_BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BulkBlogPageProps): Metadata {
  const post = getBulkBlogPost(params.slug);

  if (!post) {
    return {};
  }

  const url = absoluteUrl(`/blog/${post.slug}`);

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: post.title,
      description: post.description,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function BulkBlogPage({ params }: BulkBlogPageProps) {
  const post = getBulkBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedBulkBlogPosts(post);
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl() },
    publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl() },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#111111]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            HighRiskIntel
          </Link>
          <Link href="/risk-audit" className="rounded-xl bg-[#1E2A38] px-4 py-2.5 text-sm font-medium text-white">
            Free risk audit
          </Link>
        </div>
      </header>

      <main>
        <article className="mx-auto max-w-4xl px-6 py-14">
          <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-8 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">{post.tag}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] lg:text-5xl">{post.title}</h1>
            <p className="mt-5 text-base leading-8 text-[#6B7280]">{post.description}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium text-[#6B7280]">
              <span>{post.readTime}</span>
              <span>Updated April 19, 2026</span>
              <span>{post.vertical.label}</span>
            </div>
          </div>

          <section className="mt-8 rounded-[24px] border border-[#E5E7EB] bg-white p-8">
            <h2 className="text-2xl font-semibold tracking-tight">Why this matters for {post.vertical.label.toLowerCase()}</h2>
            <p className="mt-4 text-sm leading-7 text-[#6B7280]">
              {post.vertical.audience} often run into processor concern when normal account movement starts to look like unmanaged risk. The issue may start with {post.vertical.risk}, but it usually becomes serious when there is no clear owner, no timeline, and no evidence showing what changed.
            </p>
            <p className="mt-4 text-sm leading-7 text-[#6B7280]">
              The goal of this guide is simple: help operators understand what to check first, what to document, and when to turn the situation into a structured risk audit instead of waiting for a processor email.
            </p>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-2">
            {post.topic.sections.map((section) => (
              <div key={section} className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
                <h2 className="text-lg font-semibold tracking-tight">{section}</h2>
                <p className="mt-3 text-sm leading-7 text-[#6B7280]">
                  Build a short operating note for this item. Include the metric, the customer-facing cause, the account-risk impact, and the next action the team owns.
                </p>
              </div>
            ))}
          </section>

          <section className="mt-8 rounded-[24px] border border-[#E5E7EB] bg-white p-8">
            <h2 className="text-2xl font-semibold tracking-tight">A practical review workflow</h2>
            <div className="mt-6 space-y-4">
              {[
                `Pull the last 90 days of disputes, refunds, payout changes, and support notes for ${post.vertical.label.toLowerCase()}.`,
                `Separate preventable issues from unavoidable issues so the team can focus on the controllable ${post.topic.label.toLowerCase()} signals first.`,
                "Match the customer experience against what the processor sees: descriptor, receipt, refund policy, delivery proof, and support response time.",
                "Create a concise remediation note with owner, deadline, evidence, and the metric that should improve.",
              ].map((item, index) => (
                <div key={item} className="flex gap-4 rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#1E2A38]">{index + 1}</div>
                  <p className="text-sm leading-7 text-[#111111]">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-[24px] border border-[#E5E7EB] bg-[#1E2A38] p-8 text-white">
            <h2 className="text-2xl font-semibold tracking-tight">Need a second set of eyes?</h2>
            <p className="mt-4 text-sm leading-7 text-white/75">
              If the account is already seeing holds, reserve pressure, chargeback warnings, or processor questions, use the free risk audit to organize the situation before it gets louder.
            </p>
            <Link href="/risk-audit" className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-medium text-[#1E2A38]">
              Request free risk audit
            </Link>
          </section>

          <section className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Related guides</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">More for {post.vertical.label.toLowerCase()}</h2>
              </div>
              <Link href="/blog" className="text-sm font-medium text-[#1E2A38]">
                Blog index
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <Link key={item.slug} href={`/blog/${item.slug}`} className="rounded-2xl border border-[#E5E7EB] bg-white p-5 transition hover:border-[#D5D9DF]">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">{item.tag}</p>
                  <h3 className="mt-3 text-sm font-semibold leading-6">{item.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
