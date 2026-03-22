'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AnimatePresence, motion } from 'framer-motion'

interface Alert {
  id: string
  type: string
  message: string
  ai_explanation: string | null
  read: boolean
  created_at: string
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}hr ago`
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

type FilterTab = 'all' | 'critical' | 'warning' | 'info' | 'unread'

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'critical', label: 'Critical' },
  { key: 'warning', label: 'Warning' },
  { key: 'info', label: 'Info' },
  { key: 'unread', label: 'Unread' },
]

function alertBorderColor(type: string) {
  if (type === 'critical') return 'border-l-[#EF4444]'
  if (type === 'warning') return 'border-l-[#F59E0B]'
  return 'border-l-blue-400'
}

function alertIconBg(type: string) {
  if (type === 'critical') return 'bg-red-50 text-[#EF4444]'
  if (type === 'warning') return 'bg-amber-50 text-[#F59E0B]'
  return 'bg-blue-50 text-blue-500'
}

function alertIcon(type: string) {
  if (type === 'critical') return '⚠️'
  if (type === 'warning') return '⚡'
  return 'ℹ'
}

function severityClass(type: string) {
  if (type === 'critical') return 'bg-red-50 text-[#EF4444] border border-red-100'
  if (type === 'warning') return 'bg-amber-50 text-[#F59E0B] border border-amber-100'
  return 'bg-blue-50 text-blue-600 border border-blue-100'
}

export default function AlertsPage() {
  const supabase = createClient()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<FilterTab>('all')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setAlerts((data as Alert[]) || [])
      setLoading(false)
    })
  }, [])

  async function markRead(id: string) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
    await supabase.from('alerts').update({ read: true }).eq('id', id)
  }

  async function markAllRead() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setAlerts(prev => prev.map(a => ({ ...a, read: true })))
    await supabase.from('alerts').update({ read: true }).eq('user_id', user.id).eq('read', false)
  }

  function dismiss(id: string) {
    setDismissed(prev => new Set([...prev, id]))
  }

  const visible = alerts.filter(a => !dismissed.has(a.id))
  const unreadCount = visible.filter(a => !a.read).length

  const filtered = visible.filter(a => {
    if (tab === 'all') return true
    if (tab === 'unread') return !a.read
    return a.type === tab
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#111827]">Alerts</h1>
          {!loading && unreadCount > 0 && (
            <span className="text-sm bg-[#EF4444] text-white px-2.5 py-0.5 rounded-full font-bold">{unreadCount}</span>
          )}
        </div>
        {!loading && unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-[#4F46E5] hover:text-indigo-700 transition font-medium">
            Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t.key ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-[#10B981] text-2xl">✓</span>
          </div>
          <p className="text-[#374151] text-lg font-semibold mb-1">You&apos;re all clear</p>
          <p className="text-[#9CA3AF] text-sm">No alerts in the last 7 days</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map(alert => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                className={`flex items-start gap-4 p-4 bg-white rounded-xl border-l-4 border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition ${
                  alertBorderColor(alert.type)
                } ${!alert.read ? 'bg-[#EEF2FF]' : ''}`}
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${alertIconBg(alert.type)}`}>
                  {alertIcon(alert.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${alert.read ? 'text-[#6B7280]' : 'text-[#111827] font-medium'}`}>
                    {alert.message}
                  </p>
                  {alert.ai_explanation && (
                    <p className="text-xs text-[#4B5563] mt-2 leading-relaxed bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                      🤖 {alert.ai_explanation}
                    </p>
                  )}
                  <p className="text-xs text-[#9CA3AF] mt-1">{timeAgo(alert.created_at)}</p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${severityClass(alert.type)}`}>
                    {alert.type}
                  </span>
                  {!alert.read && (
                    <button onClick={() => markRead(alert.id)}
                      className="text-xs text-[#4F46E5] hover:text-indigo-700 border border-indigo-100 bg-indigo-50 px-2.5 py-1 rounded-lg transition">
                      Mark Read
                    </button>
                  )}
                  <button onClick={() => dismiss(alert.id)}
                    className="text-xs text-[#9CA3AF] hover:text-[#6B7280] border border-[#E5E7EB] px-2.5 py-1 rounded-lg hover:bg-gray-50 transition">
                    Dismiss
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
