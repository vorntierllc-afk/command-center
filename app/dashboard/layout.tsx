'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Prevent', href: '/dashboard/prevent', badge: 'BETA' },
  { label: 'Disputes', href: '/dashboard/disputes' },
  { label: 'Alerts', href: '/dashboard/alerts' },
  { label: 'Integrations', href: '/dashboard/integrations' },
  { label: 'Notifications', href: '/dashboard/notifications' },
  { label: 'Billing', href: '/dashboard/billing' },
  { label: 'Settings', href: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [userName, setUserName] = useState('')
  const [alertCount, setAlertCount] = useState(0)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/signin'); return }
      setUserName(user.user_metadata?.full_name?.split(' ')[0] || 'there')
      const { count } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false)
      setAlertCount(count || 0)
    }
    load()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top nav */}
      <nav className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-6 flex items-center h-14 gap-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-[#4F46E5] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="font-bold text-[#111827] tracking-tight text-sm">HighRiskIntel</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1 flex-1 overflow-x-auto">
            {NAV_ITEMS.map(item => {
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    active ? 'text-[#4F46E5] bg-indigo-50' : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-50'
                  }`}>
                  {item.label}
                  {item.badge && (
                    <span className="text-xs bg-[#4F46E5] text-white px-1.5 py-0.5 rounded-full font-semibold">{item.badge}</span>
                  )}
                  {item.label === 'Alerts' && alertCount > 0 && (
                    <span className="text-xs bg-[#EF4444] text-white px-1.5 py-0.5 rounded-full font-semibold">{alertCount}</span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={handleSignOut} className="text-xs text-[#6B7280] hover:text-[#111827] transition">Sign out</button>
            <div className="w-8 h-8 bg-[#4F46E5] rounded-full flex items-center justify-center text-white text-xs font-bold">
              {userName?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
