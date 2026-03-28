'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-[#0A0A0A] flex flex-col justify-between p-10 md:p-16 min-h-[200px] md:min-h-screen">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
            <span className="text-[#0A0A0A] font-bold text-xs">H</span>
          </div>
          <span className="text-white font-semibold tracking-tight">HighRiskIntel</span>
        </div>
        <div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">Reset your<br />password.</h1>
          <p className="text-gray-400 text-sm">We&apos;ll send a reset link to your email.</p>
        </div>
        <p className="text-gray-600 text-xs">highriskintel.com</p>
      </div>

      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-sm">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">✉️</span>
              </div>
              <h2 className="text-2xl font-bold text-[#0A0A0A] mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm mb-8">
                We sent a reset link to <strong>{email}</strong>. Click it to set a new password.
              </p>
              <Link href="/signin" className="text-sm text-[#0A0A0A] font-medium underline underline-offset-2">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-[#0A0A0A] mb-1">Forgot password?</h2>
              <p className="text-gray-500 text-sm mb-8">Enter your email and we&apos;ll send a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] transition"
                />
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full bg-[#0A0A0A] text-white rounded-full py-3 text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>
              <p className="text-center text-sm text-gray-500 mt-6">
                <Link href="/signin" className="text-[#0A0A0A] font-medium underline underline-offset-2">Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
