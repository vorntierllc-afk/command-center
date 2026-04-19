'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const FIELDS = [
  'Chargeback ratio is rising',
  'Processor asked for a remediation plan',
  'Rolling reserve or payout hold',
  'Authorization rate dropped',
  'High-risk vertical / new processor',
]

export default function RiskAuditPage() {
  const supabase = createClient()
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    businessName: '',
    website: '',
    monthlyVolume: '',
    issue: FIELDS[0],
    message: '',
  })

  function update(key: keyof typeof form) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((current) => ({ ...current, [key]: event.target.value }))
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    const { error: insertError } = await supabase.from('inquiries').insert({
      user_id: user?.id ?? null,
      name: form.name,
      email: form.email,
      business_name: form.businessName,
      topic: 'Free Risk Audit',
      message: [
        `Website: ${form.website || 'Not provided'}`,
        `Monthly volume: ${form.monthlyVolume || 'Not provided'}`,
        `Main issue: ${form.issue}`,
        `Notes: ${form.message || 'None'}`,
      ].join('\n'),
    })

    if (insertError) {
      setError('Something went wrong. Please email support@highriskintel.com.')
      setSubmitting(false)
      return
    }

    setSubmitted(true)
    setSubmitting(false)
    router.push('/thank-you')
  }

  const inputClass = 'w-full rounded-xl border border-[#D5D9DF] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition focus:border-[#1E2A38]'

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#111111]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D5D9DF] bg-[#F7F7F8] text-sm font-semibold text-[#1E2A38]">HR</div>
            <div>
              <div className="text-sm font-semibold tracking-tight">HighRiskIntel</div>
              <div className="text-xs text-[#6B7280]">Free risk audit</div>
            </div>
          </Link>
          <Link href="/signin" className="text-sm font-medium text-[#6B7280] hover:text-[#111111]">Sign in</Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_460px]">
        <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Free audit</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-[#111111] lg:text-5xl">
            Find the chargeback and processor-risk issues to fix first.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#6B7280]">
            Send us the basics about your merchant account. We’ll review your situation and tell you what looks urgent: dispute ratio, refund timing, authorization movement, reserve pressure, or processor-risk signals.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ['What we check', 'Dispute ratio, refund timing, authorization trend, processor-risk context.'],
              ['Who it helps', 'High-risk merchants, agencies, subscription businesses, and operators under processor pressure.'],
              ['What you get', 'A prioritized action list so you know what to review, fix, or monitor first.'],
              ['No pressure', 'The audit is designed to start the conversation, not trap you in a sales call.'],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-5">
                <h2 className="text-base font-semibold text-[#111111]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-6">
          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ECFDF3] text-[#16A34A]">✓</div>
              <h2 className="mt-5 text-xl font-semibold text-[#111111]">Audit request received</h2>
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                We’ll review the account context and follow up at {form.email}.
              </p>
              <Link href="/" className="mt-6 inline-block text-sm font-medium text-[#1E2A38]">Back to home</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111111]">Name</label>
                <input value={form.name} onChange={update('name')} required className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111111]">Email</label>
                <input type="email" value={form.email} onChange={update('email')} required className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111111]">Business name</label>
                <input value={form.businessName} onChange={update('businessName')} required className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111111]">Website</label>
                <input value={form.website} onChange={update('website')} placeholder="https://..." className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111111]">Monthly processing volume</label>
                <input value={form.monthlyVolume} onChange={update('monthlyVolume')} placeholder="$50k, $250k, $1M..." className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111111]">Main issue</label>
                <select value={form.issue} onChange={update('issue')} className={inputClass}>
                  {FIELDS.map((field) => <option key={field}>{field}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111111]">What is happening?</label>
                <textarea value={form.message} onChange={update('message')} rows={4} className={`${inputClass} resize-none`} />
              </div>
              {error ? <p className="text-sm text-[#DC2626]">{error}</p> : null}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#1E2A38] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#16202C] disabled:opacity-60"
              >
                {submitting ? 'Sending...' : 'Request free audit'}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  )
}
