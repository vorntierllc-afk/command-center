import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const SITE_URL = "https://highriskintel.com";
const SITE_NAME = "HighRiskIntel";
const DEFAULT_TITLE = "HighRiskIntel — Risk Intelligence for High-Risk Merchants";
const DEFAULT_DESC =
  "Monitor authorization health, track chargeback exposure, detect volume anomalies, and protect your MID. The risk intelligence platform built for high-risk merchants.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`
  },
  description: DEFAULT_DESC,
  keywords: [
    "high risk merchant",
    "chargeback prevention",
    "merchant risk score",
    "MID protection",
    "payment risk monitoring",
    "dispute ratio",
    "authorization health",
    "chargeback ratio",
    "high risk payment processing",
    "merchant monitoring platform"
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HighRiskIntel — Risk Intelligence for High-Risk Merchants"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@highriskintel",
    creator: "@highriskintel",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: ["/og-image.png"]
  },
  alternates: {
    canonical: SITE_URL
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png"
  },
  manifest: "/site.webmanifest",
  category: "finance"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: SITE_NAME,
              url: SITE_URL,
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              description: DEFAULT_DESC,
              offers: {
                "@type": "AggregateOffer",
                lowPrice: "250",
                highPrice: "600",
                priceCurrency: "USD",
                offerCount: "3"
              },
              publisher: {
                "@type": "Organization",
                name: SITE_NAME,
                url: SITE_URL,
                logo: {
                  "@type": "ImageObject",
                  url: `${SITE_URL}/icon.svg`
                }
              }
            })
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
