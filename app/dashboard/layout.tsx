'use client'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: '⊞', exact: true },
  { href: '/dashboard/transactions', label: 'Transactions', icon: '↕', exact: false },
  { href: '/dashboard/risk', label: 'Risk Monitor', icon: '◎', exact: false },
  { href: '/dashboard/disputes', label: 'Disputes', icon: '🛡', exact: false },
  { href: '/dashboard/alerts', label: 'Alerts', icon: '◐', exact: false, hasBadge: true },
  { href: '/dashboard/reports', label: 'Reports', icon: '▤', exact: false },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙', exact: false },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<{ name: string; email: string; plan: string } | null>(null)
  const [dark, setDark] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUser({
          name: user.user_metadata?.full_name?.split(' ')[0] || 'Merchant',
          email: user.email || '',
          plan: 'Basic'
        })
        const { count } = await supabase
          .from('alerts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('read', false)
        setUnreadCount(count || 0)
      }
    })
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  function isActive(item: typeof NAV[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0A] flex">
      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-[220px] bg-white dark:bg-[#111111] border-r border-[#F3F4F6] dark:border-[#222222] fixed h-full z-20">
        <div className="p-5 border-b border-[#F3F4F6] dark:border-[#222222]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0A0A0A] rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="font-semibold text-[#0A0A0A] dark:text-white tracking-tight">HighRiskIntel</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(item => {
            const active = isActive(item)
            const badgeCount = item.hasBadge ? unreadCount : 0
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active ? 'bg-[#0A0A0A] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1A1A1A]'
                }`}>
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
                {badgeCount > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${active ? 'bg-white text-[#0A0A0A]' : 'bg-red-100 text-red-600'}`}>
                    {badgeCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#F3F4F6] dark:border-[#222222] space-y-3">
          <button className="w-full text-left px-3 py-2 bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A] rounded-lg text-xs font-semibold hover:opacity-90 transition">
            Upgrade to Pro
          </button>
          {user && (
            <div className="flex items-center gap-2 px-1">
              <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
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

      <main className="flex-1 md:ml-[220px] pb-16 md:pb-0">
        {children}
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-20 flex">
        {NAV.slice(0, 5).map(item => {
          const active = isActive(item)
          return (
            <Link key={item.href} href={item.href}
              className={`flex-1 flex flex-col items-center py-2 text-xs gap-0.5 ${active ? 'text-[#0A0A0A]' : 'text-gray-400'}`}>
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
