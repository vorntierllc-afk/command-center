'use client'
import { useState } from 'react'

const TRANSACTIONS = [
  { id: 'TX-88290', amount: 149.99, country: 'NG', risk: 91, status: 'flagged' },
  { id: 'TX-88289', amount: 67.50, country: 'US', risk: 22, status: 'approved' },
  { id: 'TX-88288', amount: 299.00, country: 'RU', risk: 78, status: 'review' },
  { id: 'TX-88287', amount: 89.99, country: 'US', risk: 15, status: 'approved' },
  { id: 'TX-88286', amount: 450.00, country: 'CN', risk: 67, status: 'review' },
  { id: 'TX-88285', amount: 25.00, country: 'GB', risk: 8, status: 'approved' },
  { id: 'TX-88284', amount: 1200.00, country: 'BR', risk: 85, status: 'flagged' },
  { id: 'TX-88283', amount: 55.99, country: 'CA', risk: 18, status: 'approved' },
]

function RiskPill({ score }: { score: number }) {
  const cls = score >= 80 ? 'bg-red-100 text-red-700' : score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{score}</span>
}

export default function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = TRANSACTIONS.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) || t.country.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'high' && t.risk >= 80) || (filter === 'medium' && t.risk >= 50 && t.risk < 80) || (filter === 'low' && t.risk < 50)
    return matchSearch && matchFilter
  })

  return (
    <div className="p-6 md:p-10 pb-24 md:pb-10">
      <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mb-6">Transactions</h1>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0A0A0A] flex-1"
        />
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition capitalize ${filter === f ? 'bg-[#0A0A0A] text-white' : 'bg-white border border-[#E5E7EB] text-gray-600 hover:border-[#0A0A0A]'}`}
            >
              {f === 'all' ? 'All' : f === 'high' ? 'High risk' : f === 'medium' ? 'Medium' : 'Low risk'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-lg mb-2">No transactions synced yet.</p>
          <p className="text-gray-400 text-sm mb-6">Connect your processor to start monitoring.</p>
          <a href="/onboarding" className="inline-block bg-[#0A0A0A] text-white rounded-full px-6 py-3 text-sm font-semibold">Connect processor →</a>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111111] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F3F4F6]">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Transaction ID</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Country</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Risk</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id} className={`border-b border-[#F9FAFB] hover:bg-gray-50 dark:hover:bg-[#1A1A1A] ${i === filtered.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-6 py-4 font-mono text-xs text-[#0A0A0A] dark:text-white">{t.id}</td>
                    <td className="px-6 py-4 font-semibold text-[#0A0A0A] dark:text-white">${t.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{t.country}</td>
                    <td className="px-6 py-4"><RiskPill score={t.risk} /></td>
                    <td className="px-6 py-4">
                      {t.risk >= 80 ? (
                        <button className="text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full hover:bg-red-100 transition font-medium">Refund</button>
                      ) : t.risk >= 50 ? (
                        <button className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full hover:bg-amber-100 transition font-medium">Review</button>
                      ) : (
                        <button className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-100 transition font-medium">Approve</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
