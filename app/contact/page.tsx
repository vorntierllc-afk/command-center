'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const TOPICS = [
  'Pricing & Plans',
  'Feature Request',
  'Technical Support',
  'Integration Help',
  'Account Issue',
  'Partnership',
  'Other',
]

export default function ContactPage() {
  const supabase = createClient()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [topic, setTopic] = useState(TOPICS[0])
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setSubmitting(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    const { error: err } = await supabase.from('inquiries').insert({
      user_id: user?.id ?? null,
      name,
      email,
      business_name: businessName,
      topic,
      message,
    })

    if (err) {
      setError('Something went wrong. Please try again.')
    } else {
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  const inputClass = 'w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4F46E5] transition bg-white'

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Nav */}
      <nav className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-screen-xl mx-auto px-6 flex items-center h-14 gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#4F46E5] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="font-bold text-[#111827] tracking-tight text-sm">HighRiskIntel</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-16">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#111827]">Get in touch</h1>
            <p className="text-[#6B7280] text-sm mt-2">Tell us about your business and we'll get back to you within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-10 text-center">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#10B981] text-2xl">✓</span>
              </div>
              <h2 className="text-lg font-bold text-[#111827] mb-2">Message sent</h2>
              <p className="text-sm text-[#6B7280]">We'll get back to you at <span className="font-medium text-[#111827]">{email}</span> within 24 hours.</p>
              <Link href="/" className="mt-6 inline-block text-sm text-[#4F46E5] hover:underline">
                Back to home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">Your name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" required className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">Email</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@company.com" required className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">Business name</label>
                <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Your business name" className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">Topic</label>
                <select value={topic} onChange={e => setTopic(e.target.value)} className={inputClass}>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">Message</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="Tell us what you need help with..." required className={`${inputClass} resize-none`} />
              </div>

              {error && <p className="text-sm text-[#EF4444]">{error}</p>}

              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="w-full bg-[#4F46E5] text-white rounded-xl py-3 text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : 'Send message'}
              </button>

              <p className="text-center text-xs text-[#9CA3AF]">
                Already have an account?{' '}
                <Link href="/signin" className="text-[#4F46E5] hover:underline">Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
