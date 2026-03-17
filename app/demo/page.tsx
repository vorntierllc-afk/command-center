'use client'
import { useState } from 'react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

const CHART_DATA = [
  { month: 'Sep', rate: 0.42 },
  { month: 'Oct', rate: 0.61 },
  { month: 'Nov', rate: 0.88 },
  { month: 'Dec', rate: 1.12 },
  { month: 'Jan', rate: 1.43 },
  { month: 'Feb', rate: 1.71 },
]

const TRANSACTIONS = [
  { id: 'ch_001', amount: 289.00, country: 'NG', email: 'k.adeyemi@mailinator.com', risk: 91, status: 'disputed', flag: '🇳🇬' },
  { id: 'ch_002', amount: 4750.00, country: 'RU', email: 'ivan.petrov@yandex.ru', risk: 84, status: 'succeeded', flag: '🇷🇺' },
  { id: 'ch_003', amount: 129.00, country: 'US', email: 'sarah.chen@gmail.com', risk: 12, status: 'succeeded', flag: '🇺🇸' },
  { id: 'ch_004', amount: 899.00, country: 'UA', email: 'user@tempmail.com', risk: 78, status: 'disputed', flag: '🇺🇦' },
  { id: 'ch_005', amount: 59.00, country: 'CA', email: 'mike.j@hotmail.com', risk: 8, status: 'succeeded', flag: '🇨🇦' },
  { id: 'ch_006', amount: 3200.00, country: 'BR', email: 'compras@empresa.br', risk: 55, status: 'refunded', flag: '🇧🇷' },
  { id: 'ch_007', amount: 199.00, country: 'US', email: 'james.w@gmail.com', risk: 14, status: 'succeeded', flag: '🇺🇸' },
  { id: 'ch_008', amount: 1450.00, country: 'NG', email: 'test@guerrillamail.com', risk: 96, status: 'disputed', flag: '🇳🇬' },
]

const ALERTS = [
  { id: 1, type: 'critical', message: 'Chargeback rate hit 1.71% — above Visa\'s 1.0% early warning threshold', time: '2h ago' },
  { id: 2, type: 'critical', message: '3 high-risk transactions detected from Nigeria — recommend immediate review', time: '4h ago' },
  { id: 3, type: 'warning', message: '2 disposable email addresses used in last 24 hours', time: '6h ago' },
  { id: 4, type: 'warning', message: 'Unusual transaction volume spike detected between 2–4 AM', time: '1d ago' },
  { id: 5, type: 'info', message: 'Monthly risk report generated — February 2026', time: '2d ago' },
]

const RISK_FACTORS = [
  { label: 'High-risk country exposure', pct: 38, color: '#DC2626' },
  { label: 'Disposable email addresses', pct: 22, color: '#F97316' },
  { label: 'Large transaction amounts', pct: 19, color: '#EAB308' },
  { label: 'Off-hours transactions', pct: 13, color: '#3B82F6' },
  { label: 'Repeat dispute customers', pct: 8, color: '#8B5CF6' },
]

const TABS = ['Overview', 'Transactions', 'Risk', 'Alerts']

export default function DemoPage() {
  const [tab, setTab] = useState('Overview')

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      {/* Demo banner */}
      <div className="bg-[#0A0A0A] text-white text-center py-2.5 px-4 text-sm flex items-center justify-center gap-3">
        <span className="text-yellow-400 font-semibold">Demo Mode</span>
        <span className="text-gray-400">This is sample data. Sign up to see your real risk profile.</span>
        <Link href="/signup" className="bg-white text-[#0A0A0A] text-xs font-semibold px-3 py-1 rounded-full hover:bg-gray-100 transition">
          Get started free →
        </Link>
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
              <p className="text-gray-500 text-sm">Good afternoon, Demo</p>
              <h1 className="text-2xl font-bold text-[#0A0A0A]">Your Risk Dashboard</h1>
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
                    Your chargeback rate is at <strong>1.71%</strong> — you're 7 days from Visa's termination threshold at this trajectory. Your biggest exposure is Nigeria: 3 disputed transactions totaling $1,439 in the last 30 days.
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[#0A0A0A] text-white rounded-xl rounded-tr-sm px-3 py-2.5 text-xs max-w-[80%]">
                      What should I do first?
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-gray-700 leading-relaxed">
                    Refund the 3 Nigeria transactions immediately — $1,439 in refunds now prevents ~$4,300 in chargeback fees. Then block card-not-present transactions from NG and UA for 30 days.
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
                    {['Transaction', 'Amount', 'Country', 'Risk Score', 'Status', 'Action'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TRANSACTIONS.map(tx => (
                    <tr key={tx.id} className="border-b border-[#F9FAFB] hover:bg-[#F9FAFB] transition">
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono">{tx.id}</td>
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

        {/* CTA footer */}
        <div className="mt-10 bg-[#0A0A0A] rounded-2xl p-8 text-center">
          <p className="text-white font-bold text-xl mb-2">Ready to see your real risk profile?</p>
          <p className="text-gray-400 text-sm mb-6">Connect your processor or upload statements — get your analysis in under 2 minutes.</p>
          <Link href="/signup" className="inline-block bg-white text-[#0A0A0A] font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition text-sm">
            Start for free →
          </Link>
        </div>

      </div>
    </div>
  )
}
