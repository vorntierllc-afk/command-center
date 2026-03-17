'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Report {
  id: string
  week_label: string
  transactions_analyzed: number
  disputes_caught: number
  revenue_saved: number
  actions_taken: number
  chargeback_rate: number
  summary: string
  full_report: string
  created_at: string
}

interface Merchant {
  id: string
  ai_analysis: {
    summary?: string
    chargeback_rate?: number
    total_transactions?: number
    dispute_count?: number
    biggest_threat?: string
    recommended_actions?: string[]
  } | null
  chargeback_rate: number
  total_volume: number
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-gray-100 dark:bg-[#1A1A1A] rounded animate-pulse ${className}`} />
}

export default function ReportsPage() {
  const supabase = createClient()
  const [reports, setReports] = useState<Report[]>([])
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)

      const [{ data: m }, { data: r }] = await Promise.all([
        supabase.from('merchants').select('*').eq('user_id', user.id).single(),
        supabase.from('reports').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ])

      setMerchant(m as Merchant)
      setReports((r as Report[]) || [])
      setLoading(false)
    })
  }, [])

  async function generateReport() {
    if (!merchant || !userId) return
    setGenerating(true)

    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchant_id: merchant.id })
      })

      if (res.ok) {
        const json = await res.json()
        if (json.report) {
          setReports(prev => [json.report, ...prev])
        }
      } else {
        // Fallback: create a report from ai_analysis data
        const analysis = merchant.ai_analysis
        if (analysis) {
          const weekLabel = `Week of ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
          const newReport = {
            merchant_id: merchant.id,
            user_id: userId,
            week_label: weekLabel,
            transactions_analyzed: analysis.total_transactions || 0,
            disputes_caught: analysis.dispute_count || 0,
            revenue_saved: (analysis.dispute_count || 0) * (merchant.total_volume / Math.max(analysis.total_transactions || 1, 1)),
            actions_taken: analysis.recommended_actions?.length || 0,
            chargeback_rate: merchant.chargeback_rate || 0,
            summary: analysis.summary || 'Analysis complete.',
            full_report: JSON.stringify(analysis)
          }
          const { data: inserted } = await supabase.from('reports').insert(newReport).select().single()
          if (inserted) setReports(prev => [inserted as Report, ...prev])
        }
      }
    } catch (e) {
      console.error('Generate report error', e)
    }

    setGenerating(false)
  }

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white">Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">Weekly risk analysis and performance summaries</p>
        </div>
        <button
          onClick={generateReport}
          disabled={generating || !merchant}
          className="flex items-center gap-2 bg-[#0A0A0A] text-white text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-gray-900 transition disabled:opacity-40">
          {generating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            '+ Generate Report'
          )}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-4xl mb-4">▤</p>
          <p className="text-gray-400 text-lg font-medium mb-2">No reports yet.</p>
          {merchant?.ai_analysis ? (
            <>
              <p className="text-gray-400 text-sm mb-6">Generate your first report from your analysis data.</p>
              <button
                onClick={generateReport}
                disabled={generating}
                className="inline-block bg-[#0A0A0A] text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-40">
                {generating ? 'Generating...' : 'Generate first report →'}
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-6">Connect your processor or upload statements to generate your first report.</p>
              <a href="/onboarding" className="inline-block bg-[#0A0A0A] text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-gray-900 transition">
                Get started →
              </a>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((r, idx) => (
            <div key={r.id} className={`bg-white dark:bg-[#111111] rounded-2xl p-6 border shadow-sm ${idx === 0 ? 'border-[#0A0A0A]' : 'border-[#F3F4F6] dark:border-[#222222]'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  {idx === 0 && (
                    <span className="text-xs font-semibold text-[#0A0A0A] dark:text-white bg-gray-100 dark:bg-[#222222] px-2 py-0.5 rounded-full mb-2 inline-block">Latest</span>
                  )}
                  <h3 className="font-semibold text-[#0A0A0A] dark:text-white">{r.week_label}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(r.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  className="text-xs text-gray-400 hover:text-[#0A0A0A] dark:hover:text-white transition">
                  {expanded === r.id ? '▲ Less' : '▼ More'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-2xl font-bold text-[#0A0A0A] dark:text-white">{r.transactions_analyzed?.toLocaleString() || 0}</p>
                  <p className="text-xs text-gray-400">Transactions analyzed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#DC2626]">{r.disputes_caught || 0}</p>
                  <p className="text-xs text-gray-400">Disputes caught</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#16A34A]">
                    ${(r.revenue_saved || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-400">Revenue saved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0A0A0A] dark:text-white">
                    {r.chargeback_rate != null ? `${(r.chargeback_rate * 100).toFixed(2)}%` : '—'}
                  </p>
                  <p className="text-xs text-gray-400">Chargeback rate</p>
                </div>
              </div>

              {r.summary && (
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#1A1A1A] rounded-xl p-3 mb-4">
                  {r.summary}
                </p>
              )}

              {expanded === r.id && r.full_report && (
                <div className="mt-4 border-t border-[#F3F4F6] dark:border-[#222222] pt-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Full Report</p>
                  <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#1A1A1A] rounded-xl p-4 overflow-auto max-h-64 whitespace-pre-wrap">
                    {typeof r.full_report === 'string'
                      ? r.full_report
                      : JSON.stringify(r.full_report, null, 2)}
                  </pre>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <button className="text-xs font-semibold text-[#0A0A0A] dark:text-white border border-[#E5E7EB] dark:border-[#333333] px-4 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition">
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
