'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-11 h-6 rounded-full transition-colors flex items-center flex-shrink-0 ${on ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

interface Rule {
  id: string
  type: string
  description: string
  action: string
  enabled: boolean
}

interface BlockedCustomer {
  id: string
  email: string
  dispute_count: number
  total_value: number
  status: string
  blocked_at: string
}

const DEFAULT_RULES: Rule[] = [
  { id: 'r1', type: 'country', description: 'IF country IN [NG, RU, UA, BY, IR] → Flag for review', action: 'flag', enabled: true },
  { id: 'r2', type: 'amount', description: 'IF amount > $2,500 → Flag for review', action: 'flag', enabled: true },
  { id: 'r3', type: 'risk_score', description: 'IF risk_score ≥ 80 → Auto-refund', action: 'refund', enabled: false },
  { id: 'r4', type: 'email', description: 'IF email domain in disposable list → Block', action: 'block', enabled: true },
]

const CONDITION_TYPES = ['country', 'amount', 'risk_score', 'email_domain', 'card_network']
const ACTION_TYPES = ['flag', 'block', 'refund', 'notify']

export default function PreventPage() {
  const supabase = createClient()
  const [rules, setRules] = useState<Rule[]>(DEFAULT_RULES)
  const [blockedCustomers, setBlockedCustomers] = useState<BlockedCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddRule, setShowAddRule] = useState(false)
  const [newRule, setNewRule] = useState({ condition: 'country', value: '', action: 'flag' })
  const [stats, setStats] = useState({ rulesActive: 0, scoredToday: 0, autoBlocked: 0, repeatFound: 0, revenueProtected: 0 })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: m } = await supabase.from('merchants').select('id').eq('user_id', user.id).single()
      if (!m) { setLoading(false); return }

      const [{ data: blocked }, { data: txToday }, { data: txsDisputed }] = await Promise.all([
        supabase.from('blocked_customers').select('*').eq('merchant_id', m.id).order('blocked_at', { ascending: false }),
        supabase.from('transactions').select('id', { count: 'exact', head: true }).eq('merchant_id', m.id)
          .gte('created_at', new Date(Date.now() - 86400000).toISOString()),
        supabase.from('transactions').select('email, amount').eq('merchant_id', m.id).eq('disputed', true)
      ])

      setBlockedCustomers((blocked as BlockedCustomer[]) || [])
      setStats({
        rulesActive: rules.filter(r => r.enabled).length,
        scoredToday: (txToday as unknown as { count: number })?.count || 0,
        autoBlocked: blocked?.filter((b: BlockedCustomer) => b.status === 'blocked').length || 0,
        repeatFound: blocked?.length || 0,
        revenueProtected: (blocked as BlockedCustomer[] || []).reduce((s, b) => s + b.total_value, 0)
      })
      setLoading(false)
    }
    load()
  }, [])

  function toggleRule(id: string) {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  function deleteRule(id: string) {
    setRules(prev => prev.filter(r => r.id !== id))
  }

  function addRule() {
    if (!newRule.value.trim()) return
    const rule: Rule = {
      id: `r${Date.now()}`,
      type: newRule.condition,
      description: `IF ${newRule.condition} matches "${newRule.value}" → ${newRule.action}`,
      action: newRule.action,
      enabled: true
    }
    setRules(prev => [...prev, rule])
    setNewRule({ condition: 'country', value: '', action: 'flag' })
    setShowAddRule(false)
  }

  async function unblock(id: string) {
    setBlockedCustomers(prev => prev.filter(c => c.id !== id))
    await supabase.from('blocked_customers').update({ status: 'unblocked' }).eq('id', id)
  }

  const actionColor = (action: string) => {
    if (action === 'block') return 'bg-red-50 text-[#EF4444] border-red-100'
    if (action === 'refund') return 'bg-amber-50 text-[#F59E0B] border-amber-100'
    return 'bg-blue-50 text-[#4F46E5] border-blue-100'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-[#111827]">Prevent</h1>
        <span className="text-xs bg-[#4F46E5] text-white px-2 py-0.5 rounded-full font-bold">BETA</span>
      </div>
      <p className="text-[#6B7280] text-sm -mt-4">Block fraudulent transactions before they become disputes. Set rules and detect repeat offenders automatically.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT — Real-time Risk Blocking */}
        <div className="space-y-4">
          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Rules Active', value: loading ? '–' : String(rules.filter(r => r.enabled).length) },
              { label: 'Scored Today', value: loading ? '–' : String(stats.scoredToday) },
              { label: 'Auto-blocked', value: loading ? '–' : String(stats.autoBlocked) },
            ].map(s => (
              <div key={s.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <p className="text-xs text-[#6B7280] mb-1">{s.label}</p>
                {loading ? <Skeleton className="h-6 w-10" /> : <p className="text-xl font-bold text-[#111827]">{s.value}</p>}
              </div>
            ))}
          </div>

          {/* Rules card */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
              <h2 className="text-sm font-semibold text-[#111827]">Risk Rules</h2>
              <button onClick={() => setShowAddRule(s => !s)}
                className="text-xs bg-[#4F46E5] text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition font-medium">
                + Add Rule
              </button>
            </div>

            <AnimatePresence>
              {showAddRule && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-indigo-50 border-b border-[#E5E7EB] space-y-3">
                    <p className="text-xs font-semibold text-[#4F46E5]">New Rule</p>
                    <div className="flex gap-2">
                      <select
                        value={newRule.condition}
                        onChange={e => setNewRule(r => ({ ...r, condition: e.target.value }))}
                        className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#4F46E5]"
                      >
                        {CONDITION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <input
                        value={newRule.value}
                        onChange={e => setNewRule(r => ({ ...r, value: e.target.value }))}
                        placeholder="Value (e.g. NG, 2500)"
                        className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#4F46E5]"
                      />
                      <select
                        value={newRule.action}
                        onChange={e => setNewRule(r => ({ ...r, action: e.target.value }))}
                        className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#4F46E5]"
                      >
                        {ACTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={addRule} className="flex-1 bg-[#4F46E5] text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700 transition">Add Rule</button>
                      <button onClick={() => setShowAddRule(false)} className="px-4 text-[#6B7280] border border-[#E5E7EB] rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="divide-y divide-[#F3F4F6]">
              {rules.map(rule => (
                <div key={rule.id} className={`flex items-center gap-3 px-5 py-4 transition ${rule.enabled ? '' : 'opacity-50'}`}>
                  <Toggle on={rule.enabled} onChange={() => toggleRule(rule.id)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#374151] leading-snug">{rule.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${actionColor(rule.action)}`}>{rule.action}</span>
                  <div className="flex gap-1 flex-shrink-0">
                    <button className="text-xs text-[#6B7280] hover:text-[#111827] px-2 py-1 rounded border border-[#E5E7EB] hover:bg-gray-50 transition">Edit</button>
                    <button onClick={() => deleteRule(rule.id)} className="text-xs text-[#EF4444] hover:text-red-700 px-2 py-1 rounded border border-red-100 hover:bg-red-50 transition">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Repeat Disputer Detection */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Repeat Disputers Found', value: loading ? '–' : String(stats.repeatFound) },
              { label: 'Revenue Protected', value: loading ? '–' : `$${stats.revenueProtected.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
            ].map(s => (
              <div key={s.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <p className="text-xs text-[#6B7280] mb-1">{s.label}</p>
                {loading ? <Skeleton className="h-6 w-16" /> : <p className="text-xl font-bold text-[#111827]">{s.value}</p>}
              </div>
            ))}
          </div>

          {/* Blocked customers */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E5E7EB]">
              <h2 className="text-sm font-semibold text-[#111827]">Blocked Customers</h2>
            </div>

            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : blockedCustomers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-3">
                  <span className="text-[#10B981]">✓</span>
                </div>
                <p className="text-sm font-medium text-[#374151] mb-1">No repeat disputers detected</p>
                <p className="text-xs text-[#9CA3AF]">We&apos;ll automatically flag customers who file multiple disputes</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[#9CA3AF] border-b border-[#F3F4F6]">
                      <th className="text-left px-5 py-3 font-medium">Customer</th>
                      <th className="text-right px-3 py-3 font-medium">Disputes</th>
                      <th className="text-right px-3 py-3 font-medium">Total</th>
                      <th className="text-center px-3 py-3 font-medium">Status</th>
                      <th className="text-right px-5 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {blockedCustomers.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3">
                          <p className="font-medium text-[#374151] truncate max-w-[140px]">{c.email}</p>
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-[#EF4444]">{c.dispute_count}</td>
                        <td className="px-3 py-3 text-right text-[#374151]">${c.total_value?.toFixed(0)}</td>
                        <td className="px-3 py-3 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            c.status === 'blocked' ? 'bg-red-50 text-[#EF4444]' : 'bg-gray-100 text-[#6B7280]'
                          }`}>{c.status}</span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button onClick={() => unblock(c.id)}
                            className="text-xs border border-[#E5E7EB] text-[#6B7280] px-2 py-1 rounded-lg hover:bg-gray-50 transition">
                            Unblock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
