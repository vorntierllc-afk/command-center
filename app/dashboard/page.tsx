'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type TrendPoint = {
  label: string
  risk: number
}

type ActivityRow = {
  id: string
  created_at: string
  amount: number
  risk_score: number
  disputed: boolean
  refunded?: boolean
  status: string
  country?: string
}

type AlertRow = {
  id: string
  type: string
  message: string
  created_at: string
  read: boolean
}

type SummaryState = {
  riskScore: number
  chargebackRatio: number
  authorizationRate: number
  refundRate: number
}

function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function timeLabel(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

function MetricCard({
  title,
  value,
  detail,
}: {
  title: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">{title}</p>
      <p className="mt-3 text-[32px] font-semibold tracking-[-0.03em] text-[#111111]">{value}</p>
      <p className="mt-2 text-sm text-[#6B7280]">{detail}</p>
    </div>
  )
}

export default function DashboardPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<SummaryState>({
    riskScore: 58,
    chargebackRatio: 0.9,
    authorizationRate: 86.5,
    refundRate: 3.1,
  })
  const [trend, setTrend] = useState<TrendPoint[]>([])
  const [alerts, setAlerts] = useState<AlertRow[]>([])
  const [activity, setActivity] = useState<ActivityRow[]>([])

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data: merchant } = await supabase
        .from('merchants')
        .select('id, chargeback_rate')
        .eq('user_id', user.id)
        .single()

      const merchantId = merchant?.id
      const chargebackRatio = Number(merchant?.chargeback_rate || 0) * 100

      if (!merchantId) {
        setTrend([
          { label: 'Mar 18', risk: 51 },
          { label: 'Mar 25', risk: 49 },
          { label: 'Apr 1', risk: 54 },
          { label: 'Apr 8', risk: 57 },
          { label: 'Apr 15', risk: 58 },
        ])
        setAlerts([])
        setActivity([])
        setLoading(false)
        return
      }

      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

      const [{ data: txs }, { data: alertRows }] = await Promise.all([
        supabase
          .from('transactions')
          .select('id, created_at, amount, risk_score, disputed, refunded, status, country')
          .eq('merchant_id', merchantId)
          .gte('created_at', since)
          .order('created_at', { ascending: false }),
        supabase
          .from('alerts')
          .select('id, type, message, created_at, read')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(6),
      ])

      const transactionRows = (txs as ActivityRow[] | null) || []
      const total = transactionRows.length || 1
      const disputed = transactionRows.filter((tx) => tx.disputed).length
      const refunded = transactionRows.filter((tx) => tx.refunded).length
      const authorized = transactionRows.filter((tx) => tx.status !== 'blocked').length
      const averageRisk =
        transactionRows.length > 0
          ? transactionRows.reduce((sum, tx) => sum + (tx.risk_score || 0), 0) / transactionRows.length
          : 58

      setSummary({
        riskScore: Math.round(averageRisk),
        chargebackRatio: chargebackRatio || (disputed / total) * 100,
        authorizationRate: (authorized / total) * 100,
        refundRate: (refunded / total) * 100,
      })

      const grouped = new Map<string, { count: number; totalRisk: number }>()
      transactionRows
        .slice()
        .reverse()
        .forEach((tx) => {
          const label = timeLabel(tx.created_at)
          const current = grouped.get(label) || { count: 0, totalRisk: 0 }
          current.count += 1
          current.totalRisk += tx.risk_score || 0
          grouped.set(label, current)
        })

      const builtTrend = Array.from(grouped.entries())
        .slice(-5)
        .map(([label, point]) => ({
          label,
          risk: Math.round(point.totalRisk / Math.max(point.count, 1)),
        }))

      setTrend(
        builtTrend.length > 0
          ? builtTrend
          : [
              { label: 'Mar 18', risk: 51 },
              { label: 'Mar 25', risk: 49 },
              { label: 'Apr 1', risk: 54 },
              { label: 'Apr 8', risk: 57 },
              { label: 'Apr 15', risk: 58 },
            ]
      )
      setAlerts((alertRows as AlertRow[] | null) || [])
      setActivity(transactionRows.slice(0, 8))
      setLoading(false)
    }

    load()
  }, [supabase])

  const priorityAlerts = useMemo(
    () => alerts.filter((alert) => alert.type === 'critical' || !alert.read).slice(0, 4),
    [alerts]
  )

  return (
    <div className="space-y-6">
      <section className="rounded-[24px] border border-[#D9DDE3] bg-white px-6 py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Dashboard</p>
            <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#111111]">Merchant overview</h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              A denser operating view of account health, dispute pressure, and transaction activity.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] px-3 py-2 text-sm font-medium text-[#111111]">Last 30 days</span>
            <span className="rounded-xl bg-[#1E2A38] px-3 py-2 text-sm font-medium text-white">Live workspace</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        <MetricCard title="Risk score" value={loading ? '—' : String(summary.riskScore)} detail="Current account posture" />
        <MetricCard
          title="Chargeback ratio"
          value={loading ? '—' : formatPercent(summary.chargebackRatio, 2)}
          detail="Recent dispute share"
        />
        <MetricCard
          title="Authorization rate"
          value={loading ? '—' : formatPercent(summary.authorizationRate, 1)}
          detail="Approved transaction share"
        />
        <MetricCard title="Refund rate" value={loading ? '—' : formatPercent(summary.refundRate, 1)} detail="Recent refund volume" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_360px]">
        <div className="rounded-[24px] border border-[#D9DDE3] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#111111]">Risk trend</h3>
              <p className="mt-1 text-sm text-[#6B7280]">Average risk score across recent activity windows.</p>
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-[#6B7280]">Trend view</span>
          </div>

          <div className="mt-6 rounded-2xl border border-[#EEF0F3] bg-[#FCFCFD] p-4">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} width={38} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 1px 2px rgba(17,17,17,0.04)',
                    }}
                  />
                  <Line type="monotone" dataKey="risk" stroke="#1E2A38" strokeWidth={2.5} dot={{ r: 3.5, fill: '#1E2A38' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#D9DDE3] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#111111]">Alerts feed</h3>
              <p className="mt-1 text-sm text-[#6B7280]">Short list of issues that deserve follow-up.</p>
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-[#6B7280]">
              {(priorityAlerts.length || 1).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {(priorityAlerts.length > 0
              ? priorityAlerts
              : [
                  {
                    id: 'sample-1',
                    type: 'warning',
                    message: 'No live alerts yet. Connect merchant data to populate the feed.',
                    created_at: new Date().toISOString(),
                    read: false,
                  },
                ]
            ).map((alert) => {
              const color =
                alert.type === 'critical' ? '#DC2626' : alert.type === 'warning' ? '#F59E0B' : '#1E2A38'
              return (
                <div key={alert.id} className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">{alert.type}</p>
                      <p className="mt-1 text-sm leading-6 text-[#111111]">{alert.message}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#D9DDE3] bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#111111]">Recent activity</h3>
            <p className="mt-1 text-sm text-[#6B7280]">Latest transactions and review status in the workspace.</p>
          </div>
          <span className="rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] px-3 py-2 text-sm font-medium text-[#6B7280]">Latest 8 items</span>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-[#E5E7EB]">
          <table className="min-w-full border-collapse bg-white">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F7F7F8] text-left">
                {['Transaction', 'Date', 'Amount', 'Risk', 'Country', 'Status'].map((heading) => (
                  <th key={heading} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(activity.length > 0
                ? activity
                : [
                    {
                      id: 'sample-tx-01',
                      created_at: new Date().toISOString(),
                      amount: 1290,
                      risk_score: 58,
                      disputed: false,
                      status: 'review',
                      country: 'US',
                    },
                  ]
              ).map((row) => (
                <tr key={row.id} className="border-b border-[#F1F2F4] last:border-b-0">
                  <td className="px-4 py-3.5 text-sm font-medium text-[#111111]">{row.id.slice(0, 8)}</td>
                  <td className="px-4 py-3.5 text-sm text-[#6B7280]">{timeLabel(row.created_at)}</td>
                  <td className="px-4 py-3.5 text-sm text-[#111111]">{formatCurrency(row.amount || 0)}</td>
                  <td className="px-4 py-3.5 text-sm text-[#111111]">{row.risk_score || 0}</td>
                  <td className="px-4 py-3.5 text-sm text-[#6B7280]">{row.country || '—'}</td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-full border border-[#E5E7EB] bg-[#F7F7F8] px-2.5 py-1 text-xs font-medium text-[#111111]">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
