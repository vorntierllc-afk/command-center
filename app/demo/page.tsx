'use client'
import { useState } from 'react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

const CHART_DATA = [
  { month: 'Sep', rate: 0.38 },
  { month: 'Oct', rate: 0.54 },
  { month: 'Nov', rate: 0.79 },
  { month: 'Dec', rate: 1.04 },
  { month: 'Jan', rate: 1.38 },
  { month: 'Feb', rate: 1.71 },
]

const CLIENT = { name: 'PureForm Peptides', industry: 'Research Peptides & Compounds' }

const TRANSACTIONS = [
  { id: 'ch_4f2a91', amount: 312.00, country: 'US', email: 'j.mitchell@gmail.com',         risk: 11, status: 'succeeded', flag: '🇺🇸', product: 'BPC-157 + TB-500 Stack',       date: 'Mar 17, 2:14 PM' },
  { id: 'ch_8c3b27', amount: 189.00, country: 'AU', email: 'r.harris@outlook.com',          risk: 18, status: 'succeeded', flag: '🇦🇺', product: 'Ipamorelin 5mg ×3',            date: 'Mar 17, 1:42 PM' },
  { id: 'ch_1d9e55', amount: 540.00, country: 'RU', email: 'dmitri.v@mail.ru',              risk: 82, status: 'disputed',  flag: '🇷🇺', product: 'CJC-1295 + GHRP-6',           date: 'Mar 17, 3:08 AM' },
  { id: 'ch_7a1c83', amount: 95.00,  country: 'US', email: 'kyle.b@gmail.com',              risk: 9,  status: 'succeeded', flag: '🇺🇸', product: 'Selank 5mg',                   date: 'Mar 16, 11:55 AM' },
  { id: 'ch_2e8f14', amount: 720.00, country: 'NG', email: 'orders@tempmail.com',           risk: 94, status: 'disputed',  flag: '🇳🇬', product: 'Sermorelin 10mg ×5',           date: 'Mar 16, 4:17 AM' },
  { id: 'ch_5b4d62', amount: 268.00, country: 'CA', email: 'sarah.t@icloud.com',            risk: 13, status: 'succeeded', flag: '🇨🇦', product: 'Epithalon 10mg',               date: 'Mar 16, 9:30 AM' },
  { id: 'ch_9f2e38', amount: 415.00, country: 'UA', email: 'buyer99@guerrillamail.com',     risk: 79, status: 'disputed',  flag: '🇺🇦', product: 'GHK-Cu 50mg',                  date: 'Mar 15, 2:50 AM' },
  { id: 'ch_3c7a19', amount: 149.00, country: 'GB', email: 'mark.w@hotmail.co.uk',          risk: 16, status: 'refunded',  flag: '🇬🇧', product: 'Hexarelin 2mg ×4',             date: 'Mar 15, 3:22 PM' },
  { id: 'ch_6d1b44', amount: 229.00, country: 'US', email: 'derek.s@gmail.com',             risk: 10, status: 'succeeded', flag: '🇺🇸', product: 'Thymosin Alpha-1 5mg',         date: 'Mar 15, 10:11 AM' },
  { id: 'ch_0e5c72', amount: 378.00, country: 'DE', email: 'f.schmidt@web.de',              risk: 21, status: 'succeeded', flag: '🇩🇪', product: 'BPC-157 10mg ×2',              date: 'Mar 14, 4:48 PM' },
  { id: 'ch_b2a7f3', amount: 865.00, country: 'NG', email: 'fastbuy@mailinator.com',        risk: 97, status: 'disputed',  flag: '🇳🇬', product: 'PT-141 10mg + CJC-1295',       date: 'Mar 14, 1:33 AM' },
  { id: 'ch_c4e891', amount: 134.00, country: 'US', email: 'alex.r@yahoo.com',              risk: 8,  status: 'succeeded', flag: '🇺🇸', product: 'DSIP 5mg',                     date: 'Mar 14, 2:05 PM' },
  { id: 'ch_d7f246', amount: 490.00, country: 'BR', email: 'compras2@protonmail.com',       risk: 58, status: 'succeeded', flag: '🇧🇷', product: 'IGF-1 LR3 0.1mg ×10',         date: 'Mar 13, 7:14 AM' },
  { id: 'ch_e1b539', amount: 215.00, country: 'NZ', email: 'j.tanner@gmail.com',            risk: 14, status: 'succeeded', flag: '🇳🇿', product: 'Semax 30mg',                   date: 'Mar 13, 12:38 PM' },
  { id: 'ch_f3d820', amount: 675.00, country: 'RU', email: 'sergei.k@yandex.ru',            risk: 86, status: 'disputed',  flag: '🇷🇺', product: 'Fragment 176-191 + HGH Frag',  date: 'Mar 13, 3:51 AM' },
  { id: 'ch_a9c104', amount: 112.00, country: 'US', email: 'lisa.m@gmail.com',              risk: 7,  status: 'succeeded', flag: '🇺🇸', product: 'Oxytocin 2mg ×3',              date: 'Mar 12, 9:02 AM' },
  { id: 'ch_b6e773', amount: 320.00, country: 'AU', email: 'tom.h@outlook.com.au',          risk: 17, status: 'succeeded', flag: '🇦🇺', product: 'TB-500 5mg ×4',               date: 'Mar 12, 1:19 PM' },
  { id: 'ch_c0f918', amount: 580.00, country: 'MX', email: 'bulk@throwaway.email',          risk: 71, status: 'refunded',  flag: '🇲🇽', product: 'Melanotan II 10mg ×3',         date: 'Mar 12, 5:44 AM' },
  { id: 'ch_d4a265', amount: 199.00, country: 'US', email: 'chris.p@icloud.com',            risk: 11, status: 'succeeded', flag: '🇺🇸', product: 'GHRP-2 5mg ×2',               date: 'Mar 11, 3:30 PM' },
  { id: 'ch_e8b391', amount: 445.00, country: 'IL', email: 'info@research-labs.co.il',      risk: 29, status: 'succeeded', flag: '🇮🇱', product: 'BPC-157 + KPV Stack',          date: 'Mar 11, 11:00 AM' },
  { id: 'ch_f2c847', amount: 258.00, country: 'US', email: 'brandon.k@gmail.com',           risk: 9,  status: 'succeeded', flag: '🇺🇸', product: 'Cerebrolysin 5ml',             date: 'Mar 10, 4:55 PM' },
  { id: 'ch_03d512', amount: 930.00, country: 'NG', email: 'order55@yopmail.com',           risk: 96, status: 'disputed',  flag: '🇳🇬', product: 'CJC-1295 DAC 5mg ×6',         date: 'Mar 10, 2:27 AM' },
  { id: 'ch_14e689', amount: 175.00, country: 'CA', email: 'natalie.v@gmail.com',           risk: 12, status: 'succeeded', flag: '🇨🇦', product: 'AOD-9604 5mg',                 date: 'Mar 10, 10:40 AM' },
  { id: 'ch_25f374', amount: 345.00, country: 'SE', email: 'e.lindqvist@gmail.com',         risk: 15, status: 'succeeded', flag: '🇸🇪', product: 'Ipamorelin + CJC-1295 Kit',    date: 'Mar 9, 2:18 PM' },
  { id: 'ch_36a018', amount: 780.00, country: 'UA', email: 'depot@trashmail.at',            risk: 91, status: 'disputed',  flag: '🇺🇦', product: 'TB-500 + BPC-157 Bulk 20mg',  date: 'Mar 9, 4:03 AM' },
]

const ALERTS = [
  { id: 1, type: 'critical', message: 'CB rate at 1.71% — above Visa\'s 1.0% early warning. 6 peptide orders from NG, RU, UA are actively disputed.', time: '2h ago' },
  { id: 2, type: 'critical', message: 'ch_b2a7f3 ($865, NG): disposable email + 4 AM order + high-risk country. Refund immediately to prevent chargeback.', time: '3h ago' },
  { id: 3, type: 'critical', message: '3 disputes filed in last 48 hours totaling $2,135 — all international, all placed overnight (1–5 AM).', time: '5h ago' },
  { id: 4, type: 'warning', message: 'ch_36a018 ($780, UA): guerrillamail address + bulk order at 4 AM. High probability of dispute within 7 days.', time: '8h ago' },
  { id: 5, type: 'warning', message: 'Velocity alert: 4 orders from Nigerian IPs in the last 72 hours. Block CN-CNP transactions from NG recommended.', time: '12h ago' },
  { id: 6, type: 'warning', message: 'ch_c0f918 ($580, MX) refunded — throwaway email + 5 AM order. Pattern matches previous chargebacks.', time: '1d ago' },
  { id: 7, type: 'info', message: 'Feb 2026 report: $284,520 total volume, 49 disputes, avg ticket $268. Top disputed product: CJC-1295 series.', time: '2d ago' },
  { id: 8, type: 'info', message: 'New connection: Stripe account synced. 847 transactions imported and scored.', time: '3d ago' },
]

const RISK_FACTORS = [
  { label: 'High-risk country orders (NG, RU, UA)', pct: 41, color: '#DC2626' },
  { label: 'Disposable / throwaway email addresses',  pct: 24, color: '#F97316' },
  { label: 'High-value single orders (>$500)',        pct: 18, color: '#EAB308' },
  { label: 'Off-hours transactions (1–5 AM)',          pct: 11, color: '#3B82F6' },
  { label: 'Repeat dispute customers',                 pct: 6,  color: '#8B5CF6' },
]

const ACTIONS = [
  { priority: 'Urgent', text: 'Refund ch_b2a7f3 ($865 NG) and ch_03d512 ($930 NG) before disputes escalate', color: 'bg-[#FEF2F2] text-[#DC2626]' },
  { priority: 'Urgent', text: 'Refund ch_36a018 ($780 UA) — throwaway email, bulk order, 4 AM pattern', color: 'bg-[#FEF2F2] text-[#DC2626]' },
  { priority: 'High',   text: 'Block card-not-present from NG, RU, UA for 30 days minimum', color: 'bg-[#FFF7ED] text-[#C2410C]' },
  { priority: 'High',   text: 'Require email verification for all orders over $400', color: 'bg-[#FFF7ED] text-[#C2410C]' },
  { priority: 'Medium', text: 'Enable 3DS2 on all international card-not-present transactions', color: 'bg-[#FEFCE8] text-[#A16207]' },
  { priority: 'Medium', text: 'Set velocity rule: max 2 orders per email per 48 hours', color: 'bg-[#FEFCE8] text-[#A16207]' },
]

const TABS = ['Overview', 'Transactions', 'Risk', 'Alerts']

export default function DemoPage() {
  const [tab, setTab] = useState('Overview')

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">

      {/* Top bar */}
      <div className="bg-[#0A0A0A] text-white text-center py-2.5 px-4 text-sm flex items-center justify-center gap-3 flex-wrap">
        <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
        <span className="text-gray-300 font-medium">{CLIENT.name}</span>
        <span className="text-gray-600">·</span>
        <span className="text-gray-500 text-xs">{CLIENT.industry}</span>
        <span className="text-gray-600">·</span>
        <span className="text-gray-500 text-xs">Last synced 4 min ago</span>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
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
          <Link href="/signup" className="bg-[#0A0A0A] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-900 transition">
            Get your dashboard →
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── OVERVIEW ── */}
        {tab === 'Overview' && (
          <div className="space-y-6">
            <div>
              <p className="text-gray-500 text-sm">PureForm Peptides · March 2026</p>
              <h1 className="text-2xl font-bold text-[#0A0A0A]">Risk Overview</h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Chargeback Rate',  value: '1.71%',    sub: '↑ 0.33% from January', bad: true },
                { label: 'Total Volume',     value: '$284,520', sub: 'Last 90 days',           bad: false },
                { label: 'Active Disputes',  value: '49',       sub: '12 unresolved',          bad: true },
                { label: 'MID Health Score', value: '34 / 100', sub: 'Critical — action req.', bad: true },
              ].map(k => (
                <div key={k.label} className="bg-white rounded-2xl p-5 border border-[#E5E7EB]">
                  <p className="text-gray-500 text-xs font-medium mb-1">{k.label}</p>
                  <p className={`text-2xl font-bold ${k.bad ? 'text-[#DC2626]' : 'text-[#0A0A0A]'}`}>{k.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-5 gap-4">
              <div className="md:col-span-3 bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#0A0A0A]">Chargeback Rate — 6 Month Trend</h3>
                    <p className="text-xs text-gray-400">Sep 2025 – Feb 2026</p>
                  </div>
                  <span className="text-xs bg-[#FEF2F2] text-[#DC2626] font-semibold px-2.5 py-1 rounded-full">Above threshold</span>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={CHART_DATA}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 2.2]} />
                    <Tooltip formatter={(v: number) => [`${v.toFixed(2)}%`, 'CB Rate']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                    <ReferenceLine y={1.0} stroke="#F97316" strokeDasharray="4 4" label={{ value: 'Early warning 1.0%', fontSize: 10, fill: '#F97316', position: 'insideTopRight' }} />
                    <ReferenceLine y={1.8} stroke="#DC2626" strokeDasharray="4 4" label={{ value: 'Termination 1.8%', fontSize: 10, fill: '#DC2626', position: 'insideTopRight' }} />
                    <Line type="monotone" dataKey="rate" stroke="#0A0A0A" strokeWidth={2.5} dot={{ r: 3, fill: '#0A0A0A' }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="md:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b border-[#F3F4F6] flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#0A0A0A] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0A0A0A]">HRI Analyst</p>
                    <p className="text-xs text-green-500">● Online</p>
                  </div>
                </div>
                <div className="flex-1 p-4 space-y-3 text-xs">
                  <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2.5 text-gray-700 leading-relaxed">
                    PureForm's CB rate is <strong className="text-[#DC2626]">1.71%</strong> — at current trajectory you hit Visa's 1.8% termination threshold in ~7 days. 6 active disputes total $3,325, 5 from NG/RU/UA.
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[#0A0A0A] text-white rounded-xl rounded-tr-sm px-3 py-2.5 max-w-[85%]">
                      Which ones should I refund right now?
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2.5 text-gray-700 leading-relaxed">
                    Refund ch_b2a7f3 ($865 NG) and ch_03d512 ($930 NG) today — both are mailinator/yopmail addresses, 2 AM orders. That alone drops your projected rate to <strong>1.08%</strong> and buys 3+ weeks.
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[#0A0A0A] text-white rounded-xl rounded-tr-sm px-3 py-2.5 max-w-[85%]">
                      What caused the spike in Jan?
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2.5 text-gray-700 leading-relaxed">
                    January spike (0.94% → 1.38%) was driven by 4 CJC-1295 bulk orders from Ukraine and Russia. Same card BIN prefix on 3 of them — likely coordinated fraud.
                  </div>
                </div>
                <div className="p-3 border-t border-[#F3F4F6]">
                  <Link href="/signup" className="flex gap-2 items-center bg-gray-50 rounded-full px-4 py-2.5 hover:bg-gray-100 transition">
                    <span className="text-xs text-gray-400 flex-1">Ask about your risk profile...</span>
                    <span className="text-xs text-[#0A0A0A] font-semibold">Connect →</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <h3 className="font-semibold text-[#0A0A0A] mb-4">Risk Factor Breakdown</h3>
                <div className="space-y-3.5">
                  {RISK_FACTORS.map(f => (
                    <div key={f.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-600">{f.label}</span>
                        <span className="font-semibold text-[#0A0A0A]">{f.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${f.pct}%`, background: f.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <h3 className="font-semibold text-[#0A0A0A] mb-4">AI Recommended Actions</h3>
                <div className="space-y-3">
                  {ACTIONS.map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${a.color}`}>{a.priority}</span>
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
              <div>
                <h2 className="text-xl font-bold text-[#0A0A0A]">Transactions</h2>
                <p className="text-xs text-gray-400 mt-0.5">Last 30 days · {TRANSACTIONS.length} orders · $
                  {TRANSACTIONS.reduce((s, t) => s + t.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} total
                </p>
              </div>
              <div className="flex gap-2">
                {['All', 'Disputed', 'High Risk'].map(f => (
                  <button key={f} className={`text-xs px-3 py-1.5 rounded-full border transition ${f === 'All' ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-[#E5E7EB] text-gray-500 hover:border-[#0A0A0A]'}`}>{f}</button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                    {['Date', 'Order ID', 'Product', 'Amount', 'Country', 'Risk', 'Status'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TRANSACTIONS.map(tx => (
                    <tr key={tx.id} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition">
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{tx.date}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono">{tx.id}</td>
                      <td className="px-4 py-3 text-xs text-gray-700 max-w-[180px] truncate">{tx.product}</td>
                      <td className="px-4 py-3 font-semibold text-[#0A0A0A] text-sm">${tx.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{tx.flag} <span className="text-xs text-gray-500">{tx.country}</span></td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          tx.risk >= 80 ? 'bg-[#FEF2F2] text-[#DC2626]' :
                          tx.risk >= 50 ? 'bg-[#FFF7ED] text-[#C2410C]' :
                          'bg-[#F0FDF4] text-[#15803D]'
                        }`}>{tx.risk}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          tx.status === 'disputed' ? 'bg-[#FEF2F2] text-[#DC2626]' :
                          tx.status === 'refunded'  ? 'bg-[#EFF6FF] text-[#1D4ED8]' :
                          'bg-[#F0FDF4] text-[#15803D]'
                        }`}>{tx.status}</span>
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
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: 'Critical (≥80)',  value: String(TRANSACTIONS.filter(t => t.risk >= 80).length), sub: 'Immediate action',  color: 'text-[#DC2626]' },
                { label: 'High (50–79)',    value: String(TRANSACTIONS.filter(t => t.risk >= 50 && t.risk < 80).length), sub: 'Review required', color: 'text-[#F97316]' },
                { label: 'Countries flagged', value: '5', sub: 'NG, RU, UA, BR, MX', color: 'text-[#EAB308]' },
                { label: 'Disputed revenue', value: '$3,325', sub: 'This month',        color: 'text-[#DC2626]' },
              ].map(k => (
                <div key={k.label} className="bg-white rounded-2xl p-5 border border-[#E5E7EB]">
                  <p className="text-gray-500 text-xs mb-1">{k.label}</p>
                  <p className={`text-3xl font-bold ${k.color}`}>{k.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
                <h3 className="font-semibold text-[#0A0A0A]">High-Risk Orders</h3>
                <span className="text-xs text-gray-400">{TRANSACTIONS.filter(t => t.risk >= 50).length} transactions</span>
              </div>
              {TRANSACTIONS.filter(t => t.risk >= 50).map(tx => (
                <div key={tx.id} className="flex items-center justify-between px-5 py-4 border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      tx.risk >= 80 ? 'bg-[#FEF2F2] text-[#DC2626]' : 'bg-[#FFF7ED] text-[#C2410C]'
                    }`}>{tx.risk}</div>
                    <div>
                      <p className="text-sm font-semibold text-[#0A0A0A]">{tx.product}</p>
                      <p className="text-xs text-gray-400">{tx.email} · {tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-bold text-[#0A0A0A]">${tx.amount.toFixed(2)}</p>
                    <span className="text-lg">{tx.flag}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      tx.status === 'disputed' ? 'bg-[#FEF2F2] text-[#DC2626]' :
                      tx.status === 'refunded'  ? 'bg-[#EFF6FF] text-[#1D4ED8]' :
                      'bg-[#F0FDF4] text-[#15803D]'
                    }`}>{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ALERTS ── */}
        {tab === 'Alerts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0A0A0A]">Alerts</h2>
              <span className="text-xs bg-[#FEF2F2] text-[#DC2626] font-semibold px-2.5 py-1 rounded-full">3 critical unread</span>
            </div>
            <div className="space-y-3">
              {ALERTS.map(a => (
                <div key={a.id} className={`bg-white rounded-2xl p-5 border flex items-start gap-4 ${
                  a.type === 'critical' ? 'border-[#FECACA]' :
                  a.type === 'warning'  ? 'border-[#FED7AA]' :
                  'border-[#E5E7EB]'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
                    a.type === 'critical' ? 'bg-[#FEF2F2]' :
                    a.type === 'warning'  ? 'bg-[#FFF7ED]' :
                    'bg-[#F9FAFB]'
                  }`}>
                    {a.type === 'critical' ? '🚨' : a.type === 'warning' ? '⚠️' : 'ℹ️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0A0A0A] leading-relaxed">{a.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 bg-[#0A0A0A] rounded-2xl p-8 text-center">
          <p className="text-white font-bold text-xl mb-2">Want a dashboard like this for your store?</p>
          <p className="text-gray-400 text-sm mb-6">Connect your processor or upload statements — full AI risk analysis in under 2 minutes.</p>
          <Link href="/signup" className="inline-block bg-white text-[#0A0A0A] font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition text-sm">
            Get started free →
          </Link>
        </div>

      </div>
    </div>
  )
}
