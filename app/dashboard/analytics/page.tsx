'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Analytics } from '@/components/dashboard/Analytics'
import type { DashboardChartData } from '@/lib/server/types'
import { SAMPLE_CHART_DATA } from '@/lib/server/sample-data'

function buildEmptyTrend(days: number): { date: string; value: number }[] {
  const now = new Date()
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (days - 1 - i))
    return { date: d.toISOString().slice(0, 10), value: 0 }
  })
}

export default function AnalyticsPage() {
  const supabase = createClient()
  const [chartData, setChartData] = useState<DashboardChartData>(SAMPLE_CHART_DATA)
  const [loading, setLoading] = useState(true)
  const [isSample, setIsSample] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: merchant } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!merchant) { setIsSample(true); setLoading(false); return }

      const since = new Date(Date.now() - 90 * 86400000).toISOString()
      const { data: txs } = await supabase
        .from('transactions')
        .select('amount, disputed, refunded, blocked, created_at')
        .eq('merchant_id', merchant.id)
        .gte('created_at', since)
        .order('created_at', { ascending: true })

      if (!txs || txs.length === 0) {
        setIsSample(true)
        setLoading(false)
        return
      }

      // Group transactions by date
      const byDay: Record<string, { total: number; disputed: number; refunded: number; blocked: number; volume: number }> = {}

      for (const tx of txs) {
        const day = tx.created_at.slice(0, 10)
        if (!byDay[day]) byDay[day] = { total: 0, disputed: 0, refunded: 0, blocked: 0, volume: 0 }
        byDay[day].total++
        if (tx.disputed) byDay[day].disputed++
        if (tx.refunded) byDay[day].refunded++
        if (tx.blocked) byDay[day].blocked++
        byDay[day].volume += tx.amount || 0
      }

      // Build 90-day arrays, filling gaps with 0
      const now = new Date()
      const days90 = Array.from({ length: 90 }, (_, i) => {
        const d = new Date(now)
        d.setDate(d.getDate() - (89 - i))
        return d.toISOString().slice(0, 10)
      })

      const disputeRatioTrend = days90.map(date => {
        const d = byDay[date]
        const value = d && d.total > 0 ? parseFloat(((d.disputed / d.total) * 100).toFixed(4)) : 0
        return { date, value }
      })

      const authRateTrend = days90.map(date => {
        const d = byDay[date]
        const value = d && d.total > 0 ? parseFloat((((d.total - d.blocked) / d.total) * 100).toFixed(2)) : 100
        return { date, value }
      })

      const volumeTrend = days90.map(date => {
        const d = byDay[date]
        return { date, value: d ? parseFloat(d.volume.toFixed(2)) : 0 }
      })

      const refundRatioTrend = days90.map(date => {
        const d = byDay[date]
        const value = d && d.total > 0 ? parseFloat(((d.refunded / d.total) * 100).toFixed(2)) : 0
        return { date, value }
      })

      setChartData({ disputeRatioTrend, authRateTrend, volumeTrend, refundRatioTrend })
      setIsSample(false)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#111827]">Analytics</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-24" />
          ))}
        </div>
        {[1,2,3,4].map(i => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-64" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Analytics</h1>
          <p className="text-[#6B7280] text-sm mt-1">Dispute ratio, auth rate, volume, and refund trends across 7, 30, or 90 days.</p>
        </div>
        {isSample && (
          <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full font-medium">
            Sample data — connect a processor to see real charts
          </span>
        )}
      </div>
      <Analytics data={chartData} />
    </div>
  )
}
