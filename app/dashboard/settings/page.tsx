'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
}

const MASKED_API_KEY = 'hri_live_••••••••••••••••'

const CODE_EXAMPLE = `curl -X POST https://highriskintel.com/api/risk-score \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 299, "country": "NG", "email": "test@gmail.com"}'`

export default function SettingsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSection, setSavedSection] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Account
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [merchantId, setMerchantId] = useState<string | null>(null)
  const [connectedProcessor, setConnectedProcessor] = useState<string | null>(null)

  // Risk thresholds
  const [thresholds, setThresholds] = useState({
    autoFlag: 75,
    autoRefund: 90,
    cbWarning: '1.0',
    cbCritical: '1.5',
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email || '')
      setBusinessName(user.user_metadata?.full_name || '')

      const { data: m } = await supabase
        .from('merchants')
        .select('id, business_name, processor')
        .eq('user_id', user.id)
        .single()
      if (m) {
        setMerchantId(m.id)
        setConnectedProcessor(m.processor || null)
        if (m.business_name) setBusinessName(m.business_name)
      }

      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('auto_flag_threshold, auto_refund_threshold, cb_warning_level, cb_critical_level')
        .eq('user_id', user.id)
        .single()
      if (prefs) {
        setThresholds({
          autoFlag: prefs.auto_flag_threshold ?? 75,
          autoRefund: prefs.auto_refund_threshold ?? 90,
          cbWarning: prefs.cb_warning_level ?? '1.0',
          cbCritical: prefs.cb_critical_level ?? '1.5',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function saveAccount() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.auth.updateUser({ data: { full_name: businessName } })
      if (merchantId) {
        await supabase.from('merchants').update({ business_name: businessName }).eq('id', merchantId)
      }
    }
    setSaving(false)
    setSavedSection('account')
    setTimeout(() => setSavedSection(null), 2000)
  }

  async function saveThresholds() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('user_preferences').upsert({
        user_id: user.id,
        auto_flag_threshold: thresholds.autoFlag,
        auto_refund_threshold: thresholds.autoRefund,
        cb_warning_level: thresholds.cbWarning,
        cb_critical_level: thresholds.cbCritical,
      }, { onConflict: 'user_id' })
    }
    setSaving(false)
    setSavedSection('thresholds')
    setTimeout(() => setSavedSection(null), 2000)
  }

  function copyApiKey() {
    navigator.clipboard.writeText(MASKED_API_KEY)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDelete() {
    if (deleteInput !== 'DELETE') return
    setDeleting(true)
    // In a real app, call a delete endpoint here
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const inputClass = "w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4F46E5] transition bg-white"
  const readonlyClass = "w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none bg-[#F9FAFB] text-[#9CA3AF]"

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#111827]">Settings</h1>

      {/* 1. Account Information */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#111827]">Account Information</h2>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">Business Name</label>
              <input
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="Your business name"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">Email</label>
              <input value={email} readOnly className={readonlyClass} />
            </div>
            <button
              onClick={saveAccount}
              disabled={saving}
              className="bg-[#4F46E5] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-40"
            >
              {savedSection === 'account' ? '✓ Saved' : saving ? 'Saving...' : 'Save changes'}
            </button>
          </>
        )}
      </div>

      {/* 2. Risk Thresholds */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#111827]">Risk Thresholds</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">Auto-flag threshold (0-100)</label>
                <input
                  type="number"
                  min={0} max={100}
                  value={thresholds.autoFlag}
                  onChange={e => setThresholds(t => ({ ...t, autoFlag: Number(e.target.value) }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">Auto-refund threshold (0-100)</label>
                <input
                  type="number"
                  min={0} max={100}
                  value={thresholds.autoRefund}
                  onChange={e => setThresholds(t => ({ ...t, autoRefund: Number(e.target.value) }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">CB warning level (%)</label>
                <input
                  type="text"
                  value={thresholds.cbWarning}
                  onChange={e => setThresholds(t => ({ ...t, cbWarning: e.target.value }))}
                  placeholder="1.0"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">CB critical level (%)</label>
                <input
                  type="text"
                  value={thresholds.cbCritical}
                  onChange={e => setThresholds(t => ({ ...t, cbCritical: e.target.value }))}
                  placeholder="1.5"
                  className={inputClass}
                />
              </div>
            </div>
            <button
              onClick={saveThresholds}
              disabled={saving}
              className="bg-[#4F46E5] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-40"
            >
              {savedSection === 'thresholds' ? '✓ Saved' : saving ? 'Saving...' : 'Save thresholds'}
            </button>
          </>
        )}
      </div>

      {/* 3. Connected Processor */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
        <h2 className="text-sm font-semibold text-[#111827] mb-4">Connected Processor</h2>
        {loading ? <Skeleton className="h-12" /> : (
          <div className="flex items-center justify-between">
            <div>
              {connectedProcessor ? (
                <>
                  <p className="text-sm font-medium text-[#111827] capitalize">{connectedProcessor}</p>
                  <p className="text-xs text-[#10B981] mt-0.5">Connected and syncing</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-[#374151]">No processor connected</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">Connect a processor to sync your transaction data</p>
                </>
              )}
            </div>
            <Link href="/dashboard/integrations"
              className="text-sm border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-xl hover:bg-gray-50 transition font-medium">
              {connectedProcessor ? 'Change processor' : 'Connect processor'}
            </Link>
          </div>
        )}
      </div>

      {/* 4. API Access */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#111827]">API Access</h2>
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">API Key</label>
          <div className="flex gap-2">
            <div className="flex-1 border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm bg-[#F9FAFB] font-mono text-[#374151] flex items-center">
              {MASKED_API_KEY}
            </div>
            <button
              onClick={copyApiKey}
              className="border border-[#E5E7EB] text-[#374151] px-4 rounded-xl text-sm hover:bg-gray-50 transition font-medium"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">Example Request</label>
          <div className="bg-[#111827] rounded-xl p-4 overflow-x-auto">
            <pre className="text-xs text-[#E5E7EB] font-mono whitespace-pre leading-relaxed">{CODE_EXAMPLE}</pre>
          </div>
        </div>
      </div>

      {/* 5. Danger Zone */}
      <div className="bg-white border border-[#EF4444] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#EF4444]">Danger Zone</h2>
        <div>
          <p className="text-sm font-medium text-[#111827] mb-1">Delete your account</p>
          <p className="text-xs text-[#6B7280] mb-4">This will permanently delete your account and all data. Type <span className="font-mono font-bold text-[#EF4444]">DELETE</span> to confirm.</p>
          <div className="flex gap-3">
            <input
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="flex-1 border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#EF4444] transition"
            />
            <button
              onClick={handleDelete}
              disabled={deleteInput !== 'DELETE' || deleting}
              className="bg-[#EF4444] text-white rounded-xl px-5 py-3 text-sm font-semibold hover:bg-red-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {deleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
