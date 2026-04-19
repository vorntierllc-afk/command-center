'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/shared/Logo'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.session && data.user) {
      const { data: existing } = await supabase.from('merchants').select('id').eq('user_id', data.user.id).single()
      if (!existing) {
        await supabase.from('merchants').insert({
          user_id: data.user.id,
          business_name: fullName,
          status: 'onboarding',
        })
      }
      router.push('/onboarding')
      return
    }

    if (data.user && !data.session) {
      setError('Check your email and confirm the account to continue.')
      setLoading(false)
      return
    }

    router.push('/onboarding')
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/onboarding` },
    })
  }

  return (
    <div className="min-h-screen bg-[#F7F7F8] px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <Logo />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_440px]">
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Get started</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#111111]">Set up a cleaner risk workflow for your team.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#6B7280]">
              Create an account, complete onboarding, and start organizing merchant risk work in a more structured environment.
            </p>

            <div className="mt-10 space-y-4">
              {[
                ['1. Create account', 'Set up the workspace and basic account details.'],
                ['2. Add merchant data', 'Start with statements or direct processor data where available.'],
                ['3. Review account health', 'Use the dashboard to track dispute pressure and follow-up work.'],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] p-4">
                  <p className="text-sm font-semibold text-[#111111]">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#6B7280]">{copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-8">
            <h2 className="text-2xl font-semibold text-[#111111]">Create account</h2>
            <p className="mt-2 text-sm text-[#6B7280]">Start with the core workspace and continue into onboarding.</p>

            <button
              onClick={handleGoogle}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-medium text-[#111111] transition hover:bg-[#F7F7F8]"
            >
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E5E7EB]" />
              <span className="text-xs uppercase tracking-[0.08em] text-[#6B7280]">or</span>
              <div className="h-px flex-1 bg-[#E5E7EB]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111111]">Business name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition focus:border-[#1E2A38]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111111]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition focus:border-[#1E2A38]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111111]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition focus:border-[#1E2A38]"
                />
              </div>
              {error ? <p className="text-sm text-[#DC2626]">{error}</p> : null}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#1E2A38] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#16202C] disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="mt-5 text-sm text-[#6B7280]">
              Already have an account?{' '}
              <Link href="/signin" className="font-medium text-[#1E2A38]">
                Sign in
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
