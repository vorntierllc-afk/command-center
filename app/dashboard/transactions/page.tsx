'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Transaction {
  id: string
  tx_id: string
  amount: number
  currency: string
  country: string
  status: string
  risk_score: number
  risk_signals: string[]
  disputed: boolean
  refunded: boolean
  blocked: boolean
  email: string
  created_at: string
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-gray-100 dark:bg-[#1A1A1A] rounded animate-pulse ${className}`} />
}

function RiskPill({ score }: { score: number }) {
  const cls = score >= 80
    ? 'bg-red-100 text-red-700'
    : score >= 50
      ? 'bg-amber-100 text-amber-700'
      : 'bg-green-100 text-green-700'
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{score}</span>
}

const PAGE_SIZE = 25

const HIGH_RISK_COUNTRIES = ['NG', 'RU', 'UA', 'BY', 'IR', 'KP', 'SY', 'VE']

interface AddTxForm {
  amount: string
  country: string
  email: string
  disputed: boolean
  card_network: string
  description: string
  currency: string
}

const EMPTY_FORM: AddTxForm = {
  amount: '',
  country: 'US',
  email: '',
  disputed: false,
  card_network: '',
  description: '',
  currency: 'USD',
}

export default function TransactionsPage() {
  const supabase = createClient()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [merchantId, setMerchantId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmModal, setConfirmModal] = useState<{ txId: string; action: string } | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState<AddTxForm>(EMPTY_FORM)
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: m } = await supabase.from('merchants').select('id').eq('user_id', user.id).single()
      if (m) setMerchantId(m.id)
    })
  }, [])

  const fetchTransactions = useCallback(async () => {
    if (!merchantId) return
    setLoading(true)
    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (filter === 'high') query = query.gte('risk_score', 80)
    else if (filter === 'medium') query = query.gte('risk_score', 50).lt('risk_score', 80)
    else if (filter === 'low') query = query.lt('risk_score', 50)
    else if (filter === 'disputed') query = query.eq('disputed', true)

    const { data, count } = await query
    setTransactions((data as Transaction[]) || [])
    setTotal(count || 0)
    setLoading(false)
  }, [merchantId, page, filter])

  useEffect(() => {
    if (merchantId) fetchTransactions()
  }, [merchantId, fetchTransactions])

  const filtered = transactions.filter(t => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      t.tx_id?.toLowerCase().includes(s) ||
      t.country?.toLowerCase().includes(s) ||
      String(t.amount).includes(s) ||
      t.email?.toLowerCase().includes(s)
    )
  })

  async function addTransaction(e: React.FormEvent) {
    e.preventDefault()
    if (!addForm.amount || Number(addForm.amount) <= 0) {
      setAddError('Amount must be greater than 0')
      return
    }
    setAddLoading(true)
    setAddError('')
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(addForm.amount),
          country: addForm.country,
          email: addForm.email,
          disputed: addForm.disputed,
          card_network: addForm.card_network,
          description: addForm.description,
          currency: addForm.currency,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add transaction')
      setShowAddModal(false)
      setAddForm(EMPTY_FORM)
      if (merchantId) fetchTransactions()
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add transaction')
    } finally {
      setAddLoading(false)
    }
  }

  async function executeAction(txId: string, action: string) {
    setActionLoading(txId)
    const updates: Partial<Transaction> = {}
    if (action === 'refund') updates.refunded = true
    else if (action === 'block') updates.blocked = true
    else if (action === 'review') updates.status = 'review'

    await supabase.from('transactions').update(updates).eq('id', txId)
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, ...updates } : t))
    setActionLoading(null)
    setConfirmModal(null)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white">Transactions</h1>
          {!loading && <p className="text-sm text-gray-500 mt-0.5">{total.toLocaleString()} total transactions</p>}
        </div>
        <button
          onClick={() => { setShowAddModal(true); setAddError('') }}
          className="bg-[#4F46E5] text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
        >
          + Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by ID, country, email, amount..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0A0A0A] flex-1 dark:bg-[#111111] dark:border-[#333333] dark:text-white"
        />
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: 'All' },
            { key: 'high', label: 'High risk' },
            { key: 'medium', label: 'Medium' },
            { key: 'low', label: 'Low risk' },
            { key: 'disputed', label: 'Disputed' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setPage(0) }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                filter === f.key ? 'bg-[#0A0A0A] text-white' : 'bg-white border border-[#E5E7EB] text-gray-600 hover:border-[#0A0A0A] dark:bg-[#111111] dark:border-[#333333] dark:text-gray-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-[#111111] rounded-2xl overflow-hidden shadow-sm">
          <div className="space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex gap-4 px-6 py-4 border-b border-[#F3F4F6] dark:border-[#222222]">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-lg mb-2">No transactions found.</p>
          {total === 0 ? (
            <>
              <p className="text-gray-400 text-sm mb-6">Connect your processor to start monitoring transactions.</p>
              <Link href="/onboarding" className="inline-block bg-[#0A0A0A] text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-gray-900 transition">
                Connect processor →
              </Link>
            </>
          ) : (
            <p className="text-gray-400 text-sm">Try adjusting your search or filters.</p>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111111] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F3F4F6] dark:border-[#222222]">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">TX ID</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Country</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Risk</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id} className={`border-b border-[#F9FAFB] dark:border-[#1A1A1A] hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition ${i === filtered.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-6 py-4 font-mono text-xs text-[#0A0A0A] dark:text-white">{t.tx_id || t.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 font-semibold text-[#0A0A0A] dark:text-white">
                      ${t.amount?.toFixed(2)} {t.currency && <span className="text-gray-400 font-normal text-xs">{t.currency}</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{t.country || '—'}</td>
                    <td className="px-6 py-4"><RiskPill score={t.risk_score ?? 0} /></td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        t.blocked ? 'bg-red-100 text-red-700' :
                        t.refunded ? 'bg-gray-100 text-gray-600' :
                        t.disputed ? 'bg-amber-100 text-amber-700' :
                        t.status === 'review' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {t.blocked ? 'Blocked' : t.refunded ? 'Refunded' : t.disputed ? 'Disputed' : t.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      {t.refunded || t.blocked ? (
                        <span className="text-xs text-[#16A34A] font-medium">✓ Done</span>
                      ) : actionLoading === t.id ? (
                        <div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                      ) : t.risk_score >= 80 ? (
                        <button
                          onClick={() => setConfirmModal({ txId: t.id, action: 'refund' })}
                          className="text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full hover:bg-red-100 transition font-medium">
                          Refund
                        </button>
                      ) : t.risk_score >= 50 ? (
                        <button
                          onClick={() => setConfirmModal({ txId: t.id, action: 'review' })}
                          className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full hover:bg-amber-100 transition font-medium">
                          Review
                        </button>
                      ) : (
                        <span className="text-xs text-[#16A34A] font-medium">✓ Clean</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#F3F4F6] dark:border-[#222222]">
              <p className="text-xs text-gray-400">
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg disabled:opacity-40 hover:border-[#0A0A0A] transition">
                  ← Prev
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg disabled:opacity-40 hover:border-[#0A0A0A] transition">
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#0A0A0A] text-lg">Add Transaction</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-[#0A0A0A] text-xl">×</button>
            </div>
            <form onSubmit={addTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Amount *</label>
                  <input
                    type="number" step="0.01" min="0.01" placeholder="0.00"
                    value={addForm.amount}
                    onChange={e => setAddForm(f => ({ ...f, amount: e.target.value }))}
                    className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Currency</label>
                  <select
                    value={addForm.currency}
                    onChange={e => setAddForm(f => ({ ...f, currency: e.target.value }))}
                    className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]"
                  >
                    {['USD', 'EUR', 'GBP', 'CAD', 'AUD'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Customer Email</label>
                <input
                  type="email" placeholder="customer@example.com"
                  value={addForm.email}
                  onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Country (ISO)</label>
                  <input
                    type="text" placeholder="US" maxLength={2}
                    value={addForm.country}
                    onChange={e => setAddForm(f => ({ ...f, country: e.target.value.toUpperCase() }))}
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] uppercase ${
                      HIGH_RISK_COUNTRIES.includes(addForm.country) ? 'border-red-400 bg-red-50' : 'border-[#E5E7EB]'
                    }`}
                  />
                  {HIGH_RISK_COUNTRIES.includes(addForm.country) && (
                    <p className="text-xs text-red-500 mt-1">⚠ High-risk country</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Card Network</label>
                  <select
                    value={addForm.card_network}
                    onChange={e => setAddForm(f => ({ ...f, card_network: e.target.value }))}
                    className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]"
                  >
                    <option value="">Unknown</option>
                    {['Visa', 'Mastercard', 'Amex', 'Discover'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Description (optional)</label>
                <input
                  type="text" placeholder="Product/service description"
                  value={addForm.description}
                  onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setAddForm(f => ({ ...f, disputed: !f.disputed }))}
                  className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${addForm.disputed ? 'bg-red-500' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${addForm.disputed ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm text-gray-700">Mark as <strong>Disputed / Chargeback</strong></span>
              </label>
              {addError && <p className="text-red-500 text-xs">{addError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-[#E5E7EB] rounded-full py-2.5 text-sm font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={addLoading}
                  className="flex-1 bg-[#4F46E5] text-white rounded-full py-2.5 text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
                  {addLoading ? 'Saving...' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-[#0A0A0A] dark:text-white mb-2 capitalize">
              Confirm {confirmModal.action}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {confirmModal.action === 'refund'
                ? 'Are you sure you want to mark this transaction as refunded? This action will be logged.'
                : 'Mark this transaction for manual review?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 border border-[#E5E7EB] rounded-full py-2.5 text-sm font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                onClick={() => executeAction(confirmModal.txId, confirmModal.action)}
                className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${
                  confirmModal.action === 'refund' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#0A0A0A] text-white hover:bg-gray-900'
                }`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
