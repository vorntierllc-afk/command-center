import type { MetadataRoute } from "next";
import { BULK_BLOG_POSTS } from "@/lib/bulk-blog";
import { HIGH_RISK_SEO_PAGES } from "@/lib/high-risk-seo";
import { ORGANIC_ASSETS } from "@/lib/organic-assets";
import { BLOG_POSTS, PUBLIC_ROUTES, SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const blogRoutes = new Map(BLOG_POSTS.map((post) => [`/blog/${post.slug}`, post]));

  const staticRoutes = PUBLIC_ROUTES.map((route) => {
    const blogPost = blogRoutes.get(route);
    const isHome = route === "";
    const isBlog = route === "/blog";
    const isCoreCommercialPage = route === "/product" || route === "/pricing";

    return {
      url: `${SITE_URL}${route}`,
      lastModified: now,
      changeFrequency: isHome || isBlog ? ("weekly" as const) : ("monthly" as const),
      priority: blogPost?.priority ?? (isHome ? 1.0 : isCoreCommercialPage || isBlog ? 0.9 : 0.7),
    };
  });

  const highRiskRoutes = HIGH_RISK_SEO_PAGES.map((page) => ({
    url: `${SITE_URL}/high-risk/${page.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: page.priority,
  }));

  const organicAssetRoutes = ORGANIC_ASSETS.map((asset) => ({
    url: `${SITE_URL}${asset.route}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.82,
  }));

  const bulkBlogRoutes = BULK_BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: post.priority,
  }));

  return [
    ...staticRoutes,
    {
      url: `${SITE_URL}/high-risk`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.86,
    },
    ...organicAssetRoutes,
    ...bulkBlogRoutes,
    ...highRiskRoutes,
  ];
}
