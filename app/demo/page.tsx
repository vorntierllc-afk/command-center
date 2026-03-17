'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

const DEMO_PASSWORD = 'hri2026'

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  function attempt(e: React.FormEvent) {
    e.preventDefault()
    if (input === DEMO_PASSWORD) {
      sessionStorage.setItem('demo_unlocked', '1')
      onUnlock()
    } else {
      setError(true)
      setInput('')
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-6">
          <span className="text-[#0A0A0A] font-bold text-lg">H</span>
        </div>
        <h1 className="text-white text-2xl font-bold mb-2">Private Demo</h1>
        <p className="text-gray-500 text-sm mb-8">Enter the access code to continue</p>
        <form onSubmit={attempt} className="space-y-3">
          <input
            type="password"
            placeholder="Access code"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
            className={`w-full bg-[#1A1A1A] border rounded-xl px-4 py-3 text-white text-sm outline-none text-center tracking-widest transition ${error ? 'border-red-500' : 'border-[#333] focus:border-white'}`}
          />
          {error && <p className="text-red-400 text-xs">Incorrect code</p>}
          <button type="submit" className="w-full bg-white text-[#0A0A0A] font-semibold py-3 rounded-xl text-sm hover:bg-gray-100 transition">
            Enter →
          </button>
        </form>
      </div>
    </div>
  )
}

const CHART_DATA = [
  { month: 'Sep', rate: 0.42 },
  { month: 'Oct', rate: 0.61 },
  { month: 'Nov', rate: 0.88 },
  { month: 'Dec', rate: 1.12 },
  { month: 'Jan', rate: 1.43 },
  { month: 'Feb', rate: 1.71 },
]

// Sample client: PureForm Peptides — a peptide research store
const CLIENT = { name: 'PureForm Peptides', industry: 'Research Peptides & Compounds' }

const TRANSACTIONS = [
  { id: 'ch_4f2a', amount: 312.00, country: 'US', email: 'j.mitchell@gmail.com', risk: 11, status: 'succeeded', flag: '🇺🇸', product: 'BPC-157 + TB-500 Stack' },
  { id: 'ch_8c3b', amount: 189.00, country: 'AU', email: 'r.harris@outlook.com', risk: 18, status: 'succeeded', flag: '🇦🇺', product: 'Ipamorelin 5mg x3' },
  { id: 'ch_1d9e', amount: 540.00, country: 'RU', email: 'dmitri.v@mail.ru', risk: 82, status: 'disputed', flag: '🇷🇺', product: 'CJC-1295 + GHRP-6' },
  { id: 'ch_7a1c', amount: 95.00, country: 'US', email: 'kyle.b@gmail.com', risk: 9, status: 'succeeded', flag: '🇺🇸', product: 'Selank 5mg' },
  { id: 'ch_2e8f', amount: 720.00, country: 'NG', email: 'test@tempmail.com', risk: 94, status: 'disputed', flag: '🇳🇬', product: 'Sermorelin 10mg x5' },
  { id: 'ch_5b4d', amount: 268.00, country: 'CA', email: 'sarah.t@icloud.com', risk: 13, status: 'succeeded', flag: '🇨🇦', product: 'Epithalon 10mg' },
  { id: 'ch_9f2e', amount: 415.00, country: 'UA', email: 'user@guerrillamail.com', risk: 79, status: 'disputed', flag: '🇺🇦', product: 'GHK-Cu 50mg' },
  { id: 'ch_3c7a', amount: 149.00, country: 'GB', email: 'mark.w@hotmail.co.uk', risk: 16, status: 'refunded', flag: '🇬🇧', product: 'Hexarelin 2mg x4' },
]

const ALERTS = [
  { id: 1, type: 'critical', message: 'Chargeback rate reached 1.71% — above Visa\'s 1.0% early warning threshold. 3 peptide orders from RU/UA/NG are flagged.', time: '2h ago' },
  { id: 2, type: 'critical', message: '3 high-risk orders totaling $1,675 — disposable emails + high-risk countries. Refund before they dispute.', time: '4h ago' },
  { id: 3, type: 'warning', message: '2 international orders over $500 placed at 3 AM — unusual pattern for research compound purchases.', time: '7h ago' },
  { id: 4, type: 'warning', message: 'Repeat customer email flagged: same card used for 4 orders in 48 hours across 2 email addresses.', time: '1d ago' },
  { id: 5, type: 'info', message: 'Monthly risk report generated — February 2026. Avg order value: $268. Top product disputed: CJC-1295.', time: '2d ago' },
]

const RISK_FACTORS = [
  { label: 'International high-risk orders', pct: 41, color: '#DC2626' },
  { label: 'Disposable email addresses', pct: 24, color: '#F97316' },
  { label: 'High-value single orders (>$500)', pct: 18, color: '#EAB308' },
  { label: 'Off-hours transactions (1–5 AM)', pct: 11, color: '#3B82F6' },
  { label: 'Repeat dispute customers', pct: 6, color: '#8B5CF6' },
]

const TABS = ['Overview', 'Transactions', 'Risk', 'Alerts']

function DashboardDemo() {
  const [tab, setTab] = useState('Overview')

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      {/* Client banner */}
      <div className="bg-[#0A0A0A] text-white text-center py-2.5 px-4 text-sm flex items-center justify-center gap-3">
        <span className="text-yellow-400 font-semibold">Client Preview</span>
        <span className="text-gray-400">{CLIENT.name} · {CLIENT.industry}</span>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#0A0A0A] rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-xs">H</span>
              </div>
              <span className="font-semibold text-[#0A0A0A] tracking-tight">HighRiskIntel</span>
            </div>
            <nav className="hidden md:flex gap-1">
              {TABS.map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${tab === t ? 'bg-[#0A0A0A] text-white' : 'text-gray-500 hover:text-[#0A0A0A]'}`}>
                  {t}
                  {t === 'Alerts' && <span className="ml-1.5 bg-[#DC2626] text-white text-xs rounded-full px-1.5 py-0.5">3</span>}
                </button>
              ))}
            </nav>
          </div>
          <Link href="/signup"
            className="bg-[#0A0A0A] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-900 transition">
            Connect your data →
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── OVERVIEW ── */}
        {tab === 'Overview' && (
          <div className="space-y-6">
            <div>
              <p className="text-gray-500 text-sm">Good afternoon, {CLIENT.name}</p>
              <h1 className="text-2xl font-bold text-[#0A0A0A]">Risk Dashboard</h1>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Chargeback Rate', value: '1.71%', sub: '↑ 0.28% vs last month', bad: true },
                { label: 'Total Volume', value: '$284,520', sub: 'Last 90 days', bad: false },
                { label: 'Disputes', value: '49', sub: '12 unresolved', bad: true },
                { label: 'MID Health', value: '34/100', sub: 'Critical risk', bad: true },
              ].map(k => (
                <div key={k.label} className="bg-white rounded-2xl p-5 border border-[#E5E7EB]">
                  <p className="text-gray-500 text-xs font-medium mb-1">{k.label}</p>
                  <p className={`text-2xl font-bold ${k.bad ? 'text-[#DC2626]' : 'text-[#0A0A0A]'}`}>{k.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Chart + AI chat */}
            <div className="grid md:grid-cols-5 gap-4">
              {/* Chart */}
              <div className="md:col-span-3 bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#0A0A0A]">Chargeback Rate Trend</h3>
                    <p className="text-xs text-gray-400">6-month view</p>
                  </div>
                  <span className="text-xs bg-[#FEF2F2] text-[#DC2626] font-semibold px-2 py-1 rounded-full">
                    Above threshold
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={CHART_DATA}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 2]} />
                    <Tooltip formatter={(v: number) => [`${v}%`, 'CB Rate']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                    <ReferenceLine y={1.0} stroke="#F97316" strokeDasharray="4 4" label={{ value: 'Warning 1.0%', fontSize: 10, fill: '#F97316' }} />
                    <ReferenceLine y={1.8} stroke="#DC2626" strokeDasharray="4 4" label={{ value: 'Critical 1.8%', fontSize: 10, fill: '#DC2626' }} />
                    <Line type="monotone" dataKey="rate" stroke="#0A0A0A" strokeWidth={2.5} dot={{ r: 3, fill: '#0A0A0A' }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* AI Chat */}
              <div className="md:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b border-[#F3F4F6]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#0A0A0A] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0A0A0A]">HRI Analyst</p>
                      <p className="text-xs text-green-500">Online</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-gray-700 leading-relaxed">
                    PureForm's CB rate is <strong>1.71%</strong> — 7 days from Visa's termination threshold. 3 peptide orders from RU, UA, NG account for $1,675 of disputed revenue in 30 days.
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[#0A0A0A] text-white rounded-xl rounded-tr-sm px-3 py-2.5 text-xs max-w-[80%]">
                      Which orders should I refund?
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-gray-700 leading-relaxed">
                    Refund ch_1d9e ($540 RU) and ch_2e8f ($720 NG) now — both used high-risk countries + disposable emails. That drops your projected CB rate to 0.94%.
                  </div>
                </div>
                <div className="p-3 border-t border-[#F3F4F6]">
                  <div className="flex gap-2 items-center bg-gray-50 rounded-full px-3 py-2">
                    <span className="text-xs text-gray-400 flex-1">Ask about your risk...</span>
                    <Link href="/signup" className="text-xs text-[#0A0A0A] font-semibold whitespace-nowrap">Connect data →</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk factors + actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <h3 className="font-semibold text-[#0A0A0A] mb-4">Top Risk Factors</h3>
                <div className="space-y-3">
                  {RISK_FACTORS.map(f => (
                    <div key={f.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{f.label}</span>
                        <span className="font-semibold text-[#0A0A0A]">{f.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: f.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <h3 className="font-semibold text-[#0A0A0A] mb-4">Recommended Actions</h3>
                <div className="space-y-3">
                  {[
                    { priority: 'Urgent', text: 'Refund 3 Nigeria transactions ($1,439) before they become chargebacks', color: 'bg-[#FEF2F2] text-[#DC2626]' },
                    { priority: 'High', text: 'Block card-not-present from NG, RU, UA for 30 days', color: 'bg-[#FFF7ED] text-[#C2410C]' },
                    { priority: 'High', text: 'Add email verification for orders over $500', color: 'bg-[#FFF7ED] text-[#C2410C]' },
                    { priority: 'Medium', text: 'Enable 3DS2 authentication for all international cards', color: 'bg-[#FEFCE8] text-[#A16207]' },
                    { priority: 'Medium', text: 'Set velocity limits: max 3 transactions per email per 24h', color: 'bg-[#FEFCE8] text-[#A16207]' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${a.color}`}>{a.priority}</span>
                      <p className="text-xs text-gray-600 leading-relaxed">{a.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TRANSACTIONS ── */}
        {tab === 'Transactions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0A0A0A]">Recent Transactions</h2>
              <span className="text-xs text-gray-400">Showing sample data</span>
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F3F4F6]">
                    {['Transaction', 'Product', 'Amount', 'Country', 'Risk Score', 'Status', 'Action'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TRANSACTIONS.map(tx => (
                    <tr key={tx.id} className="border-b border-[#F9FAFB] hover:bg-[#F9FAFB] transition">
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono">{tx.id}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{tx.product}</td>
                      <td className="px-4 py-3 font-semibold text-[#0A0A0A]">${tx.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{tx.flag} {tx.country}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          tx.risk >= 80 ? 'bg-[#FEF2F2] text-[#DC2626]' :
                          tx.risk >= 50 ? 'bg-[#FFF7ED] text-[#C2410C]' :
                          'bg-[#F0FDF4] text-[#15803D]'
                        }`}>
                          {tx.risk}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          tx.status === 'disputed' ? 'bg-[#FEF2F2] text-[#DC2626]' :
                          tx.status === 'refunded' ? 'bg-[#EFF6FF] text-[#1D4ED8]' :
                          'bg-[#F0FDF4] text-[#15803D]'
                        }`}>{tx.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href="/signup" className="text-xs text-[#0A0A0A] font-medium underline underline-offset-2 hover:text-gray-600">
                          {tx.status === 'disputed' ? 'Refund' : 'Review'}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── RISK ── */}
        {tab === 'Risk' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0A0A0A]">Risk Analysis</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: 'High Risk Transactions', value: '5', sub: 'Score ≥ 80', color: 'text-[#DC2626]' },
                { label: 'Countries Flagged', value: '3', sub: 'NG, RU, UA', color: 'text-[#F97316]' },
                { label: 'Avg Risk Score', value: '49', sub: 'Out of 100', color: 'text-[#EAB308]' },
              ].map(k => (
                <div key={k.label} className="bg-white rounded-2xl p-5 border border-[#E5E7EB]">
                  <p className="text-gray-500 text-xs mb-1">{k.label}</p>
                  <p className={`text-3xl font-bold ${k.color}`}>{k.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F3F4F6]">
                <h3 className="font-semibold text-[#0A0A0A]">High-Risk Transactions</h3>
              </div>
              {TRANSACTIONS.filter(t => t.risk >= 50).map(tx => (
                <div key={tx.id} className="flex items-center justify-between px-5 py-4 border-b border-[#F9FAFB] hover:bg-[#F9FAFB]">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      tx.risk >= 80 ? 'bg-[#FEF2F2] text-[#DC2626]' : 'bg-[#FFF7ED] text-[#C2410C]'
                    }`}>{tx.risk}</div>
                    <div>
                      <p className="text-sm font-semibold text-[#0A0A0A]">${tx.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{tx.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{tx.flag}</span>
                    <Link href="/signup" className="text-xs bg-[#0A0A0A] text-white px-3 py-1.5 rounded-full hover:bg-gray-900 transition">
                      Take action
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ALERTS ── */}
        {tab === 'Alerts' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0A0A0A]">Alerts</h2>
            <div className="space-y-3">
              {ALERTS.map(a => (
                <div key={a.id} className={`bg-white rounded-2xl p-5 border flex items-start gap-4 ${
                  a.type === 'critical' ? 'border-[#FECACA]' : a.type === 'warning' ? 'border-[#FED7AA]' : 'border-[#E5E7EB]'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
                    a.type === 'critical' ? 'bg-[#FEF2F2]' : a.type === 'warning' ? 'bg-[#FFF7ED]' : 'bg-[#F9FAFB]'
                  }`}>
                    {a.type === 'critical' ? '🚨' : a.type === 'warning' ? '⚠️' : 'ℹ️'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#0A0A0A]">{a.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{a.time}</p>
                  </div>
                  <Link href="/signup" className="text-xs text-[#0A0A0A] font-medium underline-offset-2 underline whitespace-nowrap">
                    Fix this
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-10 bg-[#0A0A0A] rounded-2xl p-8 text-center">
          <p className="text-white font-bold text-xl mb-2">This is {CLIENT.name}'s live risk profile</p>
          <p className="text-gray-400 text-sm">Data pulled from their Stripe account · Updated daily · Powered by HighRiskIntel</p>
        </div>

      </div>
    </div>
  )
}

export default function DemoPage() {
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('demo_unlocked') === '1') setUnlocked(true)
  }, [])

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />
  return <DashboardDemo />
}
