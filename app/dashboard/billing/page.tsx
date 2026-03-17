'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
}

interface BillingRecord {
  id: string
  description: string
  amount: number
  status: string
  created_at: string
}

interface Plan {
  name: string
  price: number
  description: string
  features: string[]
  highlighted?: boolean
  priceId?: string
}

const PLANS: Plan[] = [
  {
    name: 'Basic',
    price: 30,
    description: 'For small merchants',
    features: [
      'Up to 1,000 transactions/mo',
      'Risk scoring & alerts',
      'Basic dispute management',
      'Email support',
    ],
    priceId: 'price_basic'
  },
  {
    name: 'Pro',
    price: 50,
    description: 'Most popular for growing businesses',
    features: [
      'Unlimited transactions',
      'AI dispute response generator',
      'Early Dispute Detection',
      'Repeat disputer blocking',
      'Priority support',
      'API access',
    ],
    highlighted: true,
    priceId: 'price_pro'
  },
  {
    name: 'Agency',
    price: 200,
    description: 'For agencies & high volume',
    features: [
      'Everything in Pro',
      'Multi-merchant dashboard',
      'White-label reports',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
    ],
    priceId: 'price_agency'
  },
]

const MOCK_SPEND_DATA = [
  { month: 'Oct', spend: 30 },
  { month: 'Nov', spend: 30 },
  { month: 'Dec', spend: 50 },
  { month: 'Jan', spend: 50 },
  { month: 'Feb', spend: 50 },
  { month: 'Mar', spend: 50 },
]

export default function BillingPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [merchant, setMerchant] = useState<{ plan: string | null; subscription_status: string | null; trial_ends_at: string | null } | null>(null)
  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>([])
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: m } = await supabase
        .from('merchants')
        .select('plan, subscription_status, trial_ends_at')
        .eq('user_id', user.id)
        .single()
      if (m) setMerchant(m)
      const { data: billing } = await supabase
        .from('billing_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)
      setBillingHistory((billing as BillingRecord[]) || [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleUpgrade(plan: Plan) {
    if (!plan.priceId) return
    setCheckoutLoading(plan.priceId)
    try {
      const res = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan.priceId, planName: plan.name })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      // silently handle
    } finally {
      setCheckoutLoading(null)
    }
  }

  const currentPlan = merchant?.plan || 'Trial'
  const subStatus = merchant?.subscription_status || 'trial'
  const trialEnd = merchant?.trial_ends_at ? new Date(merchant.trial_ends_at) : null
  const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / 86400000)) : null

  const statusColor = subStatus === 'active' ? 'text-[#10B981] bg-green-50 border-green-100' :
    subStatus === 'cancelled' ? 'text-[#EF4444] bg-red-50 border-red-100' :
    'text-[#F59E0B] bg-amber-50 border-amber-100'

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-[#111827]">Billing</h1>

      {/* Current plan card */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-1">Current Plan</h2>
            {loading ? <Skeleton className="h-8 w-32" /> : (
              <>
                <p className="text-2xl font-bold text-[#111827]">{currentPlan}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${statusColor}`}>
                    {subStatus}
                  </span>
                  {daysLeft !== null && subStatus === 'trial' && (
                    <span className="text-xs text-[#6B7280]">{daysLeft} days remaining</span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Spend chart */}
        <div className="mt-4">
          <p className="text-xs text-[#6B7280] mb-3">Spend over time</p>
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={MOCK_SPEND_DATA}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v: number) => [`$${v}/mo`, 'Spend']} contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' }} />
              <Area type="monotone" dataKey="spend" stroke="#4F46E5" strokeWidth={2} fill="url(#spendGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLANS.map(plan => (
          <div key={plan.name} className={`bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5 flex flex-col ${
            plan.highlighted ? 'border-2 border-[#4F46E5]' : 'border border-[#E5E7EB]'
          }`}>
            {plan.highlighted && (
              <div className="text-center mb-3">
                <span className="text-xs bg-[#4F46E5] text-white px-3 py-1 rounded-full font-semibold">Most Popular</span>
              </div>
            )}
            <h3 className="text-lg font-bold text-[#111827]">{plan.name}</h3>
            <p className="text-[#6B7280] text-xs mt-0.5 mb-3">{plan.description}</p>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-[#111827]">${plan.price}</span>
              <span className="text-[#9CA3AF] text-sm">/mo</span>
            </div>
            <ul className="space-y-2 flex-1 mb-5">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#374151]">
                  <span className="text-[#10B981] flex-shrink-0 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(plan)}
              disabled={checkoutLoading === plan.priceId || currentPlan.toLowerCase() === plan.name.toLowerCase()}
              className={`w-full rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-40 ${
                plan.highlighted
                  ? 'bg-[#4F46E5] text-white hover:bg-indigo-700'
                  : 'border border-[#E5E7EB] text-[#111827] hover:bg-gray-50'
              }`}
            >
              {checkoutLoading === plan.priceId ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Loading...
                </span>
              ) : currentPlan.toLowerCase() === plan.name.toLowerCase() ? 'Current plan' : 'Get started'}
            </button>
          </div>
        ))}
      </div>

      {/* Billing history */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-sm font-semibold text-[#111827]">Billing History</h2>
        </div>
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12" />)}
          </div>
        ) : billingHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#9CA3AF] text-sm">No billing history yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                {['Date', 'Description', 'Amount', 'Status'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium text-[#6B7280]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {billingHistory.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3 text-xs text-[#6B7280]">
                    {new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-3 text-sm text-[#374151]">{b.description}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-[#111827]">${b.amount?.toFixed(2)}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                      b.status === 'paid' ? 'bg-green-50 text-[#10B981] border border-green-100' :
                      b.status === 'failed' ? 'bg-red-50 text-[#EF4444] border border-red-100' :
                      'bg-gray-100 text-[#6B7280]'
                    }`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
