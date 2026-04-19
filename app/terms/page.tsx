import type { Metadata } from 'next'
import Link from 'next/link'
import { DEFAULT_OG_IMAGE, absoluteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Terms of Service — HighRiskIntel',
  description: 'Terms of Service for HighRiskIntel payment risk monitoring platform.',
  alternates: { canonical: absoluteUrl('/terms') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/terms'),
    title: 'Terms of Service — HighRiskIntel',
    description: 'Terms of Service for HighRiskIntel payment risk monitoring platform.',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'HighRiskIntel Terms of Service' }],
  },
}

export default function TermsPage() {
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
        <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 12 }}>Terms of Service</h1>
        <p style={{ color: '#55555F', fontSize: 13, marginBottom: 56 }}>Effective date: January 1, 2025 · Last updated: March 2025</p>

        {[
          {
            title: '1. Service Description',
            body: `HighRiskIntel ("we," "our," "the Service") provides a cloud-based payment risk monitoring SaaS platform designed for high-risk merchants. The Service includes AI-powered transaction scoring, chargeback rate monitoring, dispute alerts, statement analysis, processor sync, and AI chat analysis. By accessing or using HighRiskIntel, you agree to be bound by these Terms of Service.`
          },
          {
            title: '2. Subscription Terms',
            body: `HighRiskIntel offers three subscription tiers: Basic ($30/month), Pro ($50/month), and Agency ($200/month). All plans are billed monthly in advance. You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period — you will retain access until then. No refunds are issued for partial months. We reserve the right to change pricing with 30 days' written notice.`
          },
          {
            title: '3. Performance Fee',
            body: `In addition to your monthly subscription, HighRiskIntel charges a 10% performance fee on the dollar value of disputes that are actively prevented through our Early Detection and Resolution (EDR) network alerts and automated refund actions. A "prevented dispute" is defined as a chargeback that was avoided because you took action (refund, cancellation, or resolution) within 72 hours of receiving an EDR alert. If no disputes are prevented, no performance fee is charged. The performance fee is calculated monthly and invoiced separately.`
          },
          {
            title: '4. Acceptable Use',
            body: `HighRiskIntel is available exclusively to legitimate merchants operating legal businesses. You may not use the Service to: (a) facilitate illegal transactions or money laundering; (b) circumvent legitimate dispute resolution processes; (c) mislead cardholders; (d) violate card network rules; or (e) misrepresent your business operations to processors or banks. We reserve the right to terminate accounts that violate these terms without refund.`
          },
          {
            title: '5. Data Usage',
            body: `By connecting your payment processor or uploading statements, you grant HighRiskIntel a limited license to process your transaction data for the purpose of providing the Service. Your data is encrypted at rest using AES-256 and in transit using TLS 1.3. We do not sell your data to third parties. Transaction data may be used in aggregate, anonymized form to improve our risk models. You may request deletion of your data at any time by emailing privacy@highriskintel.com.`
          },
          {
            title: '6. Processor Credentials',
            body: `When you connect a payment processor, you provide API credentials that are encrypted using AES-256 before storage. We use read-only API access where available. You are responsible for the security of credentials you provide and for revoking access when required. HighRiskIntel will not use your processor credentials for any purpose other than pulling transaction and dispute data as part of the Service.`
          },
          {
            title: '7. Limitation of Liability',
            body: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, HIGHRISKINTEL SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF REVENUE, LOSS OF DATA, OR LOSS OF BUSINESS, ARISING OUT OF OR IN CONNECTION WITH THE SERVICE. OUR TOTAL CUMULATIVE LIABILITY TO YOU FOR ANY CLAIMS ARISING UNDER THESE TERMS SHALL NOT EXCEED THE AMOUNTS PAID BY YOU TO HIGHRISKINTEL IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM. HighRiskIntel does not guarantee that use of our Service will prevent MID termination, chargebacks, or financial losses.`
          },
          {
            title: '8. Disclaimers',
            body: `The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. HighRiskIntel does not warrant that the Service will be uninterrupted, error-free, or completely secure. Risk scores and AI analysis are provided for informational purposes only and do not constitute legal, financial, or compliance advice.`
          },
          {
            title: '9. Intellectual Property',
            body: `All intellectual property rights in and to the Service, including software, algorithms, designs, and content, are owned by HighRiskIntel or its licensors. You are granted a limited, non-exclusive, non-transferable license to use the Service during the term of your subscription. You may not reverse engineer, copy, or create derivative works based on the Service.`
          },
          {
            title: '10. Termination',
            body: `Either party may terminate these Terms at any time. You may cancel by ceasing use and cancelling your subscription. We may terminate or suspend your account immediately if you violate these Terms, fail to pay fees, or engage in conduct that harms other users or the integrity of the Service. Upon termination, your data will be retained for 30 days and then deleted, unless you request earlier deletion.`
          },
          {
            title: '11. Governing Law',
            body: `These Terms are governed by the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved through binding arbitration in Delaware, except that either party may seek injunctive relief in any court of competent jurisdiction.`
          },
          {
            title: '12. Changes to Terms',
            body: `We may modify these Terms at any time. We will provide at least 14 days' notice via email before material changes take effect. Continued use of the Service after notice constitutes acceptance of the updated Terms.`
          },
          {
            title: '13. Contact',
            body: `For questions about these Terms, contact us at legal@highriskintel.com or write to: HighRiskIntel, Inc., Legal Department, Delaware, United States.`
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#F1F1F3', marginBottom: 12 }}>{section.title}</h2>
            <p style={{ fontSize: 14, color: '#8C8C9A', lineHeight: 1.85 }}>{section.body}</p>
          </div>
        ))}

        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 24 }}>
          <Link href="/privacy" style={{ fontSize: 13, color: '#3B82F6', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/" style={{ fontSize: 13, color: '#55555F', textDecoration: 'none' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
