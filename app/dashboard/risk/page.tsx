'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Transaction {
  id: string
  tx_id: string
  amount: number
  currency: string
  country: string
  risk_score: number
  risk_signals: string[]
  disputed: boolean
  status: string
  created_at: string
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-gray-100 dark:bg-[#1A1A1A] rounded animate-pulse ${className}`} />
}

export default function RiskPage() {
  const supabase = createClient()
  const [flagged, setFlagged] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set())
  const [merchantId, setMerchantId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: m } = await supabase.from('merchants').select('id').eq('user_id', user.id).single()
      if (m) setMerchantId(m.id)
    })
  }, [])

  useEffect(() => {
    if (!merchantId) return
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('merchant_id', merchantId)
        .gte('risk_score', 50)
        .order('risk_score', { ascending: false })
        .limit(50)
      setFlagged((data as Transaction[]) || [])
      setLoading(false)
    }
    load()
  }, [merchantId])

  async function takeAction(tx: Transaction, action: string) {
    const updates: Record<string, unknown> = {}
    if (action === 'Refund') updates.refunded = true
    else if (action === 'Block') updates.blocked = true
    else if (action === 'Review') updates.status = 'review'

    await supabase.from('transactions').update(updates).eq('id', tx.id)
    setConfirmed(s => new Set([...s, tx.id]))
  }

  function getAction(score: number): string {
    if (score >= 80) return 'Refund'
    if (score >= 60) return 'Block'
    return 'Review'
  }

  const highRiskCount = flagged.filter(f => f.risk_score >= 80).length
  const disputedCount = flagged.filter(f => f.disputed).length
  const avgScore = flagged.length > 0
    ? Math.round(flagged.reduce((a, f) => a + f.risk_score, 0) / flagged.length)
    : 0

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white">Risk Monitor</h1>
          <p className="text-sm text-gray-500 mt-0.5">Transactions with risk score ≥ 50</p>
        </div>
      </div>

      {/* Stats Chips */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-9 w-28 rounded-xl" />)
        ) : (
          <>
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2">
              <span className="text-xs font-semibold text-red-700">High risk: {highRiskCount}</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
              <span className="text-xs font-semibold text-amber-700">Disputed: {disputedCount}</span>
            </div>
            <div className="bg-gray-50 border border-[#E5E7EB] rounded-xl px-4 py-2">
              <span className="text-xs font-semibold text-gray-600">Avg score: {avgScore}</span>
            </div>
            <div className="bg-gray-50 border border-[#E5E7EB] rounded-xl px-4 py-2">
              <span className="text-xs font-semibold text-gray-600">Flagged: {flagged.length}</span>
            </div>
          </>
        )}
      </div>

      {loading ? (
        <div className="bg-white dark:bg-[#111111] rounded-2xl overflow-hidden shadow-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-6 py-4 border-b border-[#F3F4F6] dark:border-[#222222]">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      ) : flagged.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-4xl mb-4">✓</p>
          <p className="text-gray-400 text-lg font-medium mb-2">No flagged transactions.</p>
          {merchantId ? (
            <p className="text-gray-400 text-sm">All transactions are within acceptable risk thresholds.</p>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-6">Connect your processor to start risk monitoring.</p>
              <Link href="/onboarding" className="inline-block bg-[#0A0A0A] text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-gray-900 transition">
                Connect processor →
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111111] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F3F4F6] dark:border-[#222222]">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">TX ID</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Risk Score</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Signals</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {flagged.map((f, i) => {
                  const action = getAction(f.risk_score)
                  const signals: string[] = Array.isArray(f.risk_signals) ? f.risk_signals : []
                  return (
                    <tr key={f.id} className={`border-b border-[#F9FAFB] dark:border-[#1A1A1A] hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition ${i === flagged.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="px-6 py-4 font-mono text-xs text-[#0A0A0A] dark:text-white">{f.tx_id || f.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">
                        <span className={`font-bold text-base ${f.risk_score >= 80 ? 'text-[#DC2626]' : 'text-[#D97706]'}`}>{f.risk_score}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#0A0A0A] dark:text-white">${f.amount?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {signals.length > 0 ? signals.map(s => (
                            <span key={s} className="text-xs bg-gray-100 text-gray-600 dark:bg-[#222222] dark:text-gray-400 px-2 py-0.5 rounded-full">{s}</span>
                          )) : (
                            <span className="text-xs text-gray-400">No signals</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        {confirmed.has(f.id) ? (
                          <span className="text-[#16A34A] text-sm font-semibold flex items-center gap-1">✓ Done</span>
                        ) : (
                          <button
                            onClick={() => takeAction(f, action)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                              action === 'Refund' ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100' :
                              action === 'Block' ? 'bg-[#0A0A0A] text-white hover:bg-gray-900' :
                              'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            }`}>
                            {action}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
