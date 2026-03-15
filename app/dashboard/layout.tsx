'use client'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: '⊞' },
  { href: '/dashboard/transactions', label: 'Transactions', icon: '↕' },
  { href: '/dashboard/risk', label: 'Risk Monitor', icon: '◎' },
  { href: '/dashboard/alerts', label: 'Alerts', icon: '◐', badge: 3 },
  { href: '/dashboard/reports', label: 'Reports', icon: '▤' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser({ name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Merchant', email: user.email || '' })
    })
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex">
      {/* SIDEBAR - desktop */}
      <aside className="hidden md:flex flex-col w-[220px] bg-white dark:bg-[#111111] border-r border-[#F3F4F6] dark:border-[#222222] fixed h-full z-20">
        <div className="p-5 border-b border-[#F3F4F6] dark:border-[#222222]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0A0A0A] rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="font-semibold tracking-tight text-[#0A0A0A] dark:text-white">HighRiskIntel</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(item => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active ? 'bg-[#0A0A0A] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1A1A1A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-white text-[#0A0A0A]' : 'bg-red-100 text-red-600'}`}>{item.badge}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#F3F4F6] dark:border-[#222222] space-y-3">
          <button className="w-full text-left px-3 py-2 bg-[#0A0A0A] text-white rounded-lg text-xs font-medium hover:bg-gray-900 transition">
            Upgrade to Professional
          </button>
          {user && (
            <div className="flex items-center gap-3 px-1">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                {user.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#0A0A0A] dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between px-1">
            <button onClick={() => setDark(d => !d)} className="text-xs text-gray-400 hover:text-gray-600 transition">
              {dark ? '☀ Light' : '◑ Dark'}
            </button>
            <button onClick={signOut} className="text-xs text-gray-400 hover:text-red-500 transition">Sign out</button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 md:ml-[220px]">
        {children}
      </main>

      {/* BOTTOM NAV - mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-20 flex">
        {NAV.slice(0, 5).map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} className={`flex-1 flex flex-col items-center py-3 text-xs gap-1 ${active ? 'text-[#0A0A0A]' : 'text-gray-400'}`}>
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
