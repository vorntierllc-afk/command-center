'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Alert {
  id: string
  type: string
  message: string
  read: boolean
  created_at: string
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-gray-100 dark:bg-[#1A1A1A] rounded animate-pulse ${className}`} />
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

export default function AlertsPage() {
  const supabase = createClient()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)
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
    setAlerts(a => a.map(alert => alert.id === id ? { ...alert, read: true } : alert))
    await supabase.from('alerts').update({ read: true }).eq('id', id)
  }

  async function markAllRead() {
    if (!userId) return
    setAlerts(a => a.map(alert => ({ ...alert, read: true })))
    await supabase.from('alerts').update({ read: true }).eq('user_id', userId).eq('read', false)
  }

  const unread = alerts.filter(a => !a.read).length

  const groups = [
    {
      label: 'Critical',
      borderColor: 'border-[#DC2626]',
      items: alerts.filter(a => a.type === 'critical')
    },
    {
      label: 'Warning',
      borderColor: 'border-[#D97706]',
      items: alerts.filter(a => a.type === 'warning')
    },
    {
      label: 'Info',
      borderColor: 'border-blue-400',
      items: alerts.filter(a => a.type === 'info')
    },
  ]

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white">Alerts</h1>
          {!loading && unread > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">{unread} unread</p>
          )}
        </div>
        {!loading && unread > 0 && (
          <button onClick={markAllRead} className="text-sm text-gray-500 hover:text-[#0A0A0A] dark:hover:text-white transition">
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-4xl mb-4">✓</div>
          <p className="text-gray-400 text-lg font-medium">You&apos;re all clear.</p>
          <p className="text-gray-400 text-sm mt-1">No alerts yet. We&apos;ll notify you when something needs attention.</p>
        </div>
      ) : (
        <>
          {unread === 0 && (
            <div className="text-center py-8 mb-6">
              <div className="text-3xl mb-2">✓</div>
              <p className="text-gray-400 text-sm">All caught up — no unread alerts.</p>
            </div>
          )}

          <div className="space-y-8">
            {groups.map(group => group.items.length > 0 && (
              <div key={group.label}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{group.label}</p>
                <div className="space-y-2">
                  {group.items.map(alert => (
                    <div
                      key={alert.id}
                      onClick={() => !alert.read && markRead(alert.id)}
                      className={`flex items-start gap-4 p-4 bg-white dark:bg-[#111111] rounded-xl border-l-4 cursor-pointer hover:shadow-sm transition ${group.borderColor} ${!alert.read ? 'shadow-sm' : ''}`}
                    >
                      <div className="flex-1">
                        <p className={`text-sm leading-snug ${alert.read ? 'text-gray-500 dark:text-gray-500' : 'text-[#0A0A0A] dark:text-white font-medium'}`}>
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{timeAgo(alert.created_at)}</p>
                      </div>
                      {!alert.read && <div className="w-2 h-2 bg-[#0A0A0A] dark:bg-white rounded-full mt-1.5 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
