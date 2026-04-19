import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, SITE_URL } from "@/lib/seo";

const privateRoutes = [
  "/admin",
  "/api/",
  "/dashboard",
  "/forgot-password",
  "/onboarding",
  "/preview",
  "/reset-password",
  "/signin",
  "/signup",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "OAI-SearchBot",
        allow: ["/", "/blog", "/high-risk", "/industries", "/tools", "/resources", "/risk-audit", "/llms.txt", "/ai.txt"],
        disallow: privateRoutes,
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/blog", "/high-risk", "/industries", "/tools", "/resources", "/risk-audit", "/llms.txt", "/ai.txt"],
        disallow: privateRoutes,
      },
      {
        userAgent: "*",
        allow: [...PUBLIC_ROUTES.map((route) => route || "/"), "/high-risk/", "/resources/", "/llms.txt", "/ai.txt"],
        disallow: privateRoutes,
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
