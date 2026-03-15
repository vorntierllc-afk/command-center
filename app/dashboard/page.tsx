'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const ACTIVITY = [
  { color: 'red', message: 'Chargeback probability rising — NG cluster', time: '2m ago' },
  { color: 'amber', message: 'BIN mismatch detected — 501234 series', time: '18m ago' },
  { color: 'green', message: 'Weekly report generated', time: '1hr ago' },
  { color: 'amber', message: 'High-value transaction flagged — TX-88288', time: '2hr ago' },
]

const GREETINGS = [
  "Here's your risk summary for today.",
  '3 transactions need your attention.',
  'Your chargeback rate dropped 0.2% this week.',
]

type AiAnalysis = {
  summary?: string
  chargeback_rate?: number
  total_volume?: number
  dispute_count?: number
  recommended_actions?: string[]
  top_risk_factors?: string[]
}

type ChatMessage = { role: 'user' | 'assistant'; text: string }

// ── EDR Upsell Panel ──────────────────────────────────────────────────────────
function EDRPanel({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 260 }}
      className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col border-l border-[#E5E7EB]"
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-bold text-[#0A0A0A] text-lg">Protect your MID</h3>
            <p className="text-xs text-[#DC2626] font-semibold mt-1">Chargeback rate above threshold</p>
          </div>
          <button onClick={onDismiss} className="text-gray-300 hover:text-gray-500 transition text-xl leading-none">✕</button>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Get alerted the moment a dispute is filed — before it becomes a chargeback. Our Early Detection network covers Visa and Mastercard globally.
        </p>

        <div className="space-y-3 mb-8">
          {[
            'Real-time dispute alerts',
            '24–72hr response window',
            'Covers Visa + Mastercard',
          ].map(item => (
            <div key={item} className="flex items-center gap-3">
              <span className="text-[#16A34A] font-bold flex-shrink-0">✓</span>
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <button className="w-full bg-[#0A0A0A] text-white rounded-full py-3 text-sm font-semibold hover:bg-gray-900 transition mb-3">
            Activate dispute protection — $49/mo
          </button>
          <button onClick={onDismiss} className="w-full text-xs text-gray-400 hover:text-gray-600 transition py-1">
            Dismiss for 24 hours
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── HRI Analyst Chat Panel ────────────────────────────────────────────────────
function ChatPanel({ aiAnalysis }: { aiAnalysis: AiAnalysis | null }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Show the AI summary as first message
    if (aiAnalysis?.summary) {
      setMessages([{ role: 'assistant', text: aiAnalysis.summary }])
    } else {
      setMessages([{
        role: 'assistant',
        text: "Hello! I'm your HRI Analyst. Connect your processor or upload statements to get your personalized risk analysis. In the meantime, ask me anything about payment risk.",
      }])
    }
  }, [aiAnalysis])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', text: data.reply || 'Unable to respond.' }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: 'Connection error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#F3F4F6]">
        <div className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse" />
        <span className="text-sm font-semibold text-[#0A0A0A]">HRI Analyst</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#0A0A0A] text-white rounded-br-sm'
                : 'bg-gray-50 text-gray-800 rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2 p-3 border-t border-[#F3F4F6]">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about your risk..."
          className="flex-1 bg-gray-50 border border-[#E5E7EB] rounded-full px-4 py-2 text-sm outline-none focus:border-[#0A0A0A] transition"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-[#0A0A0A] text-white rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-40 hover:bg-gray-900 transition"
        >
          →
        </button>
      </form>
    </div>
  )
}

// ── Main Dashboard Page ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const supabase = createClient()
  const [name, setName] = useState('there')
  const [hasSampleData, setHasSampleData] = useState(true)
  const [greeting, setGreeting] = useState('')
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null)
  const [showEDR, setShowEDR] = useState(false)

  useEffect(() => {
    const hour = new Date().getHours()
    setGreeting(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening')

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setName(user.user_metadata?.full_name?.split(' ')[0] || 'there')

      // Load merchant data — column names match Prisma camelCase schema
      const { data: merchant } = await supabase
        .from('Merchant')
        .select('aiAnalysis, processingStatus')
        .eq('userId', user.id)
        .single()

      if (merchant) {
        if (merchant.processingStatus === 'complete') setHasSampleData(false)

        if (merchant.aiAnalysis) {
          const analysis = merchant.aiAnalysis as AiAnalysis
          setAiAnalysis(analysis)

          // Show EDR panel if chargeback rate > 0.8%
          const rate = analysis.chargeback_rate ?? 0
          if (rate > 0.008) {
            // EDR dismissed state stored in localStorage (no schema change needed)
            const dismissedAt = localStorage.getItem('edr_dismissed_at')
            const dismissed = dismissedAt && (Date.now() - Number(dismissedAt) < 24 * 60 * 60 * 1000)
            if (!dismissed) setShowEDR(true)
          }
        }
      }
    })
  }, [])

  function dismissEDR() {
    setShowEDR(false)
    localStorage.setItem('edr_dismissed_at', String(Date.now()))
  }

  const chargebackRate = aiAnalysis?.chargeback_rate
    ? `${(aiAnalysis.chargeback_rate * 100).toFixed(2)}%`
    : '1.84%'

  const chargebackHigh = (aiAnalysis?.chargeback_rate ?? 0.0184) > 0.01

  const subtitle = GREETINGS[new Date().getDay() % GREETINGS.length]

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-8">
      {/* Sample data banner */}
      {hasSampleData && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm">
          <span className="text-amber-800">📊 You&apos;re viewing sample data — Connect your processor to see your real risk profile.</span>
          <Link href="/onboarding" className="text-amber-900 font-semibold ml-4 hover:underline whitespace-nowrap">Complete setup →</Link>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0A0A0A] dark:text-white">{greeting}, {name}</h1>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-700">Live</span>
        </div>
      </div>

      {/* Main layout: left 60% metrics, right 40% chat */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: metrics + activity */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* 3 metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`bg-white dark:bg-[#111111] rounded-2xl p-6 border-t-4 ${chargebackHigh ? 'border-[#DC2626]' : 'border-[#16A34A]'}`}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Chargeback Rate</p>
              <div className="flex items-end gap-2 mb-1">
                <span className={`text-4xl font-bold ${chargebackHigh ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>{chargebackRate}</span>
                <span className={`text-sm mb-1 ${chargebackHigh ? 'text-red-500' : 'text-green-500'}`}>{chargebackHigh ? '↑' : '↓'}</span>
              </div>
              <p className="text-xs text-gray-400">Visa threshold: 1.0% · Mastercard: 1.5%</p>
            </div>

            <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 border-t-4 border-[#D97706]">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">MID Health Score</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-[#0A0A0A] dark:text-white">62</span>
                <span className="text-sm text-gray-400 mb-1">/100</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                <div className="bg-[#D97706] h-1.5 rounded-full" style={{ width: '62%' }} />
              </div>
              <p className="text-xs text-gray-400">Moderate — action advisory active</p>
            </div>

            <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 border-t-4 border-[#0A0A0A]">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Today&apos;s Action</p>
              <p className="text-sm font-semibold text-[#0A0A0A] dark:text-white mb-4 leading-snug">
                {aiAnalysis?.recommended_actions?.[0] ?? 'Refund TX-88290 — IP mismatch, risk 91/100'}
              </p>
              <Link href="/dashboard/transactions" className="inline-block bg-[#0A0A0A] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-900 transition">
                Take action →
              </Link>
            </div>
          </div>

          {/* Activity + dispute probability */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 bg-white dark:bg-[#111111] rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-[#0A0A0A] dark:text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.color === 'red' ? 'bg-[#DC2626]' : a.color === 'amber' ? 'bg-[#D97706]' : 'bg-[#16A34A]'}`} />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{a.message}</span>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#111111] rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-[#0A0A0A] dark:text-white mb-4">Dispute probability</h2>
              <div className="text-4xl font-bold text-[#DC2626] mb-3">34%</div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                <div className="bg-[#DC2626] h-2 rounded-full" style={{ width: '34%' }} />
              </div>
              <p className="text-xs text-gray-400">Based on current velocity and BIN patterns</p>
            </div>
          </div>

          {/* Top risk factors from AI analysis */}
          {aiAnalysis?.top_risk_factors && aiAnalysis.top_risk_factors.length > 0 && (
            <div className="bg-white dark:bg-[#111111] rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-[#0A0A0A] dark:text-white mb-4">Risk Factors Identified</h2>
              <div className="flex flex-wrap gap-2">
                {aiAnalysis.top_risk_factors.map((factor, i) => (
                  <span key={i} className="text-xs bg-red-50 text-red-700 border border-red-100 px-3 py-1.5 rounded-full">{factor}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: HRI Analyst chat (40% on large screens) */}
        <div className="lg:w-[380px] lg:flex-shrink-0 h-[500px] lg:h-auto lg:min-h-[500px]">
          <ChatPanel aiAnalysis={aiAnalysis} />
        </div>
      </div>

      {/* EDR slide-in panel */}
      <AnimatePresence>
        {showEDR && <EDRPanel onDismiss={dismissEDR} />}
      </AnimatePresence>
    </div>
  )
}
