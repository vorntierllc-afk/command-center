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

export default function SettingsPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [notif, setNotif] = useState({ highRisk: true, weekly: true, alerts: true, disputes: false })
  const [thresholds, setThresholds] = useState({ autoFlag: 70, autoRefund: 90, autoBlock: 95 })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || '')
        setName(user.user_metadata?.full_name || '')
      }
    })
  }, [])

  return (
    <div className="p-6 md:p-10 pb-24 md:pb-10 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mb-8">Settings</h1>

      {/* Account */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Account</h2>
        <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0A0A0A]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <input value={email} readOnly className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm outline-none bg-gray-50 text-gray-400" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Plan</span>
            <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Starter</span>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Notifications</h2>
        <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 space-y-4">
          {[
            { key: 'highRisk', label: 'High-risk transaction alerts' },
            { key: 'weekly', label: 'Weekly risk reports' },
            { key: 'alerts', label: 'Real-time dispute alerts' },
            { key: 'disputes', label: 'Dispute probability warnings' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
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
        <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 space-y-4">
          {[
            { key: 'autoFlag', label: 'Auto-flag threshold', description: 'Flag for review above this score' },
            { key: 'autoRefund', label: 'Auto-refund threshold', description: 'Suggest refund above this score' },
            { key: 'autoBlock', label: 'Auto-block threshold', description: 'Block transaction above this score' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#0A0A0A] dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-400">{item.description}</p>
              </div>
              <input
                type="number"
                value={thresholds[item.key as keyof typeof thresholds]}
                onChange={e => setThresholds(t => ({ ...t, [item.key]: Number(e.target.value) }))}
                className="w-16 border border-[#E5E7EB] rounded-lg px-2 py-1.5 text-sm text-center outline-none focus:border-[#0A0A0A]"
                min={0}
                max={100}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-4">Danger Zone</h2>
        <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 border border-red-100">
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
