'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

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

export default function DashboardPage() {
  const supabase = createClient()
  const [name, setName] = useState('there')
  const [hasSampleData] = useState(true)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setName(user.user_metadata?.full_name?.split(' ')[0] || 'there')
    })
    const hour = new Date().getHours()
    setGreeting(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening')
  }, [])

  const subtitle = GREETINGS[new Date().getDay() % GREETINGS.length]

  return (
    <div className="p-6 md:p-10 pb-24 md:pb-10">
      {/* Sample data banner */}
      {hasSampleData && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm">
          <span className="text-amber-800">📊 You&apos;re viewing sample data — Connect your processor to see your real risk profile.</span>
          <Link href="/onboarding" className="text-amber-900 font-semibold ml-4 hover:underline whitespace-nowrap">Complete setup →</Link>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0A0A0A] dark:text-white">{greeting}, {name}</h1>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-700">Live</span>
        </div>
      </div>

      {/* 3 metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Card 1: Chargeback Rate */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 border-t-4 border-[#DC2626]">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Chargeback Rate</p>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-4xl font-bold text-[#0A0A0A] dark:text-white">1.84%</span>
            <span className="text-sm text-red-500 mb-1">↑ 0.3%</span>
          </div>
          <p className="text-xs text-gray-400">Visa threshold: 1.0% · Mastercard: 1.5%</p>
        </div>

        {/* Card 2: MID Health */}
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

        {/* Card 3: Today's Action */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 border-t-4 border-[#0A0A0A]">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Today&apos;s Action</p>
          <p className="text-base font-semibold text-[#0A0A0A] dark:text-white mb-4 leading-snug">
            Refund TX-88290 — IP mismatch, risk 91/100
          </p>
          <Link href="/dashboard/transactions" className="inline-block bg-[#0A0A0A] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-900 transition">
            Take action →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Activity feed */}
        <div className="md:col-span-2 bg-white dark:bg-[#111111] rounded-2xl p-6">
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

        {/* Dispute probability */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-[#0A0A0A] dark:text-white mb-4">Dispute probability this week</h2>
          <div className="text-4xl font-bold text-[#DC2626] mb-3">34%</div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
            <div className="bg-[#DC2626] h-2 rounded-full" style={{ width: '34%' }} />
          </div>
          <p className="text-xs text-gray-400">Based on current velocity and BIN patterns</p>
        </div>
      </div>
    </div>
  )
}
