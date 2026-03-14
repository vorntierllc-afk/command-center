import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HighRiskIntel",
    short_name: "HRI",
    description: "Risk intelligence platform for high-risk merchants.",
    start_url: "/",
    display: "standalone",
    background_color: "#07070A",
    theme_color: "#3B82F6",
    icons: [
      { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ]
  };
}
