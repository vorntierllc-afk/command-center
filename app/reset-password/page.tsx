'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-6 h-6 bg-[#0A0A0A] rounded-sm flex items-center justify-center">
            <span className="text-white font-bold text-xs">H</span>
          </div>
          <span className="font-semibold text-[#0A0A0A]">HighRiskIntel</span>
        </div>
        <h2 className="text-2xl font-bold text-[#0A0A0A] mb-1 text-center">Set new password</h2>
        <p className="text-gray-500 text-sm mb-8 text-center">Choose a strong password for your account.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" placeholder="New password" value={password}
            onChange={e => setPassword(e.target.value)} required
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] transition" />
          <input type="password" placeholder="Confirm password" value={confirm}
            onChange={e => setConfirm(e.target.value)} required
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] transition" />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#0A0A0A] text-white rounded-full py-3 text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50">
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
