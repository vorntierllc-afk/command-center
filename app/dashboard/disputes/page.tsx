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
  refunded: boolean
  blocked: boolean
  status: string
  email: string
  created_at: string
}

interface Merchant {
  id: string
  chargeback_rate: number
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-gray-100 dark:bg-[#1A1A1A] rounded animate-pulse ${className}`} />
}

export default function DisputesPage() {
  const supabase = createClient()
  const [disputes, setDisputes] = useState<Transaction[]>([])
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [resolved, setResolved] = useState<Set<string>>(new Set())

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: m } = await supabase
        .from('merchants')
        .select('id, chargeback_rate')
        .eq('user_id', user.id)
        .single()
      if (!m) { setLoading(false); return }
      setMerchant(m as Merchant)

      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('merchant_id', m.id)
        .eq('disputed', true)
        .order('created_at', { ascending: false })

      setDisputes((data as Transaction[]) || [])
      setLoading(false)
    })
  }, [])

  async function handleRefund(tx: Transaction) {
    setActionLoading(tx.id)
    await supabase.from('transactions').update({ refunded: true }).eq('id', tx.id)
    setResolved(s => new Set([...s, tx.id]))
    setActionLoading(null)
  }

  async function handleFight(tx: Transaction) {
    setActionLoading(tx.id)
    await supabase.from('transactions').update({ status: 'fighting' }).eq('id', tx.id)
    setResolved(s => new Set([...s, tx.id]))
    setActionLoading(null)
  }

  const totalDisputes = disputes.length
  const refundedCount = disputes.filter(d => d.refunded).length
  const openCount = disputes.filter(d => !d.refunded && d.status !== 'fighting').length
  const fightingCount = disputes.filter(d => d.status === 'fighting').length
  const revenueAtRisk = disputes
    .filter(d => !d.refunded)
    .reduce((s, d) => s + (d.amount || 0), 0)
  const winRate = totalDisputes > 0 ? Math.round((refundedCount / totalDisputes) * 100) : 0

  const chargebackRate = merchant?.chargeback_rate ?? 0
  const showEDRUpsell = chargebackRate > 0.008

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white">Disputes</h1>
        <p className="text-sm text-gray-500 mt-0.5">Transactions marked as disputed</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
        ) : (
          <>
            <div className="bg-white dark:bg-[#111111] rounded-xl p-4 shadow-sm border border-[#F3F4F6] dark:border-[#222222]">
              <p className="text-xs text-gray-400 mb-1">Total Disputes</p>
              <p className="text-2xl font-bold text-[#0A0A0A] dark:text-white">{totalDisputes}</p>
            </div>
            <div className="bg-white dark:bg-[#111111] rounded-xl p-4 shadow-sm border border-[#F3F4F6] dark:border-[#222222]">
              <p className="text-xs text-gray-400 mb-1">Open</p>
              <p className="text-2xl font-bold text-[#DC2626]">{openCount}</p>
            </div>
            <div className="bg-white dark:bg-[#111111] rounded-xl p-4 shadow-sm border border-[#F3F4F6] dark:border-[#222222]">
              <p className="text-xs text-gray-400 mb-1">Fighting</p>
              <p className="text-2xl font-bold text-[#D97706]">{fightingCount}</p>
            </div>
            <div className="bg-white dark:bg-[#111111] rounded-xl p-4 shadow-sm border border-[#F3F4F6] dark:border-[#222222]">
              <p className="text-xs text-gray-400 mb-1">Revenue at Risk</p>
              <p className="text-2xl font-bold text-[#0A0A0A] dark:text-white">${revenueAtRisk.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="bg-white dark:bg-[#111111] rounded-xl p-4 shadow-sm border border-[#F3F4F6] dark:border-[#222222]">
              <p className="text-xs text-gray-400 mb-1">Resolution Rate</p>
              <p className="text-2xl font-bold text-[#16A34A]">{winRate}%</p>
            </div>
          </>
        )}
      </div>

      {/* Disputes List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : disputes.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-4xl mb-4">🛡</p>
          <p className="text-gray-400 text-lg font-medium mb-2">No disputes found.</p>
          {!merchant ? (
            <>
              <p className="text-gray-400 text-sm mb-6">Connect your processor to start monitoring disputes.</p>
              <Link href="/onboarding" className="inline-block bg-[#0A0A0A] text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-gray-900 transition">
                Connect processor →
              </Link>
            </>
          ) : (
            <p className="text-gray-400 text-sm">No disputed transactions in your account. Keep it up.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {disputes.map(d => {
            const isResolved = resolved.has(d.id) || d.refunded || d.status === 'fighting'
            const signals: string[] = Array.isArray(d.risk_signals) ? d.risk_signals : []
            const recommendation = d.risk_score >= 70
              ? 'High risk — consider issuing refund to avoid chargeback escalation'
              : d.amount > 500
                ? 'High value — gather evidence and fight this dispute'
                : 'Review transaction details before deciding'

            return (
              <div key={d.id} className="bg-white dark:bg-[#111111] rounded-2xl p-5 shadow-sm border border-[#F3F4F6] dark:border-[#222222]">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-semibold text-[#0A0A0A] dark:text-white">
                        {d.tx_id || d.id.slice(0, 12)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        d.refunded ? 'bg-gray-100 text-gray-600' :
                        d.status === 'fighting' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {d.refunded ? 'Refunded' : d.status === 'fighting' ? 'Fighting' : 'Open'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        d.risk_score >= 80 ? 'bg-red-50 text-red-600' :
                        d.risk_score >= 50 ? 'bg-amber-50 text-amber-600' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        Risk: {d.risk_score}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm mb-3">
                      <span className="text-[#0A0A0A] dark:text-white font-semibold">${d.amount?.toFixed(2)} {d.currency}</span>
                      {d.country && <span className="text-gray-500">Country: {d.country}</span>}
                      {d.email && <span className="text-gray-500 truncate max-w-[200px]">{d.email}</span>}
                      <span className="text-gray-400 text-xs">
                        {new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    {signals.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {signals.map(s => (
                          <span key={s} className="text-xs bg-gray-100 dark:bg-[#222222] text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg px-3 py-2">
                      <span className="font-semibold text-[#0A0A0A] dark:text-white">Recommendation: </span>
                      {recommendation}
                    </p>
                  </div>

                  {!isResolved && (
                    <div className="flex sm:flex-col gap-2 sm:min-w-[110px]">
                      <button
                        onClick={() => handleRefund(d)}
                        disabled={actionLoading === d.id}
                        className="flex-1 sm:flex-none bg-[#0A0A0A] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-900 transition disabled:opacity-40">
                        Refund
                      </button>
                      <button
                        onClick={() => handleFight(d)}
                        disabled={actionLoading === d.id}
                        className="flex-1 sm:flex-none border border-[#E5E7EB] text-[#0A0A0A] dark:text-white text-xs font-semibold px-4 py-2 rounded-full hover:border-[#0A0A0A] transition disabled:opacity-40">
                        Fight it
                      </button>
                    </div>
                  )}
                  {isResolved && (
                    <span className="text-[#16A34A] text-sm font-semibold flex items-center gap-1 flex-shrink-0">✓ Resolved</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* EDR Upsell */}
      {showEDRUpsell && !loading && (
        <div className="mt-8 bg-[#0A0A0A] rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <span className="text-2xl flex-shrink-0">🛡️</span>
            <div className="flex-1">
              <h3 className="font-bold mb-1">Stop disputes before they become chargebacks</h3>
              <p className="text-gray-400 text-sm mb-4">
                Your chargeback rate is {(chargebackRate * 100).toFixed(2)}%. With Early Dispute Resolution, you get alerted within minutes of a dispute filing — giving you 24–72 hours to respond before it escalates.
              </p>
              <button className="bg-white text-[#0A0A0A] text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-100 transition">
                Activate dispute protection — $49/mo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
