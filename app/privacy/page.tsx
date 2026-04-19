import type { Metadata } from 'next'
import Link from 'next/link'
import { DEFAULT_OG_IMAGE, absoluteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Privacy Policy — HighRiskIntel',
  description: 'Privacy Policy for HighRiskIntel payment risk monitoring platform.',
  alternates: { canonical: absoluteUrl('/privacy') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/privacy'),
    title: 'Privacy Policy — HighRiskIntel',
    description: 'Privacy Policy for HighRiskIntel payment risk monitoring platform.',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'HighRiskIntel Privacy Policy' }],
  },
}

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#07070A', color: '#F1F1F3', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 48px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontWeight: 700, fontSize: 16, color: '#fff', textDecoration: 'none' }}>HighRiskIntel</Link>
          <Link href="/dashboard" style={{ fontSize: 13, color: '#8C8C9A', textDecoration: 'none' }}>Dashboard →</Link>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 48px 120px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#3B82F6', marginBottom: 16 }}>Legal</p>
        <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 12 }}>Privacy Policy</h1>
        <p style={{ color: '#55555F', fontSize: 13, marginBottom: 56 }}>Effective date: January 1, 2025 · Last updated: March 2025</p>

        {[
          {
            title: '1. What We Collect',
            body: `When you use HighRiskIntel, we collect the following information:\n\n• Account information: email address, business name, and account credentials when you sign up.\n• Transaction data: payment amounts, currencies, countries, email addresses associated with transactions, dispute flags, and risk signals — collected when you connect your payment processor or upload statements.\n• Processor API credentials: encrypted using AES-256 before storage; used only to pull transaction and dispute data.\n• Usage data: pages visited, features used, session duration, and browser/device information collected automatically via cookies and server logs.\n• Payment information: billing details processed by Stripe; we do not store raw card numbers.`
          },
          {
            title: '2. How We Store Your Data',
            body: `All data is stored on Supabase infrastructure, which is SOC 2 Type II certified. Data is encrypted at rest using AES-256 and in transit using TLS 1.3. Processor API keys are additionally encrypted at the application layer before being written to the database. Our infrastructure is hosted in the United States. We maintain strict access controls — only authorized personnel can access production data, and all access is logged.`
          },
          {
            title: '3. How We Use Your Data',
            body: `We use your data to:\n\n• Provide and operate the Service, including generating risk scores, chargeback rate monitoring, and AI-powered analysis.\n• Send you alerts and reports about your payment risk profile.\n• Improve our AI models and risk engine using aggregate, anonymized transaction patterns.\n• Process subscription payments and manage billing.\n• Respond to support requests and communicate important Service updates.\n• Comply with legal obligations and prevent fraud.`
          },
          {
            title: '4. Third-Party Services',
            body: `HighRiskIntel uses the following third-party services to operate:\n\n• Anthropic: We send statement text and transaction summaries to Anthropic's Claude API for AI analysis. Data sent to Anthropic is not used to train their models per our data processing agreement.\n• Stripe: Used for billing and subscription management. Stripe processes payment information under their own Privacy Policy.\n• Supabase: Our database and storage infrastructure provider. Supabase is SOC 2 certified and stores your data in the US.\n• Resend: Used to send transactional emails (alerts, reports). Email content may include your chargeback metrics.\n\nWe do not sell your personal information to any third parties.`
          },
          {
            title: '5. Data Retention',
            body: `We retain your data for as long as your account is active, plus 2 years after account closure for compliance and dispute resolution purposes. Transaction data older than 2 years is automatically deleted. If you request account deletion, all your personal data and transaction records will be permanently deleted within 30 days, except where we are legally required to retain certain information.`
          },
          {
            title: '6. Your Rights',
            body: `You have the right to:\n\n• Access: Request a copy of all personal data we hold about you.\n• Correction: Request correction of inaccurate or incomplete data.\n• Deletion: Request permanent deletion of your account and all associated data.\n• Portability: Request your data in a machine-readable format.\n• Restriction: Request we stop processing your data in certain circumstances.\n\nTo exercise any of these rights, email privacy@highriskintel.com. We will respond within 30 days.`
          },
          {
            title: '7. Cookies',
            body: `We use strictly necessary cookies to maintain your session and authentication state. We do not use advertising or tracking cookies. We may use analytics cookies to understand how the product is used — these can be disabled in your browser settings without affecting core functionality.`
          },
          {
            title: '8. GDPR Compliance',
            body: `For users in the European Economic Area (EEA), we process your data under the following legal bases: (a) performance of a contract — to provide the Service you've subscribed to; (b) legitimate interests — for security, fraud prevention, and product improvement; and (c) consent — for optional analytics and marketing communications. You may withdraw consent at any time by contacting privacy@highriskintel.com.`
          },
          {
            title: '9. CCPA Compliance',
            body: `For California residents: HighRiskIntel does not sell personal information as defined under the California Consumer Privacy Act. You have the right to know what personal information we collect, request deletion of your personal information, and opt out of any future sale of personal information. To exercise these rights, email privacy@highriskintel.com.`
          },
          {
            title: '10. Security',
            body: `We take security seriously. Our measures include AES-256 encryption at rest, TLS 1.3 in transit, SOC 2 certified infrastructure, least-privilege access controls, regular security audits, and multi-factor authentication for all internal systems. No system is completely secure; if you discover a vulnerability, please report it to security@highriskintel.com.`
          },
          {
            title: '11. Children\'s Privacy',
            body: `HighRiskIntel is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact privacy@highriskintel.com and we will delete it promptly.`
          },
          {
            title: '12. Changes to This Policy',
            body: `We may update this Privacy Policy from time to time. We will notify you of material changes via email at least 14 days before they take effect. The "Last updated" date at the top of this page reflects the most recent revision.`
          },
          {
            title: '13. Contact Us',
            body: `For privacy-related questions, requests, or concerns:\n\nEmail: privacy@highriskintel.com\nHighRiskIntel, Inc.\nDelaware, United States\n\nFor security vulnerabilities: security@highriskintel.com`
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#F1F1F3', marginBottom: 12 }}>{section.title}</h2>
            <p style={{ fontSize: 14, color: '#8C8C9A', lineHeight: 1.85, whiteSpace: 'pre-line' }}>{section.body}</p>
          </div>
        ))}

        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 24 }}>
          <Link href="/terms" style={{ fontSize: 13, color: '#3B82F6', textDecoration: 'none' }}>Terms of Service</Link>
          <Link href="/" style={{ fontSize: 13, color: '#55555F', textDecoration: 'none' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
