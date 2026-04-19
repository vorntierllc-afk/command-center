import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo'
import './globals.css'

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
const bingSiteVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: 'HighRiskIntel — Chargeback Prevention & MID Protection for High-Risk Merchants',
    template: '%s | HighRiskIntel',
  },
  description: 'Stop losing revenue to chargebacks. HighRiskIntel monitors every transaction 24/7, predicts MID termination 30 days out, and delivers action-ready risk intelligence for high-risk merchants.',
  keywords: [
    'chargeback prevention software',
    'high risk merchant monitoring',
    'MID termination protection',
    'chargeback rate monitoring',
    'high risk payment processing',
    'merchant dispute prevention',
    'chargeback management platform',
    'Visa chargeback threshold',
    'Mastercard dispute monitoring',
    'high risk merchant account',
  ],
  authors: [{ name: 'HighRiskIntel', url: SITE_URL }],
  creator: 'HighRiskIntel',
  publisher: 'HighRiskIntel',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  verification: {
    google: googleSiteVerification,
    other: bingSiteVerification ? { "msvalidate.01": bingSiteVerification } : undefined,
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    url: SITE_URL,
    title: 'HighRiskIntel — Chargeback Prevention & MID Protection',
    description: 'Stop losing revenue to chargebacks. Monitor authorization health, track chargeback exposure, and protect your MID before your processor acts first.',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'HighRiskIntel — Risk Intelligence for High-Risk Merchants' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@highriskintel',
    creator: '@highriskintel',
    title: 'HighRiskIntel — Chargeback Prevention & MID Protection',
    description: 'Monitor every transaction, predict MID termination 30 days out, and keep your merchant account alive.',
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        {gaMeasurementId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        ) : null}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
