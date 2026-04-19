import { BULK_BLOG_POSTS } from "@/lib/bulk-blog";
import { HIGH_RISK_SEO_PAGES } from "@/lib/high-risk-seo";
import { ORGANIC_ASSETS } from "@/lib/organic-assets";
import { BLOG_POSTS, SITE_NAME, SITE_URL } from "@/lib/seo";

export function GET() {
  const featuredHighRiskPages = HIGH_RISK_SEO_PAGES.slice(0, 80)
    .map((page) => `- [${page.title}](${SITE_URL}/high-risk/${page.slug}): ${page.description}`)
    .join("\n");

  const blogPages = BLOG_POSTS.map((post) => `- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.description}`).join("\n");
  const bulkBlogPages = BULK_BLOG_POSTS.slice(0, 120)
    .map((post) => `- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.description}`)
    .join("\n");
  const organicAssets = ORGANIC_ASSETS.map((asset) => `- [${asset.title}](${SITE_URL}${asset.route}): ${asset.description}`).join("\n");

  const body = `# ${SITE_NAME}

HighRiskIntel helps high-risk merchants monitor chargebacks, refund pressure, payout holds, processor review signals, rolling reserves, billing descriptor issues, and MID shutdown risk.

## Core pages

- [Free risk audit](${SITE_URL}/risk-audit): Request a merchant-risk audit.
- [High-risk merchant directory](${SITE_URL}/high-risk): Browse vertical-specific risk pages.
- [Chargeback rate calculator](${SITE_URL}/tools/chargeback-rate-calculator): Estimate chargeback and refund-rate pressure.

## High-risk merchant pages

${featuredHighRiskPages}

## Tools and resources

${organicAssets}

## Guides

${blogPages}

## Long-tail merchant risk guides

${bulkBlogPages}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
