'use client'
import Link from 'next/link'

const FEATURES = [
  {
    icon: '📊',
    title: 'Real-time chargeback monitoring',
    desc: 'Track your chargeback rate live with Visa and Mastercard threshold alerts before your processor acts.',
  },
  {
    icon: '🤖',
    title: 'AI risk scoring on every transaction',
    desc: 'Every payment is scored 0–100 based on country, amount, email, and behavior patterns.',
  },
  {
    icon: '💬',
    title: 'AI analyst trained on your data',
    desc: 'Ask plain-English questions about your risk profile and get specific, actionable answers.',
  },
  {
    icon: '⚡',
    title: 'Early dispute detection',
    desc: 'Get alerted the moment a dispute is filed — up to 72 hours before it becomes a chargeback.',
  },
  {
    icon: '🔗',
    title: '6 processors supported',
    desc: 'Stripe, PayPal, Authorize.net, Braintree, Square, and NMI — connect in under 60 seconds.',
  },
  {
    icon: '📋',
    title: 'Statement analysis',
    desc: 'Upload your processing statements (PDF or CSV) and get a full risk breakdown in minutes.',
  },
]

const STATS = [
  { value: '1.71%', label: 'Average CB rate for at-risk merchants we work with' },
  { value: '57%', label: 'Reduction in chargebacks with early dispute detection' },
  { value: '72hrs', label: 'Window to respond before a dispute becomes a chargeback' },
  { value: '< 2min', label: 'Time to get your first risk analysis' },
]

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="border-b border-[#E5E7EB] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0A0A0A] rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="font-semibold text-[#0A0A0A] tracking-tight">HighRiskIntel</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/signin" className="text-sm text-gray-500 hover:text-[#0A0A0A] transition">Sign in</Link>
            <Link href="/signup" className="bg-[#0A0A0A] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-900 transition">
              Get started →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block bg-[#F0FDF4] text-[#15803D] text-xs font-semibold px-3 py-1 rounded-full mb-5">
          Payment Risk Intelligence Platform
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-[#0A0A0A] leading-tight mb-6">
          Know your risk before<br className="hidden md:block" />
          <span className="italic text-gray-400"> your processor does.</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          HighRiskIntel monitors every transaction, predicts MID termination, and tells you exactly what to fix — before your account gets shut down.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/signup" className="bg-[#0A0A0A] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-gray-900 transition text-sm">
            Start free — no card required
          </Link>
          <Link href="/signin" className="border border-[#E5E7EB] text-[#0A0A0A] font-semibold px-8 py-3.5 rounded-full hover:bg-gray-50 transition text-sm">
            Sign in →
          </Link>
        </div>
      </div>

      {/* Dashboard preview image area */}
      <div className="max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-[#0A0A0A] rounded-3xl p-1">
          <div className="bg-[#F9FAFB] rounded-2xl p-6">
            {/* Fake mini dashboard */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Chargeback Rate', value: '1.71%', bad: true },
                { label: 'Total Volume', value: '$284,520', bad: false },
                { label: 'Disputes', value: '49', bad: true },
                { label: 'MID Health', value: '34/100', bad: true },
              ].map(k => (
                <div key={k.label} className="bg-white rounded-xl p-3 border border-[#E5E7EB]">
                  <p className="text-gray-400 text-xs mb-1">{k.label}</p>
                  <p className={`text-lg font-bold ${k.bad ? 'text-[#DC2626]' : 'text-[#0A0A0A]'}`}>{k.value}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 bg-white rounded-xl p-4 border border-[#E5E7EB]">
                <p className="text-xs font-semibold text-gray-400 mb-3">CHARGEBACK RATE TREND</p>
                <div className="flex items-end gap-1 h-16">
                  {[22, 32, 46, 59, 75, 90].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: h >= 80 ? '#DC2626' : h >= 50 ? '#F97316' : '#0A0A0A', opacity: 0.8 }} />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  {['Sep','Oct','Nov','Dec','Jan','Feb'].map(m => <span key={m}>{m}</span>)}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                <p className="text-xs font-semibold text-gray-400 mb-3">AI ANALYST</p>
                <div className="space-y-2">
                  <div className="bg-gray-50 rounded-lg px-2.5 py-2 text-xs text-gray-600 leading-relaxed">
                    Your rate is at <strong>1.71%</strong> — 7 days from Visa's termination threshold.
                  </div>
                  <div className="bg-[#0A0A0A] rounded-lg px-2.5 py-2 text-xs text-white text-right">
                    What should I do?
                  </div>
                  <div className="bg-gray-50 rounded-lg px-2.5 py-2 text-xs text-gray-600">
                    Refund 3 Nigeria txns now — saves ~$4,300 in fees.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#0A0A0A] py-14">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(s => (
            <div key={s.value}>
              <p className="text-white text-3xl font-bold mb-1">{s.value}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0A0A0A] mb-3">Everything you need to protect your MID</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">Built specifically for high-risk merchants who can't afford to lose their processing accounts.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="border border-[#E5E7EB] rounded-2xl p-6 hover:border-[#0A0A0A] transition">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-[#0A0A0A] mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing teaser */}
      <div className="bg-[#F9FAFB] py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#0A0A0A] mb-3">Simple pricing</h2>
          <p className="text-gray-500 text-sm mb-10">Start free. Upgrade when you need more.</p>
          <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { name: 'Basic', price: '$30', desc: 'Up to $50k/mo volume', features: ['AI risk scoring', 'Statement analysis', 'Weekly reports', 'Email alerts'] },
              { name: 'Pro', price: '$50', desc: 'Up to $500k/mo volume', features: ['Everything in Basic', 'AI chat analyst', 'Processor sync', 'MID termination prediction'], highlight: true },
              { name: 'Agency', price: '$200', desc: 'Unlimited volume', features: ['Everything in Pro', 'Multiple MIDs', 'White-label reports', 'Dedicated support'] },
            ].map(p => (
              <div key={p.name} className={`rounded-2xl p-6 text-left ${p.highlight ? 'bg-[#0A0A0A] text-white' : 'bg-white border border-[#E5E7EB]'}`}>
                <p className={`text-xs font-semibold mb-1 ${p.highlight ? 'text-gray-400' : 'text-gray-400'}`}>{p.name}</p>
                <p className={`text-3xl font-bold mb-0.5 ${p.highlight ? 'text-white' : 'text-[#0A0A0A]'}`}>{p.price}<span className="text-sm font-normal">/mo</span></p>
                <p className={`text-xs mb-4 ${p.highlight ? 'text-gray-400' : 'text-gray-400'}`}>{p.desc}</p>
                <ul className="space-y-1.5 mb-6">
                  {p.features.map(f => (
                    <li key={f} className={`text-xs flex items-center gap-2 ${p.highlight ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className={p.highlight ? 'text-green-400' : 'text-[#15803D]'}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`block text-center text-xs font-semibold py-2.5 rounded-full transition ${p.highlight ? 'bg-white text-[#0A0A0A] hover:bg-gray-100' : 'bg-[#0A0A0A] text-white hover:bg-gray-900'}`}>
                  Get started
                </Link>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-5">+ 10% performance fee on disputes prevented via EDR</p>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-[#0A0A0A] mb-3">Start protecting your MID today</h2>
        <p className="text-gray-500 text-sm mb-8">Upload your statements or connect your processor — full risk analysis in under 2 minutes.</p>
        <Link href="/signup" className="inline-block bg-[#0A0A0A] text-white font-semibold px-10 py-4 rounded-full hover:bg-gray-900 transition text-sm">
          Get started free →
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-[#E5E7EB] py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <span className="text-gray-400 text-xs">© 2026 HighRiskIntel. All rights reserved.</span>
          <div className="flex gap-5">
            {[['Terms', '/terms'], ['Privacy', '/privacy'], ['Pricing', '/pricing']].map(([label, href]) => (
              <Link key={label} href={href} className="text-gray-400 text-xs hover:text-[#0A0A0A] transition">{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
