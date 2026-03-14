import type { MetadataRoute } from "next";

const SITE_URL = "https://highriskintel.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/product", "/pricing", "/security", "/docs"],
        disallow: ["/dashboard", "/onboarding", "/api/", "/signin", "/signup"]
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
