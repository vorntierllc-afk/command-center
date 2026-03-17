'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

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
}

interface Alert {
  id: string
  type: string
  message: string
  read: boolean
  created_at: string
}

interface ChatMsg { role: 'user' | 'assistant'; content: string }

// ── Skeleton Loader ────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-gray-100 dark:bg-[#1A1A1A] rounded-lg animate-pulse ${className}`} />
}

// ── EDR Panel ─────────────────────────────────────────────────────────────────
function EDRPanel({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 260 }}
      className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-[#111111] shadow-2xl z-50 flex flex-col border-l border-[#E5E7EB]"
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🛡️</span>
              <h3 className="font-bold text-[#0A0A0A] dark:text-white">Protect your MID</h3>
            </div>
            <p className="text-xs text-[#DC2626] font-semibold">Chargeback rate above threshold</p>
          </div>
          <button onClick={onDismiss} className="text-gray-300 hover:text-gray-500 text-xl leading-none">✕</button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          Get notified the moment a dispute is filed — before it becomes a chargeback. Our Early Detection network monitors Visa and Mastercard disputes globally.
        </p>
        <div className="space-y-3 mb-6">
          {['Alerts within minutes of dispute filing', '24–72 hour window to respond', 'Covers 95% of Visa + Mastercard disputes', 'One-click refund or fight decision'].map(b => (
            <div key={b} className="flex items-center gap-3">
              <span className="text-[#16A34A] font-bold flex-shrink-0">✓</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{b}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mb-6 italic">&ldquo;Merchants using dispute alerts reduce chargebacks by up to 57%.&rdquo;</p>
        <div className="mt-auto space-y-2">
          <button className="w-full bg-[#0A0A0A] text-white rounded-full py-3 text-sm font-semibold hover:bg-gray-900 transition">
            Activate dispute protection — $49/mo
          </button>
          <button onClick={onDismiss} className="w-full text-xs text-gray-400 hover:text-gray-600 py-1">
            Dismiss for 48 hours
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── AI Chat Panel ──────────────────────────────────────────────────────────────
function ChatPanel({ merchant }: { merchant: Merchant | null }) {
  const supabase = createClient()
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const SUGGESTED = [
    'How do I reduce my chargeback rate?',
    'Which transactions should I refund?',
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
        setMessages(data.map(m => ({ role: m.role as 'user' | 'assistant', content: m.message })))
      } else {
        const summary = merchant?.ai_analysis?.summary
        const threat = merchant?.biggest_threat || merchant?.ai_analysis?.biggest_threat
        if (summary) {
          setMessages([{ role: 'assistant', content: `${summary}${threat ? ` Your biggest risk right now is: ${threat}.` : ''}` }])
        } else if (!merchant || merchant.status === 'onboarding' || merchant.onboard_method === 'skipped') {
          setMessages([{ role: 'assistant', content: "I'm ready to analyze your data. Connect your processor or upload your statements to get your personalized risk profile — I'll walk you through exactly what to fix." }])
        } else {
          setMessages([{ role: 'assistant', content: "Hello! I'm your HRI Analyst. Ask me anything about your payment risk profile." }])
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
    <div className="flex flex-col h-full bg-white dark:bg-[#111111] rounded-2xl border border-[#E5E7EB] dark:border-[#222222] overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6] dark:border-[#222222]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse" />
          <span className="text-sm font-bold text-[#0A0A0A] dark:text-white">HRI Analyst</span>
          <span className="text-xs text-gray-400">Active</span>
        </div>
        <button onClick={() => setMessages([])} className="text-xs text-gray-400 hover:text-gray-600 transition">↺ Reset</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {!historyLoaded && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-10 w-1/2 ml-auto" />
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-[#0A0A0A] text-white rounded-br-sm' : 'bg-gray-50 dark:bg-[#1A1A1A] text-gray-800 dark:text-gray-200 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-xl px-4 py-3 flex gap-1">
              {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && !loading && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {SUGGESTED.map(q => (
            <button key={q} onClick={() => send(q)}
              className="text-xs bg-gray-50 dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#333333] text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition">
              {q}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={e => { e.preventDefault(); send() }} className="flex gap-2 p-3 border-t border-[#F3F4F6] dark:border-[#222222]">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about your risk profile..."
          className="flex-1 bg-gray-50 dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#333333] rounded-full px-4 py-2 text-sm outline-none focus:border-[#0A0A0A] transition"
          disabled={loading} />
        <button type="submit" disabled={!input.trim() || loading}
          className="bg-[#0A0A0A] text-white rounded-full w-9 h-9 flex items-center justify-center text-sm disabled:opacity-40 hover:bg-gray-900 transition flex-shrink-0">
          →
        </button>
      </form>
    </div>
  )
}

// ── Main Dashboard Page ────────────────────────────────────────────────────────
export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const [name, setName] = useState('there')
  const [greeting, setGreeting] = useState('')
  const [merchant, setMerchant] = useState<Merchant | null | undefined>(undefined)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [txStats, setTxStats] = useState<{ total: number; disputes: number; totalVolume: number; avgTicket: number } | null>(null)
  const [showEDR, setShowEDR] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  const isSampleMode = !merchant || merchant.status === 'onboarding' || merchant.onboard_method === 'skipped'

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')

    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setName(user.user_metadata?.full_name?.split(' ')[0] || 'there')

      const [{ data: m }, { data: als }] = await Promise.all([
        supabase.from('merchants').select('*').eq('user_id', user.id).single(),
        supabase.from('alerts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
      ])

      // Redirect to onboarding if not yet completed
      if (!m || m.status === 'onboarding') {
        router.replace('/onboarding')
        return
      }

      setMerchant((m as Merchant) || null)
      setAlerts(als || [])

      if (m?.id) {
        const { data: txs } = await supabase
          .from('transactions')
          .select('amount, disputed, risk_score')
          .eq('merchant_id', m.id)
        if (txs) {
          setTxStats({
            total: txs.length,
            disputes: txs.filter((t: { disputed: boolean }) => t.disputed).length,
            totalVolume: txs.reduce((s: number, t: { amount: number }) => s + t.amount, 0),
            avgTicket: txs.length > 0 ? txs.reduce((s: number, t: { amount: number }) => s + t.amount, 0) / txs.length : 0
          })
        }

        if (m.chargeback_rate > 0.008 && !m.dismissed_edr_upsell) {
          const dismissedAt = localStorage.getItem('edr_dismissed_at')
          if (!dismissedAt || Date.now() - Number(dismissedAt) > 48 * 3600 * 1000) {
            setShowEDR(true)
          }
        }
      }
      setLoadingData(false)
    }
    loadData()
  }, [])

  async function dismissEDR() {
    setShowEDR(false)
    localStorage.setItem('edr_dismissed_at', String(Date.now()))
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('merchants').update({
        dismissed_edr_upsell: true,
        edr_upsell_dismissed_at: new Date().toISOString()
      }).eq('user_id', user.id)
    }
  }

  const rate = merchant?.chargeback_rate ?? 0
  const rateDisplay = `${(rate * 100).toFixed(2)}%`
  const rateColor = rate > 0.015 ? '#DC2626' : rate > 0.01 ? '#EA580C' : rate > 0.005 ? '#D97706' : '#16A34A'
  const rateBorder = rate > 0.015 ? 'border-[#DC2626]' : rate > 0.01 ? 'border-orange-500' : rate > 0.005 ? 'border-[#D97706]' : 'border-[#16A34A]'

  const healthScore = merchant
    ? Math.max(0, Math.min(100, Math.round(100 - (rate * 100 * 30) - ((txStats?.disputes ?? 0) * 2))))
    : 0
  const healthLabel = healthScore >= 80 ? 'Healthy' : healthScore >= 50 ? 'Moderate' : 'Critical'
  const healthColor = healthScore >= 80 ? '#16A34A' : healthScore >= 50 ? '#D97706' : '#DC2626'

  const topAction = merchant?.recommended_actions?.[0]
    || merchant?.ai_analysis?.recommended_actions?.[0]
    || (isSampleMode ? 'Connect your processor to see real recommendations' : 'No critical actions today ✓')

  const unreadAlerts = alerts.filter(a => !a.read).length
  const subtitle = rate > 0.015 ? '⚠️ Your chargeback rate needs attention today.' :
    rate > 0 && rate < 0.005 ? '✓ Your MID is healthy. Keep it that way.' :
    unreadAlerts > 0 ? `You have ${unreadAlerts} new alert${unreadAlerts > 1 ? 's' : ''}.` :
    `Here's your risk summary for ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.`

  const chartData = merchant?.ai_analysis?.monthly_breakdown?.map(m => ({
    month: m.month,
    rate: parseFloat((m.chargeback_rate * 100).toFixed(2))
  })) || []

  return (
    <div className="p-6 md:p-8 pb-20 md:pb-8">
      {/* Sample data banner */}
      {isSampleMode && !loadingData && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm">
          <span className="text-amber-800">📊 You&apos;re viewing sample data — Connect your processor to see your real risk profile.</span>
          <Link href="/onboarding" className="text-amber-900 font-semibold ml-4 hover:underline whitespace-nowrap flex-shrink-0">Complete setup →</Link>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          {loadingData ? (
            <>
              <Skeleton className="h-8 w-56 mb-2" />
              <Skeleton className="h-4 w-72" />
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0A0A0A] dark:text-white">{greeting}, {name}</h1>
              <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full flex-shrink-0">
          <div className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-700">Live monitoring</span>
        </div>
      </div>

      {/* Main layout: left ~62%, right ~38% chat */}
      <div className="flex flex-col xl:flex-row gap-5">
        <div className="flex-1 min-w-0 space-y-5">
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Chargeback Rate */}
            <div className={`bg-white dark:bg-[#111111] rounded-2xl p-6 border-t-4 shadow-sm ${rateBorder}`}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Chargeback Rate</p>
              {loadingData ? <Skeleton className="h-10 w-24 mb-2" /> : (
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-4xl font-bold" style={{ color: rateColor }}>{rateDisplay}</span>
                </div>
              )}
              <p className="text-xs text-gray-400">Visa threshold: 1.0% · Mastercard: 1.5%</p>
            </div>

            {/* MID Health */}
            <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 border-t-4 shadow-sm" style={{ borderTopColor: healthColor }}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">MID Health Score</p>
              {loadingData ? <Skeleton className="h-10 w-20 mb-3" /> : (
                <>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl font-bold text-[#0A0A0A] dark:text-white">{healthScore}</span>
                    <span className="text-sm text-gray-400 mb-1">/100</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-[#222222] rounded-full h-1.5 mb-2">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${healthScore}%`, backgroundColor: healthColor }} />
                  </div>
                </>
              )}
              <p className="text-xs text-gray-400">{healthLabel}{!loadingData && ' — action advisory active'}</p>
            </div>

            {/* Today's Action */}
            <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 border-t-4 border-[#0A0A0A] shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Today&apos;s Top Action</p>
              {loadingData ? <Skeleton className="h-14 w-full mb-4" /> : (
                <p className="text-sm font-semibold text-[#0A0A0A] dark:text-white mb-4 leading-snug">{topAction}</p>
              )}
              <Link href="/dashboard/transactions"
                className="inline-block bg-[#0A0A0A] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-900 transition">
                Take action →
              </Link>
            </div>
          </div>

          {/* 4 Stat Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {loadingData ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)
            ) : [
              { label: 'Total Volume', value: txStats ? `$${txStats.totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '—' },
              { label: 'Transactions', value: txStats?.total?.toLocaleString() ?? '—' },
              { label: 'Disputes', value: txStats?.disputes?.toString() ?? '—' },
              { label: 'Avg Ticket', value: txStats ? `$${txStats.avgTicket.toFixed(2)}` : '—' },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-[#111111] rounded-xl px-4 py-3 shadow-sm border border-[#F3F4F6] dark:border-[#222222]">
                <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                <p className="font-bold text-[#0A0A0A] dark:text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Chargeback Rate Chart */}
          <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-[#0A0A0A] dark:text-white mb-4">Chargeback Rate Over Time</h2>
            {loadingData ? <Skeleton className="h-32" /> : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={chartData}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip
                    formatter={(v) => [`${v}%`, 'Rate']}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
                  />
                  <ReferenceLine y={1.0} stroke="#DC2626" strokeDasharray="4 4"
                    label={{ value: 'Visa 1.0%', fontSize: 10, fill: '#DC2626', position: 'insideTopRight' }} />
                  <ReferenceLine y={1.5} stroke="#EA580C" strokeDasharray="4 4"
                    label={{ value: 'MC 1.5%', fontSize: 10, fill: '#EA580C', position: 'insideTopRight' }} />
                  <Line type="monotone" dataKey="rate" stroke="#0A0A0A" strokeWidth={2} dot={{ r: 3, fill: '#0A0A0A' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                No historical data yet — complete your analysis to see trends
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-[#0A0A0A] dark:text-white mb-4">Recent Activity</h2>
            {loadingData ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-6" />)}</div>
            ) : alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map(a => (
                  <div key={a.id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${a.type === 'critical' ? 'bg-[#DC2626]' : a.type === 'warning' ? 'bg-[#D97706]' : 'bg-blue-400'}`} />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 leading-snug">{a.message}</span>
                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                      {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-2xl mb-2">✓</p>
                <p className="text-gray-400 text-sm">No recent alerts. Your account is clean.</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Chat Panel */}
        <div className="xl:w-[360px] xl:flex-shrink-0 h-[520px] xl:h-auto xl:min-h-[600px]">
          <ChatPanel merchant={merchant ?? null} />
        </div>
      </div>

      {/* EDR Panel */}
      <AnimatePresence>
        {showEDR && <EDRPanel onDismiss={dismissEDR} />}
      </AnimatePresence>
    </div>
  )
}
