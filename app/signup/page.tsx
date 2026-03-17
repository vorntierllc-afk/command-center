'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })
    if (authError) { setError(authError.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('merchants').insert({
        user_id: data.user.id,
        business_name: fullName,
        status: 'onboarding'
      })
    }
    router.push('/onboarding')
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/onboarding` }
    })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full md:w-1/2 bg-[#0A0A0A] flex flex-col justify-between p-10 md:p-16 min-h-[280px] md:min-h-screen">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
            <span className="text-[#0A0A0A] font-bold text-xs">H</span>
          </div>
          <span className="text-white font-semibold tracking-tight">HighRiskIntel</span>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-6">Risk Intelligence Platform</p>
          <h1 className="font-playfair text-white text-4xl md:text-5xl leading-tight mb-6">
            Know your risk<br />
            <em>before your processor</em><br />
            does.
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            HighRiskIntel reads your transaction data, scores every payment, and tells you exactly what to fix — before your processor terminates your MID.
          </p>
        </div>
        <p className="text-gray-600 text-xs">Trusted by merchants in supplements, travel, crypto, gaming, and adult verticals</p>
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-[#0A0A0A] mb-1">Create your account</h2>
          <p className="text-gray-500 text-sm mb-8">Start protecting your MID in minutes</p>

          <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 border border-[#E5E7EB] rounded-full py-3 text-sm font-medium hover:bg-gray-50 transition mb-5">
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} required
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] transition" />
            <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] transition" />
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] transition pr-12" />
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-[#0A0A0A] text-white rounded-full py-3 text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50">
              {loading ? 'Creating account...' : 'Get started →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/signin" className="text-[#0A0A0A] font-medium underline underline-offset-2">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
