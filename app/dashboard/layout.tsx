'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/shared/Logo'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Analytics', href: '/dashboard/analytics' },
  { label: 'Alerts', href: '/dashboard/alerts' },
  { label: 'Settings', href: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [userName, setUserName] = useState('Account')
  const [userEmail, setUserEmail] = useState('')
  const [alertCount, setAlertCount] = useState(0)

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/signin')
        return
      }

      setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Account')
      setUserEmail(user.email || '')

      const { count } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false)

      setAlertCount(count || 0)
    }

    load()
  }, [router, supabase])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111111]">
      <div className="mx-auto grid min-h-screen max-w-[1480px] grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-r border-[#E5E7EB] bg-[#FBFBFC] px-5 py-6">
          <Logo />

          <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mb-1 flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition last:mb-0 ${
                    active
                      ? 'bg-[#1E2A38] text-white'
                      : 'text-[#6B7280] hover:bg-[#F7F7F8] hover:text-[#111111]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.label === 'Alerts' && alertCount > 0 ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        active ? 'bg-white/15 text-white' : 'bg-[#F1F2F4] text-[#1E2A38]'
                      }`}
                    >
                      {alertCount}
                    </span>
                  ) : null}
                </Link>
              )
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Workspace</p>
            <p className="mt-3 text-sm leading-6 text-[#111111]">
              Merchant risk, alerts, and review activity arranged in one institutional layout.
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="border-b border-[#E5E7EB] bg-white">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Merchant risk workspace</p>
                <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-[#111111]">HighRiskIntel platform</h1>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/alerts"
                  className="rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] px-3.5 py-2.5 text-sm font-medium text-[#111111]"
                >
                  Notifications
                  {alertCount > 0 ? (
                    <span className="ml-2 rounded-full bg-[#1E2A38] px-1.5 py-0.5 text-[11px] text-white">{alertCount}</span>
                  ) : null}
                </Link>

                <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-2.5">
                  <div className="text-sm font-medium text-[#111111]">{userName}</div>
                  <div className="text-xs text-[#6B7280]">{userEmail || 'Signed in'}</div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="rounded-xl border border-[#D5D9DF] bg-white px-3.5 py-2.5 text-sm font-medium text-[#111111] transition hover:bg-[#F7F7F8]"
                >
                  Sign out
                </button>
              </div>
            </div>
          </header>

          <main className="px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
