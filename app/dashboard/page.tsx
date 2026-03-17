'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ──────────────────────────────────────────────────────────────────────
interface MerchantAiAnalysis {
  summary?: string
  monthly_breakdown?: Array<{ month: string; chargeback_rate: number; volume: number; disputes: number }>
  top_risk_factors?: string[]
  recommended_actions?: string[]
  biggest_threat?: string
}

interface Merchant {
  id: string
  chargeback_rate: number
  total_volume: number
  avg_ticket: number
  mid_risk_level: string
  ai_analysis: MerchantAiAnalysis | null
  biggest_threat: string | null
  recommended_actions: string[] | null
  status: string
  dismissed_edr_upsell: boolean
  onboard_method: string
  processor: string | null
  plan: string | null
  subscription_status: string | null
}

interface Transaction {
  id: string
  amount: number
  disputed: boolean
  risk_score: number
  country: string
  email: string
  created_at: string
  status: string
  card_network?: string
}

interface ChatMsg { role: 'user' | 'assistant'; content: string }

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
}

// ── Widget Feedback ────────────────────────────────────────────────────────────
function WidgetFeedback({ widgetId }: { widgetId: string }) {
  const supabase = createClient()
  const [voted, setVoted] = useState<'up' | 'down' | null>(null)

  async function vote(v: 'up' | 'down') {
    setVoted(v)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('widget_feedback').upsert({
      user_id: user.id,
      widget_id: widgetId,
      helpful: v === 'up',
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,widget_id' })
  }

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F3F4F6]">
      <span className="text-xs text-[#9CA3AF]">Was this widget helpful?</span>
      <button onClick={() => vote('up')} className={`text-sm transition ${voted === 'up' ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}>👍</button>
      <button onClick={() => vote('down')} className={`text-sm transition ${voted === 'down' ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}>👎</button>
    </div>
  )
}

// ── Widget Wrapper ─────────────────────────────────────────────────────────────
function Widget({ id, title, children, className = '' }: { id: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
          <span className="text-[#9CA3AF] text-xs cursor-help" title="Analytics widget">ℹ</span>
        </div>
        <span className="text-xs text-[#9CA3AF]">Last 6 Months</span>
      </div>
      {children}
      <WidgetFeedback widgetId={id} />
    </div>
  )
}

// ── Empty Widget ───────────────────────────────────────────────────────────────
function EmptyWidget() {
  return (
    <div className="h-40 flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white rounded-lg" />
      <div className="flex flex-col items-center gap-2 z-10">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-gray-400 text-sm">📊</span>
        </div>
        <p className="text-xs text-[#9CA3AF]">No data to display</p>
      </div>
    </div>
  )
}

// ── Metric Card ────────────────────────────────────────────────────────────────
function MetricCard({
  icon, title, label1, value1, label2, value2, loading, iconBg = '#EEF2FF', iconColor = '#4F46E5'
}: {
  icon: string
  title: string
  label1: string
  value1: string
  label2: string
  value2: string
  loading: boolean
  iconBg?: string
  iconColor?: string
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: iconBg, color: iconColor }}>
          {icon}
        </div>
        <span className="text-sm font-semibold text-[#111827]">{title}</span>
      </div>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-[#6B7280]">{label1}</p>
          <p className="text-xl font-bold text-[#111827]">{value1}</p>
          <p className="text-xs text-[#6B7280]">{label2}</p>
          <p className="text-xl font-bold text-[#111827]">{value2}</p>
        </div>
      )}
    </div>
  )
}

// ── AI Chat ─────────────────────────────────────────────────────────────────
function AIAnalystCard({ merchant, transactions }: { merchant: Merchant | null; transactions: Transaction[] }) {
  const supabase = createClient()
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const SUGGESTED = [
    'How do I reduce my chargeback rate?',
    'Which transactions are highest risk?',
    'Am I at risk of MID termination?',
    "What's my biggest risk factor?",
  ]

  useEffect(() => {
    async function loadHistory() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('chat_history')
        .select('role, message')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(20)
      if (data && data.length > 0) {
        setMessages(data.map((m: { role: string; message: string }) => ({ role: m.role as 'user' | 'assistant', content: m.message })))
      } else {
        const cbRate = merchant?.chargeback_rate ?? 0
        const summary = merchant?.ai_analysis?.summary
        if (summary) {
          setMessages([{
            role: 'assistant',
            content: `Based on your data, your chargeback rate is ${(cbRate * 100).toFixed(2)}%. ${summary}${merchant?.biggest_threat ? ` Your biggest risk right now is: ${merchant.biggest_threat}.` : ''}`
          }])
        } else {
          setMessages([{
            role: 'assistant',
            content: `Hello! I'm your HRI Analyst. I'm ready to analyze your payment risk profile. Connect your processor or ask me anything to get started.`
          }])
        }
      }
      setHistoryLoaded(true)
    }
    loadHistory()
  }, [merchant])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(msg?: string) {
    const text = msg || input.trim()
    if (!text || loading) return
    setInput('')
    const history = messages.slice(-10)
    setMessages(m => [...m, { role: 'user', content: text }])
    setLoading(true)
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversation_history: history.map(m => ({ role: m.role, content: m.content }))
        })
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', content: data.response || data.reply || 'Unable to respond.' }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Connection error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <span className="text-base">🤖</span>
          <span className="text-sm font-bold text-[#111827]">HRI Analyst</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
            <span className="text-xs text-[#10B981] font-medium">Active</span>
          </div>
        </div>
        <button onClick={() => setMessages([])} className="text-xs text-[#6B7280] hover:text-[#111827] transition px-2 py-1 rounded-lg border border-[#E5E7EB]">
          ↺ Refresh
        </button>
      </div>

      {/* Messages */}
      <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: 280 }}>
        {!historyLoaded && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-10 w-1/2 ml-auto" />
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#4F46E5] text-white rounded-br-sm'
                : 'bg-gray-50 text-[#374151] rounded-bl-sm border border-[#E5E7EB]'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 border border-[#E5E7EB] rounded-xl px-4 py-3 flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested */}
      {messages.length <= 1 && !loading && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {SUGGESTED.map(q => (
            <button key={q} onClick={() => send(q)}
              className="text-xs bg-indigo-50 text-[#4F46E5] border border-indigo-100 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={e => { e.preventDefault(); send() }} className="flex gap-2 p-3 border-t border-[#E5E7EB]">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about your risk profile..."
          className="flex-1 bg-gray-50 border border-[#E5E7EB] rounded-full px-4 py-2 text-sm outline-none focus:border-[#4F46E5] transition"
          disabled={loading}
        />
        <button type="submit" disabled={!input.trim() || loading}
          className="bg-[#4F46E5] text-white rounded-full w-9 h-9 flex items-center justify-center text-sm disabled:opacity-40 hover:bg-indigo-700 transition flex-shrink-0">
          →
        </button>
      </form>
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function groupByMonth(txs: Transaction[]): { month: string; disputes: number; volume: number; cbRate: number }[] {
  const map: Record<string, { disputes: number; volume: number; total: number }> = {}
  txs.forEach(t => {
    const d = new Date(t.created_at)
    const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    if (!map[key]) map[key] = { disputes: 0, volume: 0, total: 0 }
    map[key].volume += t.amount
    map[key].total += 1
    if (t.disputed) map[key].disputes += 1
  })
  return Object.entries(map).map(([month, v]) => ({
    month,
    disputes: v.disputes,
    volume: Math.round(v.volume),
    cbRate: v.total > 0 ? parseFloat(((v.disputes / v.total) * 100).toFixed(2)) : 0
  })).slice(-6)
}

const HIGH_RISK_COUNTRIES = ['NG', 'RU', 'UA', 'BY', 'IR', 'KP', 'SY', 'VE']

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const [name, setName] = useState('there')
  const [greeting, setGreeting] = useState('')
  const [merchant, setMerchant] = useState<Merchant | null | undefined>(undefined)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')

  const isSampleMode = !merchant || merchant.status === 'onboarding' || merchant.onboard_method === 'skipped'

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/signin'); return }
    setName(user.user_metadata?.full_name?.split(' ')[0] || 'there')

    const { data: m } = await supabase.from('merchants').select('*').eq('user_id', user.id).single()
    if (!m || m.status === 'onboarding') {
      router.replace('/onboarding')
      return
    }
    setMerchant(m as Merchant)

    if (m?.id) {
      const { data: txs } = await supabase
        .from('transactions')
        .select('id, amount, disputed, risk_score, country, email, created_at, status, card_network')
        .eq('merchant_id', m.id)
        .order('created_at', { ascending: true })
      setTransactions((txs as Transaction[]) || [])
    }
    setLoading(false)
  }

  // ── Computed metrics ──
  const disputedTxs = transactions.filter(t => t.disputed)
  const activeDisputes = disputedTxs.filter(t => t.status !== 'won' && t.status !== 'lost' && !t.status?.includes('refund'))
  const underReview = transactions.filter(t => t.risk_score > 50 && t.disputed)
  const disputeValue = disputedTxs.reduce((s, t) => s + t.amount, 0)
  const activeDisputeValue = activeDisputes.reduce((s, t) => s + t.amount, 0)
  const avgTicket = transactions.length > 0 ? transactions.reduce((s, t) => s + t.amount, 0) / transactions.length : 0
  const hourssaved = disputedTxs.length * 2.5
  const moneySaved = disputedTxs.length * avgTicket * 0.15
  const hrDisputed = disputedTxs.filter(t => HIGH_RISK_COUNTRIES.includes(t.country?.toUpperCase())).length
  const fraudRate = disputedTxs.length > 0 ? (hrDisputed / disputedTxs.length) * 100 : 0

  // Monthly data
  const monthlyData = groupByMonth(transactions)

  // Dispute by reason (mock if no data)
  const reasonData = [
    { name: 'Fraud', value: 40, color: '#EF4444' },
    { name: 'Not Received', value: 25, color: '#F59E0B' },
    { name: 'Not as Described', value: 20, color: '#4F46E5' },
    { name: 'Other', value: 15, color: '#9CA3AF' },
  ]

  // Repeat disputers
  const emailMap: Record<string, { count: number; total: number; email: string }> = {}
  disputedTxs.forEach(t => {
    if (!t.email) return
    if (!emailMap[t.email]) emailMap[t.email] = { count: 0, total: 0, email: t.email }
    emailMap[t.email].count += 1
    emailMap[t.email].total += t.amount
  })
  const repeatDisputers = Object.values(emailMap).filter(e => e.count > 1).sort((a, b) => b.count - a.count).slice(0, 5)

  // Country data
  const countryMap: Record<string, number> = {}
  disputedTxs.forEach(t => {
    if (!t.country) return
    countryMap[t.country] = (countryMap[t.country] || 0) + 1
  })
  const countryData = Object.entries(countryMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([country, count]) => ({ country, count }))

  // Risk distribution
  const riskBuckets = [
    { range: '0-20', count: transactions.filter(t => t.risk_score <= 20).length },
    { range: '21-40', count: transactions.filter(t => t.risk_score > 20 && t.risk_score <= 40).length },
    { range: '41-60', count: transactions.filter(t => t.risk_score > 40 && t.risk_score <= 60).length },
    { range: '61-80', count: transactions.filter(t => t.risk_score > 60 && t.risk_score <= 80).length },
    { range: '81-100', count: transactions.filter(t => t.risk_score > 80).length },
  ]

  // Card network
  const networkMap: Record<string, number> = {}
  transactions.forEach(t => {
    const n = t.card_network || 'Other'
    networkMap[n] = (networkMap[n] || 0) + 1
  })
  const networkData = Object.keys(networkMap).length > 0
    ? Object.entries(networkMap).map(([name, value]) => ({ name, value }))
    : [{ name: 'Visa', value: 60 }, { name: 'Mastercard', value: 35 }, { name: 'Other', value: 5 }]
  const networkColors = ['#1A56DB', '#EF4444', '#9CA3AF', '#F59E0B']

  // MID Health gauge
  const cbRate = merchant?.chargeback_rate ?? 0
  const healthScore = Math.max(0, Math.min(100, Math.round(100 - (cbRate * 100 * 30) - (activeDisputes.length * 2))))
  const healthColor = healthScore >= 75 ? '#10B981' : healthScore >= 50 ? '#F59E0B' : '#EF4444'

  // Monthly volume
  const volumeData = monthlyData.map(m => ({ month: m.month, volume: m.volume }))

  // Daily risk (last 30 days)
  const dailyRiskMap: Record<string, { sum: number; count: number }> = {}
  const thirtyDaysAgo = Date.now() - 30 * 86400000
  transactions
    .filter(t => new Date(t.created_at).getTime() > thirtyDaysAgo)
    .forEach(t => {
      const day = new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (!dailyRiskMap[day]) dailyRiskMap[day] = { sum: 0, count: 0 }
      dailyRiskMap[day].sum += t.risk_score
      dailyRiskMap[day].count += 1
    })
  const dailyRiskData = Object.entries(dailyRiskMap)
    .map(([day, v]) => ({ day, avgRisk: Math.round(v.sum / v.count) }))
    .slice(-14)

  // Setup progress
  const setupSteps = [
    { label: 'Account created', done: true },
    { label: 'Connect processor', done: !!merchant?.processor },
    { label: 'First transaction synced', done: transactions.length > 0 },
    { label: 'AI analysis complete', done: !!merchant?.ai_analysis },
  ]
  const setupProgress = Math.round((setupSteps.filter(s => s.done).length / setupSteps.length) * 100)

  return (
    <div className="space-y-6">
      {/* Sample mode banner */}
      {isSampleMode && !loading && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm">
          <span className="text-amber-800">📊 You&apos;re viewing sample data — connect your processor to see your real risk profile.</span>
          <a href="/onboarding" className="text-amber-900 font-semibold ml-4 hover:underline whitespace-nowrap flex-shrink-0">Complete setup →</a>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          {loading ? (
            <>
              <Skeleton className="h-8 w-56 mb-2" />
              <Skeleton className="h-4 w-72" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#111827]">{greeting}, {name} 👋</h1>
              <p className="text-[#6B7280] text-sm mt-1">
                {cbRate > 0.015 ? '⚠️ Your chargeback rate needs attention today.' :
                  cbRate > 0 && cbRate < 0.005 ? '✓ Your MID is healthy. Keep it that way.' :
                  `Here's your risk summary for ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.`}
              </p>
            </>
          )}
        </div>

        {/* Setup progress */}
        {!loading && setupProgress < 100 && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] min-w-[220px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#111827]">Setup Progress</span>
              <span className="text-xs text-[#4F46E5] font-bold">{setupProgress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
              <div className="h-1.5 bg-[#4F46E5] rounded-full transition-all" style={{ width: `${setupProgress}%` }} />
            </div>
            <div className="space-y-1">
              {setupSteps.map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className={`text-xs ${s.done ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`}>{s.done ? '✓' : '○'}</span>
                  <span className={`text-xs ${s.done ? 'text-[#6B7280] line-through' : 'text-[#374151]'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date range picker */}
        <div className="flex items-center gap-1 bg-white border border-[#E5E7EB] rounded-xl p-1 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          {(['7d', '30d', '90d', '1y'] as const).map(r => (
            <button key={r} onClick={() => setDateRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${dateRange === r ? 'bg-[#4F46E5] text-white' : 'text-[#6B7280] hover:text-[#111827]'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 8 Metric Cards — 2 rows × 4 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon="⚡" title="Active Disputes" iconBg="#FEF2F2" iconColor="#EF4444"
          label1="Dispute count" value1={loading ? '–' : String(activeDisputes.length)}
          label2="Total value" value2={loading ? '–' : `$${activeDisputeValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          loading={loading}
        />
        <MetricCard
          icon="📋" title="Evidence Submitted" iconBg="#FFFBEB" iconColor="#F59E0B"
          label1="Submitted count" value1={loading ? '–' : '0'}
          label2="Total value" value2={loading ? '–' : '$0'}
          loading={loading}
        />
        <MetricCard
          icon="🔍" title="Under Review" iconBg="#EFF6FF" iconColor="#3B82F6"
          label1="In review" value1={loading ? '–' : String(underReview.length)}
          label2="High risk score" value2={loading ? '–' : `${transactions.filter(t => t.risk_score > 75).length} txns`}
          loading={loading}
        />
        <MetricCard
          icon="🏆" title="Disputes Recovered" iconBg="#ECFDF5" iconColor="#10B981"
          label1="Won disputes" value1={loading ? '–' : String(transactions.filter(t => t.status === 'won').length)}
          label2="Value recovered" value2={loading ? '–' : '$0'}
          loading={loading}
        />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon="📊" title="Disputes Created" iconBg="#F3F4F6" iconColor="#6B7280"
          label1="Total count" value1={loading ? '–' : String(disputedTxs.length)}
          label2="Total value" value2={loading ? '–' : `$${disputeValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          loading={loading}
        />
        <MetricCard
          icon="💰" title="Estimated Savings" iconBg="#ECFDF5" iconColor="#10B981"
          label1="Time saved" value1={loading ? '–' : `${hourssaved.toFixed(0)}h`}
          label2="Revenue saved" value2={loading ? '–' : `$${moneySaved.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          loading={loading}
        />
        <MetricCard
          icon="🌍" title="Intentional Fraud Rate" iconBg="#FEF2F2" iconColor="#EF4444"
          label1="High-risk country disputes" value1={loading ? '–' : String(hrDisputed)}
          label2="Fraud rate" value2={loading ? '–' : `${fraudRate.toFixed(1)}%`}
          loading={loading}
        />
        <MetricCard
          icon="🎯" title="Win Rate" iconBg="#F5F3FF" iconColor="#4F46E5"
          label1="Disputes won" value1={loading ? '–' : '–'}
          label2="Status" value2={loading ? '–' : 'Set up processor to track'}
          loading={loading}
        />
      </div>

      {/* AI Analyst */}
      <AIAnalystCard merchant={merchant ?? null} transactions={transactions} />

      {/* Widget Grid — 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Widget 1: Chargeback Rate Over Time */}
        <Widget id="cb-rate-chart" title="Chargeback Rate Over Time">
          {loading ? <Skeleton className="h-40" /> : monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v) => [`${v}%`, 'CB Rate']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                <ReferenceLine y={1.0} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Visa 1.0%', fontSize: 10, fill: '#F59E0B', position: 'insideTopRight' }} />
                <ReferenceLine y={1.8} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Term. 1.8%', fontSize: 10, fill: '#EF4444', position: 'insideTopRight' }} />
                <Line type="monotone" dataKey="cbRate" stroke="#4F46E5" strokeWidth={2} dot={{ r: 3, fill: '#4F46E5' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <EmptyWidget />}
        </Widget>

        {/* Widget 2: Disputes by Reason */}
        <Widget id="dispute-reason-pie" title="Disputes by Reason">
          {loading ? <Skeleton className="h-40" /> : disputedTxs.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={reasonData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {reasonData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyWidget />}
        </Widget>

        {/* Widget 3: Disputes by Month */}
        <Widget id="disputes-by-month" title="Disputes by Month">
          {loading ? <Skeleton className="h-40" /> : monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                <Bar dataKey="disputes" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyWidget />}
        </Widget>

        {/* Widget 4: Repeat Disputers */}
        <Widget id="repeat-disputers" title="Repeat Disputers">
          {loading ? <Skeleton className="h-40" /> : repeatDisputers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[#9CA3AF] border-b border-[#F3F4F6]">
                    <th className="text-left py-2 font-medium">Email</th>
                    <th className="text-right py-2 font-medium">Disputes</th>
                    <th className="text-right py-2 font-medium">Value</th>
                    <th className="text-right py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {repeatDisputers.map((r, i) => (
                    <tr key={i} className="border-b border-[#F3F4F6] last:border-0">
                      <td className="py-2 text-[#374151] truncate max-w-[120px]">{r.email}</td>
                      <td className="py-2 text-right font-semibold text-[#EF4444]">{r.count}</td>
                      <td className="py-2 text-right text-[#374151]">${r.total.toFixed(0)}</td>
                      <td className="py-2 text-right">
                        <button className="text-xs bg-red-50 text-[#EF4444] px-2 py-0.5 rounded-full border border-red-100 hover:bg-red-100 transition">Block</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <p className="text-xs text-[#9CA3AF]">We couldn&apos;t find any repeat disputers</p>
            </div>
          )}
        </Widget>

        {/* Widget 5: Disputes by Country */}
        <Widget id="disputes-by-country" title="Disputes by Country">
          {loading ? <Skeleton className="h-40" /> : countryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={countryData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="country" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={35} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                <Bar dataKey="count" fill="#4F46E5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyWidget />}
        </Widget>

        {/* Widget 6: Risk Score Distribution */}
        <Widget id="risk-distribution" title="Risk Score Distribution">
          {loading ? <Skeleton className="h-40" /> : transactions.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={riskBuckets}>
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {riskBuckets.map((entry, i) => (
                    <Cell key={i} fill={i < 2 ? '#10B981' : i === 2 ? '#F59E0B' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyWidget />}
        </Widget>

        {/* Widget 7: Disputes by Card Network */}
        <Widget id="card-network-pie" title="Disputes by Card Network">
          {loading ? <Skeleton className="h-40" /> : (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={networkData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3}>
                  {networkData.map((_, i) => <Cell key={i} fill={networkColors[i % networkColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Widget>

        {/* Widget 8: MID Health Gauge */}
        <Widget id="mid-health-gauge" title="MID Health Score">
          {loading ? <Skeleton className="h-40" /> : (
            <div className="flex flex-col items-center justify-center py-4">
              <svg width="160" height="90" viewBox="0 0 160 90">
                <path d="M 15 80 A 65 65 0 0 1 145 80" stroke="#E5E7EB" strokeWidth="12" fill="none" strokeLinecap="round" />
                <path
                  d="M 15 80 A 65 65 0 0 1 145 80"
                  stroke={healthColor}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(healthScore / 100) * 204} 204`}
                />
                <text x="80" y="72" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#111827">{healthScore}</text>
                <text x="80" y="86" textAnchor="middle" fontSize="10" fill="#9CA3AF">/100</text>
              </svg>
              <p className="text-sm font-semibold mt-1" style={{ color: healthColor }}>
                {healthScore >= 75 ? 'Healthy' : healthScore >= 50 ? 'Moderate Risk' : 'Critical'}
              </p>
              <p className="text-xs text-[#9CA3AF] mt-1">CB Rate: {(cbRate * 100).toFixed(2)}%</p>
            </div>
          )}
        </Widget>

        {/* Widget 9: Monthly Volume */}
        <Widget id="monthly-volume" title="Monthly Volume">
          {loading ? <Skeleton className="h-40" /> : volumeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Volume']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                <Area type="monotone" dataKey="volume" stroke="#4F46E5" strokeWidth={2} fill="url(#volGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <EmptyWidget />}
        </Widget>

        {/* Widget 10: Transaction Risk Over Time */}
        <Widget id="risk-over-time" title="Transaction Risk Over Time">
          {loading ? <Skeleton className="h-40" /> : dailyRiskData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={dailyRiskData}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip formatter={(v: number) => [v, 'Avg Risk Score']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                <Area type="monotone" dataKey="avgRisk" stroke="#EF4444" strokeWidth={2} fill="url(#riskGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <EmptyWidget />}
        </Widget>
      </div>
    </div>
  )
}
