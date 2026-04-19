import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "HRI",
    description:
      "Chargeback prevention and MID protection platform for high-risk merchants.",
    start_url: "/",
    display: "standalone",
    background_color: "#07070A",
    theme_color: "#3B82F6",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }
    ]
  };
}
