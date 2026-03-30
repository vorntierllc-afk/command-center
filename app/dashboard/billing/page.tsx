'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const TOPICS = [
  'Pricing & Plans',
  'Feature Request',
  'Technical Support',
  'Integration Help',
  'Account Issue',
  'Partnership',
  'Other',
]

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
}

export default function InquiryPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [topic, setTopic] = useState(TOPICS[0])
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email || '')
      setName(user.user_metadata?.full_name || '')
      const { data: m } = await supabase
        .from('merchants')
        .select('business_name')
        .eq('user_id', user.id)
        .single()
      if (m?.business_name) setBusinessName(m.business_name)
      setLoading(false)
    }
    load()
  }, [])

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
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Contact Us</h1>
        <p className="text-[#6B7280] text-sm mt-1">Have a question or need help? We typically respond within 24 hours.</p>
      </div>

      {submitted ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-10 text-center">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-[#10B981] text-2xl">✓</span>
          </div>
          <h2 className="text-lg font-bold text-[#111827] mb-2">Message sent</h2>
          <p className="text-sm text-[#6B7280]">We received your inquiry and will get back to you at <span className="font-medium text-[#111827]">{email}</span> within 24 hours.</p>
          <button
            onClick={() => { setSubmitted(false); setMessage('') }}
            className="mt-6 text-sm text-[#4F46E5] hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">Your name</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Smith"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">Email</label>
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@company.com"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">Business name</label>
                <input
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="Your business name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">Topic</label>
                <select
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className={inputClass}
                >
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">Message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Tell us what you need help with..."
                  required
                  className={`${inputClass} resize-none`}
                />
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
            </>
          )}
        </form>
      )}

      {/* Contact info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Email', value: 'support@highriskintel.com' },
          { label: 'Response time', value: 'Within 24 hours' },
          { label: 'Priority support', value: 'Pro & Agency plans' },
        ].map(item => (
          <div key={item.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <p className="text-xs text-[#9CA3AF] mb-1">{item.label}</p>
            <p className="text-sm font-medium text-[#111827]">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
