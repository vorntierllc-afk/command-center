'use client'
import { useState } from 'react'

const ALERTS_DATA = [
  { id: 1, severity: 'critical', message: 'Chargeback rate exceeded Visa threshold (1.84%)', time: '2 minutes ago', read: false },
  { id: 2, severity: 'critical', message: 'MID termination risk elevated — 30-day prediction active', time: '1 hour ago', read: false },
  { id: 3, severity: 'warning', message: 'BIN mismatch detected — 501234 series showing dispute pattern', time: '3 hours ago', read: false },
  { id: 4, severity: 'warning', message: 'Velocity spike detected — 14 transactions in 2 hours from same IP', time: '5 hours ago', read: true },
  { id: 5, severity: 'info', message: 'Weekly report generated — 3 disputes caught this week', time: '1 day ago', read: true },
  { id: 6, severity: 'info', message: 'New transaction sync completed — 847 transactions analyzed', time: '2 days ago', read: true },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(ALERTS_DATA)

  function markRead(id: number) {
    setAlerts(a => a.map(alert => alert.id === id ? { ...alert, read: true } : alert))
  }

  function markAllRead() {
    setAlerts(a => a.map(alert => ({ ...alert, read: true })))
  }

  const unread = alerts.filter(a => !a.read).length

  const groups = [
    { label: 'Critical', borderColor: 'border-[#DC2626]', items: alerts.filter(a => a.severity === 'critical') },
    { label: 'Warning', borderColor: 'border-[#D97706]', items: alerts.filter(a => a.severity === 'warning') },
    { label: 'Info', borderColor: 'border-blue-400', items: alerts.filter(a => a.severity === 'info') },
  ]

  return (
    <div className="p-6 md:p-10 pb-24 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white">Alerts</h1>
          {unread > 0 && <p className="text-sm text-gray-500 mt-1">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm text-gray-500 hover:text-[#0A0A0A] transition">Mark all read</button>
        )}
      </div>

      {unread === 0 && (
        <div className="text-center py-16 mb-8">
          <div className="text-4xl mb-4">✓</div>
          <p className="text-gray-400 text-lg font-medium">You&apos;re all clear.</p>
          <p className="text-gray-400 text-sm">No unread alerts.</p>
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
                  onClick={() => markRead(alert.id)}
                  className={`flex items-start gap-4 p-4 bg-white dark:bg-[#111111] rounded-xl border-l-4 cursor-pointer hover:shadow-sm transition ${group.borderColor}`}
                >
                  <div className="flex-1">
                    <p className={`text-sm ${alert.read ? 'text-gray-500' : 'text-[#0A0A0A] dark:text-white font-medium'}`}>{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                  </div>
                  {!alert.read && <div className="w-2 h-2 bg-[#0A0A0A] rounded-full mt-1.5 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
