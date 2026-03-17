'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

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

interface NotifPrefs {
  critical_alerts_email: boolean
  critical_alerts_inapp: boolean
  dispute_alerts_email: boolean
  dispute_alerts_inapp: boolean
  dispute_won_email: boolean
  dispute_won_inapp: boolean
  dispute_lost_email: boolean
  dispute_lost_inapp: boolean
  weekly_reports_email: boolean
  weekly_reports_inapp: boolean
  mid_warnings_email: boolean
  mid_warnings_inapp: boolean
  high_risk_txn_email: boolean
  high_risk_txn_inapp: boolean
}

const DEFAULT_PREFS: NotifPrefs = {
  critical_alerts_email: true,
  critical_alerts_inapp: true,
  dispute_alerts_email: true,
  dispute_alerts_inapp: true,
  dispute_won_email: false,
  dispute_won_inapp: true,
  dispute_lost_email: true,
  dispute_lost_inapp: true,
  weekly_reports_email: true,
  weekly_reports_inapp: false,
  mid_warnings_email: true,
  mid_warnings_inapp: false,
  high_risk_txn_email: false,
  high_risk_txn_inapp: true,
}

const NOTIFICATION_TYPES = [
  { key: 'critical_alerts', label: 'Critical Alerts', desc: 'Chargeback rate thresholds, MID termination risk' },
  { key: 'dispute_alerts', label: 'New Dispute Filed', desc: 'Get notified immediately when a dispute is filed' },
  { key: 'dispute_won', label: 'Dispute Won', desc: 'Celebrate wins — know when you beat a dispute' },
  { key: 'dispute_lost', label: 'Dispute Lost', desc: 'Know when a dispute is decided against you' },
  { key: 'weekly_reports', label: 'Weekly Risk Report', desc: 'Summary of your week sent every Monday morning' },
  { key: 'mid_warnings', label: 'MID Health Warnings', desc: 'Alerts when your MID health score drops' },
  { key: 'high_risk_txn', label: 'High Risk Transaction', desc: 'When a transaction scores ≥ 80 risk points' },
]

export default function NotificationsPage() {
  const supabase = createClient()
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT_PREFS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (data) {
        setPrefs({ ...DEFAULT_PREFS, ...data })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function savePrefs() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('user_preferences').upsert({
        user_id: user.id,
        ...prefs,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function setEmailPref(key: string, val: boolean) {
    setPrefs(p => ({ ...p, [`${key}_email`]: val }))
  }

  function setInappPref(key: string, val: boolean) {
    setPrefs(p => ({ ...p, [`${key}_inapp`]: val }))
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Notification Preferences</h1>
        <p className="text-[#6B7280] text-sm mt-1">Choose how and when you receive notifications.</p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-6 px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="text-xs font-medium text-[#6B7280]">Notification Type</div>
          <div className="text-xs font-medium text-[#6B7280] text-center w-16">Email</div>
          <div className="text-xs font-medium text-[#6B7280] text-center w-16">In-app</div>
        </div>

        <div className="divide-y divide-[#F3F4F6]">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-6 px-6 py-4">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-6 w-11 rounded-full" />
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            ))
            : NOTIFICATION_TYPES.map(item => (
              <div key={item.key} className="grid grid-cols-[1fr_auto_auto] gap-6 items-center px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-[#111827]">{item.label}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{item.desc}</p>
                </div>
                <div className="flex justify-center w-16">
                  <Toggle
                    on={prefs[`${item.key}_email` as keyof NotifPrefs]}
                    onChange={v => setEmailPref(item.key, v)}
                  />
                </div>
                <div className="flex justify-center w-16">
                  <Toggle
                    on={prefs[`${item.key}_inapp` as keyof NotifPrefs]}
                    onChange={v => setInappPref(item.key, v)}
                  />
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <button
        onClick={savePrefs}
        disabled={saving || loading}
        className="bg-[#4F46E5] text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-40"
      >
        {saving ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </span>
        ) : saved ? '✓ Preferences saved' : 'Save preferences'}
      </button>
    </div>
  )
}
