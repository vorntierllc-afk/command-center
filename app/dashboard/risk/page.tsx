'use client'
import { useState } from 'react'

const FLAGGED = [
  { id: 'TX-88290', score: 91, signals: ['High-risk country', 'IP mismatch', 'Large amount'], action: 'Refund' },
  { id: 'TX-88284', score: 85, signals: ['Velocity spike', 'Disputed BIN'], action: 'Block' },
  { id: 'TX-88288', score: 78, signals: ['High-risk country', 'Large amount'], action: 'Review' },
  { id: 'TX-88286', score: 67, signals: ['Disputed'], action: 'Review' },
]

export default function RiskPage() {
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set())

  function confirm(id: string) {
    setConfirmed(s => new Set([...s, id]))
  }

  return (
    <div className="p-6 md:p-10 pb-24 md:pb-10">
      <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mb-6">Risk Monitor</h1>
      <div className="flex gap-3 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2">
          <span className="text-xs font-semibold text-red-700">High risk: {FLAGGED.filter(f => f.score >= 80).length}</span>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
          <span className="text-xs font-semibold text-amber-700">Disputed: 3</span>
        </div>
        <div className="bg-gray-50 border border-[#E5E7EB] rounded-xl px-4 py-2">
          <span className="text-xs font-semibold text-gray-600">Avg score: {Math.round(FLAGGED.reduce((a, f) => a + f.score, 0) / FLAGGED.length)}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F3F4F6]">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">TX ID</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Risk Score</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Signals</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {FLAGGED.map((f, i) => (
                <tr key={f.id} className={`border-b border-[#F9FAFB] hover:bg-gray-50 dark:hover:bg-[#1A1A1A] ${i === FLAGGED.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-6 py-4 font-mono text-xs text-[#0A0A0A] dark:text-white">{f.id}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold text-base ${f.score >= 80 ? 'text-[#DC2626]' : 'text-[#D97706]'}`}>{f.score}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {f.signals.map(s => (
                        <span key={s} className="text-xs bg-gray-100 text-gray-600 dark:bg-[#222222] dark:text-gray-400 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {confirmed.has(f.id) ? (
                      <span className="text-[#16A34A] text-sm font-semibold flex items-center gap-1">✓ Done</span>
                    ) : (
                      <button
                        onClick={() => confirm(f.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                          f.action === 'Refund' ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100' :
                          f.action === 'Block' ? 'bg-[#0A0A0A] text-white hover:bg-gray-900' :
                          'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {f.action}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
