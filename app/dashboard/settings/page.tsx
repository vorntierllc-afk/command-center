'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors ${checked ? 'bg-[#0A0A0A]' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'left-5' : 'left-1'}`} />
    </button>
  )
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-gray-100 dark:bg-[#1A1A1A] rounded animate-pulse ${className}`} />
}

export default function SettingsPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [notif, setNotif] = useState({
    highRisk: true,
    weekly: true,
    alerts: true,
    disputes: false
  })
  const [thresholds, setThresholds] = useState({
    autoFlag: 70,
    autoRefund: 90,
    autoBlock: 95
  })
  const [merchantId, setMerchantId] = useState<string | null>(null)
  const [plan, setPlan] = useState('Starter')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setEmail(user.email || '')
      setName(user.user_metadata?.full_name || '')

      const { data: m } = await supabase
        .from('merchants')
        .select('id, onboarding_data')
        .eq('user_id', user.id)
        .single()

      if (m) {
        setMerchantId(m.id)
      }
      setLoading(false)
    })
  }, [])

  async function saveSettings() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.auth.updateUser({
        data: { full_name: name }
      })
      if (merchantId) {
        await supabase.from('merchants').update({
          business_name: name
        }).eq('id', merchantId)
      }
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-10 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mb-8">Settings</h1>

      {/* Account */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Account</h2>
        <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 space-y-4 shadow-sm">
          {loading ? (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Full name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0A0A0A] dark:bg-[#111111] dark:border-[#333333] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <input
                  value={email}
                  readOnly
                  className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm outline-none bg-gray-50 dark:bg-[#1A1A1A] text-gray-400 dark:border-[#333333]"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Plan</span>
                <span className="text-xs font-semibold bg-gray-100 dark:bg-[#222222] text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">{plan}</span>
              </div>
              <button
                onClick={saveSettings}
                disabled={saving}
                className="w-full bg-[#0A0A0A] text-white rounded-full py-2.5 text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-40">
                {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save changes'}
              </button>
            </>
          )}
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Notifications</h2>
        <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 space-y-4 shadow-sm">
          {[
            { key: 'highRisk', label: 'High-risk transaction alerts', desc: 'Get notified when transactions score above 80' },
            { key: 'weekly', label: 'Weekly risk reports', desc: 'Receive weekly summary reports via email' },
            { key: 'alerts', label: 'Real-time dispute alerts', desc: 'Instant alerts when disputes are filed' },
            { key: 'disputes', label: 'Dispute probability warnings', desc: 'Early warnings when dispute probability rises' },
          ].map(item => (
            <div key={item.key} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#0A0A0A] dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <Toggle
                checked={notif[item.key as keyof typeof notif]}
                onChange={v => setNotif(n => ({ ...n, [item.key]: v }))}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Risk Thresholds */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Risk Thresholds</h2>
        <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 space-y-4 shadow-sm">
          {[
            { key: 'autoFlag', label: 'Auto-flag threshold', description: 'Flag transactions above this score for review' },
            { key: 'autoRefund', label: 'Auto-refund suggestion', description: 'Suggest refund above this score' },
            { key: 'autoBlock', label: 'Auto-block threshold', description: 'Block transactions above this score' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#0A0A0A] dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-400">{item.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={thresholds[item.key as keyof typeof thresholds]}
                  onChange={e => setThresholds(t => ({ ...t, [item.key]: Number(e.target.value) }))}
                  className="w-16 border border-[#E5E7EB] dark:border-[#333333] rounded-lg px-2 py-1.5 text-sm text-center outline-none focus:border-[#0A0A0A] dark:bg-[#111111] dark:text-white"
                  min={0}
                  max={100}
                />
                <span className="text-xs text-gray-400">/100</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data & Integrations */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Data & Integrations</h2>
        <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0A0A0A] dark:text-white">Processor connection</p>
              <p className="text-xs text-gray-400">Manage your connected payment processor</p>
            </div>
            <a href="/onboarding" className="text-xs font-semibold text-[#0A0A0A] dark:text-white border border-[#E5E7EB] dark:border-[#333333] px-4 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition">
              Reconnect
            </a>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-4">Danger Zone</h2>
        <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 border border-red-100 dark:border-red-900 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0A0A0A] dark:text-white">Delete account</p>
              <p className="text-xs text-gray-400">Permanently delete your account and all data</p>
            </div>
            <button className="text-xs text-red-600 border border-red-200 px-4 py-2 rounded-full hover:bg-red-50 transition font-medium">
              Delete
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
