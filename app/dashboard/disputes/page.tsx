'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

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
  dispute_reason?: string
  processor?: string
}

interface Merchant {
  id: string
  chargeback_rate: number
  processor?: string
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    open: { label: 'Open', className: 'bg-blue-50 text-blue-600 border border-blue-100' },
    won: { label: 'Won', className: 'bg-green-50 text-[#10B981] border border-green-100' },
    lost: { label: 'Lost', className: 'bg-red-50 text-[#EF4444] border border-red-100' },
    fighting: { label: 'Needs Evidence', className: 'bg-amber-50 text-[#F59E0B] border border-amber-100' },
    refunded: { label: 'Refunded', className: 'bg-gray-100 text-[#6B7280] border border-gray-200' },
  }
  const s = map[status] || map['open']
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.className}`}>{s.label}</span>
}

function getDisputeStatus(d: Transaction): string {
  if (d.refunded) return 'refunded'
  if (d.status === 'won') return 'won'
  if (d.status === 'lost') return 'lost'
  if (d.status === 'fighting') return 'fighting'
  return 'open'
}

function daysLeft(createdAt: string): number {
  const elapsed = (Date.now() - new Date(createdAt).getTime()) / 86400000
  return Math.max(0, Math.round(120 - elapsed))
}

function generateAIResponse(tx: Transaction): string {
  const reason = tx.dispute_reason || (tx.risk_score >= 70 ? 'Fraudulent transaction' : 'Item not received')
  return `Dear Dispute Resolution Team,

We are writing to contest the chargeback filed for Transaction ID: ${tx.tx_id || tx.id.slice(0, 12)}, amount: $${tx.amount?.toFixed(2)} ${tx.currency || 'USD'}, dated ${new Date(tx.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.

Reason code: ${reason}

We have reviewed our records and wish to provide the following evidence in support of our merchant:

1. The transaction was completed successfully and the goods/services were delivered as described.
2. Our system shows a successful authorization and settlement for the full amount.
3. The customer's IP address and device fingerprint match their billing address, indicating no unauthorized use.
${tx.risk_score < 50 ? '4. This transaction scored LOW on our risk assessment system, indicating no fraud signals were detected.' : ''}

We respectfully request that this dispute be resolved in our favor. All supporting documentation is attached.

Merchant Reference: HRI-${tx.id.slice(0, 8).toUpperCase()}

Sincerely,
Dispute Resolution Team`
}

export default function DisputesPage() {
  const supabase = createClient()
  const [disputes, setDisputes] = useState<Transaction[]>([])
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'all' | 'open' | 'won' | 'lost' | 'fighting'>('all')
  const [selectedDispute, setSelectedDispute] = useState<Transaction | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: m } = await supabase.from('merchants').select('id, chargeback_rate, processor').eq('user_id', user.id).single()
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

  async function handleAccept(tx: Transaction) {
    setActionLoading(tx.id)
    await supabase.from('transactions').update({ status: 'lost' }).eq('id', tx.id)
    setDisputes(prev => prev.map(d => d.id === tx.id ? { ...d, status: 'lost' } : d))
    setActionLoading(null)
  }

  async function handleFight(tx: Transaction) {
    setActionLoading(tx.id)
    await supabase.from('transactions').update({ status: 'fighting' }).eq('id', tx.id)
    setDisputes(prev => prev.map(d => d.id === tx.id ? { ...d, status: 'fighting' } : d))
    setActionLoading(null)
    setSelectedDispute({ ...tx, status: 'fighting' })
  }

  function copyResponse(tx: Transaction) {
    navigator.clipboard.writeText(generateAIResponse(tx))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filtered = disputes.filter(d => {
    if (tab === 'all') return true
    return getDisputeStatus(d) === tab
  })

  const activeCount = disputes.filter(d => getDisputeStatus(d) === 'open').length
  const wonCount = disputes.filter(d => getDisputeStatus(d) === 'won').length
  const lostCount = disputes.filter(d => getDisputeStatus(d) === 'lost').length
  const winRate = (wonCount + lostCount) > 0 ? Math.round((wonCount / (wonCount + lostCount)) * 100) : 0
  const revenueAtRisk = disputes.filter(d => getDisputeStatus(d) === 'open').reduce((s, d) => s + d.amount, 0)
  const cbRate = merchant?.chargeback_rate ?? 0
  const showEDRUpsell = cbRate > 0.008

  const TABS: { key: typeof tab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'open', label: 'Open' },
    { key: 'won', label: 'Won' },
    { key: 'lost', label: 'Lost' },
    { key: 'fighting', label: 'Needs Evidence' },
  ]

  return (
    <div className="space-y-6">
      {/* EDR Upsell */}
      {showEDRUpsell && !loading && (
        <div className="bg-white border-l-4 border-[#F59E0B] rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex items-center gap-4">
          <span className="text-xl flex-shrink-0">⚡</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#111827]">Activate Early Dispute Detection</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Get alerted 24–72hrs before disputes become chargebacks</p>
          </div>
          <a href="/signup" className="text-xs bg-[#4F46E5] text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition font-medium flex-shrink-0">
            Activate $49/mo
          </a>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-[#111827]">Disputes</h1>
        {!loading && (
          <span className="text-sm bg-[#F3F4F6] text-[#6B7280] px-2.5 py-1 rounded-full font-medium">
            {disputes.length}
          </span>
        )}
      </div>

      {/* Stats strip */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Active', value: String(activeCount), color: 'text-blue-600' },
            { label: 'Won', value: String(wonCount), color: 'text-[#10B981]' },
            { label: 'Lost', value: String(lostCount), color: 'text-[#EF4444]' },
            { label: 'Win Rate', value: `${winRate}%`, color: 'text-[#4F46E5]' },
            { label: 'Revenue at Risk', value: `$${revenueAtRisk.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: 'text-[#111827]' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <p className="text-xs text-[#6B7280] mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t.key ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-4xl mb-4">🎉</p>
          <p className="text-[#6B7280] text-lg font-medium">No disputes found</p>
          {!merchant && (
            <>
              <p className="text-[#9CA3AF] text-sm mt-2 mb-6">Connect your processor to start monitoring disputes</p>
              <Link href="/onboarding" className="inline-block bg-[#4F46E5] text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-indigo-700 transition">
                Connect processor →
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  {['Dispute ID', 'Date', 'Customer', 'Amount', 'Reason', 'Processor', 'Days Left', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-[#6B7280] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {filtered.map(d => {
                  const days = daysLeft(d.created_at)
                  const status = getDisputeStatus(d)
                  const isActing = actionLoading === d.id
                  return (
                    <tr key={d.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-mono text-xs text-[#374151]">{d.tx_id || d.id.slice(0, 10)}</td>
                      <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">
                        {new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#374151] max-w-[140px] truncate">{d.email || '—'}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-[#111827] whitespace-nowrap">
                        ${d.amount?.toFixed(2)} <span className="text-[#9CA3AF] font-normal">{d.currency || 'USD'}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#6B7280]">{d.dispute_reason || 'Fraud'}</td>
                      <td className="px-4 py-3 text-xs text-[#6B7280]">{d.processor || merchant?.processor || '—'}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">
                        <span className={days < 5 ? 'text-[#EF4444] font-semibold' : 'text-[#374151]'}>{days}d</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={status} />
                      </td>
                      <td className="px-4 py-3">
                        {(status === 'open') && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => setSelectedDispute(d)}
                              disabled={isActing}
                              className="text-xs bg-[#4F46E5] text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-40">
                              Fight
                            </button>
                            <button
                              onClick={() => handleAccept(d)}
                              disabled={isActing}
                              className="text-xs border border-[#E5E7EB] text-[#6B7280] px-3 py-1.5 rounded-lg hover:bg-gray-50 transition disabled:opacity-40">
                              Accept
                            </button>
                          </div>
                        )}
                        {status === 'fighting' && (
                          <button onClick={() => setSelectedDispute(d)} className="text-xs text-[#4F46E5] underline">View response</button>
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

      {/* Side panel */}
      <AnimatePresence>
        {selectedDispute && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDispute(null)}
              className="fixed inset-0 bg-black/30 z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col border-l border-[#E5E7EB] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB] sticky top-0 bg-white">
                <div>
                  <h3 className="font-bold text-[#111827]">Dispute Details</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">{selectedDispute.tx_id || selectedDispute.id.slice(0, 12)}</p>
                </div>
                <button onClick={() => setSelectedDispute(null)} className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-gray-50 transition">✕</button>
              </div>

              <div className="p-6 space-y-5">
                {/* Details */}
                <div className="bg-[#F9FAFB] rounded-xl p-4 space-y-2">
                  {[
                    { label: 'Amount', value: `$${selectedDispute.amount?.toFixed(2)} ${selectedDispute.currency || 'USD'}` },
                    { label: 'Customer', value: selectedDispute.email || '—' },
                    { label: 'Country', value: selectedDispute.country || '—' },
                    { label: 'Risk Score', value: String(selectedDispute.risk_score) },
                    { label: 'Date', value: new Date(selectedDispute.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                    { label: 'Reason', value: selectedDispute.dispute_reason || 'Fraud' },
                    { label: 'Days Remaining', value: `${daysLeft(selectedDispute.created_at)} days` },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">{row.label}</span>
                      <span className="text-[#111827] font-medium">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* AI Response */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-[#111827]">AI-Generated Dispute Response</span>
                    <span className="text-xs bg-indigo-50 text-[#4F46E5] px-2 py-0.5 rounded-full">AI</span>
                  </div>
                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 text-xs text-[#374151] font-mono whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                    {generateAIResponse(selectedDispute)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => copyResponse(selectedDispute)}
                    className="flex-1 bg-[#4F46E5] text-white rounded-xl py-3 text-sm font-semibold hover:bg-indigo-700 transition">
                    {copied ? '✓ Copied!' : 'Copy Response'}
                  </button>
                  <button
                    onClick={() => handleFight(selectedDispute)}
                    className="flex-1 border border-[#E5E7EB] text-[#111827] rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 transition">
                    Submit Evidence
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
