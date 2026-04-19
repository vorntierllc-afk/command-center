'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function ChargebackRateCalculatorPage() {
  const [transactions, setTransactions] = useState('10000')
  const [chargebacks, setChargebacks] = useState('85')
  const [refunds, setRefunds] = useState('240')

  const result = useMemo((): { chargebackRate: number; refundRate: number; status: 'safe' | 'warning' | 'critical' } => {
    const tx = Math.max(Number(transactions) || 0, 0)
    const cb = Math.max(Number(chargebacks) || 0, 0)
    const rf = Math.max(Number(refunds) || 0, 0)
    const chargebackRate = tx > 0 ? (cb / tx) * 100 : 0
    const refundRate = tx > 0 ? (rf / tx) * 100 : 0
    const status = chargebackRate >= 1 ? 'critical' : chargebackRate >= 0.65 ? 'warning' : 'safe'
    return { chargebackRate, refundRate, status }
  }, [transactions, chargebacks, refunds])

  const statusCopy = {
    safe: {
      label: 'Monitor',
      color: '#16A34A',
      text: 'Your rate is below common monitoring ranges, but trend direction still matters.',
    },
    warning: {
      label: 'Review',
      color: '#F59E0B',
      text: 'Your rate deserves review. Look at refund timing, descriptor confusion, and repeat dispute causes.',
    },
    critical: {
      label: 'Urgent',
      color: '#DC2626',
      text: 'Your rate may create processor concern. Build a remediation plan and review the account immediately.',
    },
  }[result.status]

  const inputClass = 'w-full rounded-xl border border-[#D5D9DF] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition focus:border-[#1E2A38]'

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#111111]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D5D9DF] bg-[#F7F7F8] text-sm font-semibold text-[#1E2A38]">HR</div>
            <div>
              <div className="text-sm font-semibold tracking-tight">HighRiskIntel</div>
              <div className="text-xs text-[#6B7280]">Chargeback rate calculator</div>
            </div>
          </Link>
          <Link href="/risk-audit" className="rounded-xl bg-[#1E2A38] px-4 py-2.5 text-sm font-medium text-white">Free risk audit</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Free tool</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] lg:text-5xl">Chargeback rate calculator</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#6B7280]">
              Calculate your current chargeback ratio and refund rate. Use this as a quick first check before requesting a full risk audit.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Monthly transactions</label>
                <input value={transactions} onChange={(e) => setTransactions(e.target.value)} inputMode="numeric" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Monthly chargebacks</label>
                <input value={chargebacks} onChange={(e) => setChargebacks(e.target.value)} inputMode="numeric" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Monthly refunds</label>
                <input value={refunds} onChange={(e) => setRefunds(e.target.value)} inputMode="numeric" className={inputClass} />
              </div>
            </div>
          </div>

          <aside className="rounded-[24px] border border-[#E5E7EB] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Result</p>
            <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-5">
              <p className="text-sm font-medium text-[#6B7280]">Chargeback rate</p>
              <p className="mt-2 text-5xl font-semibold tracking-[-0.04em]">{result.chargebackRate.toFixed(2)}%</p>
              <div className="mt-4 inline-flex rounded-full px-3 py-1 text-sm font-medium text-white" style={{ backgroundColor: statusCopy.color }}>
                {statusCopy.label}
              </div>
              <p className="mt-4 text-sm leading-6 text-[#6B7280]">{statusCopy.text}</p>
            </div>

            <div className="mt-4 rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <p className="text-sm font-medium text-[#6B7280]">Refund rate</p>
              <p className="mt-2 text-3xl font-semibold">{result.refundRate.toFixed(2)}%</p>
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">Refund timing can be just as important as refund volume.</p>
            </div>

            <Link href="/risk-audit" className="mt-5 block rounded-xl bg-[#1E2A38] px-4 py-3 text-center text-sm font-medium text-white">
              Get a free account audit
            </Link>
          </aside>
        </section>

        <section className="mt-8 rounded-[24px] border border-[#E5E7EB] bg-white p-8">
          <h2 className="text-2xl font-semibold tracking-tight">How to use this number</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ['Below 0.65%', 'Keep monitoring trend direction, refund timing, and dispute reasons.'],
              ['0.65% to 1.00%', 'Review the account and identify whether disputes are tied to product, descriptor, fulfillment, or traffic source.'],
              ['Above 1.00%', 'Treat this as urgent. Build a remediation plan and review processor-risk signals immediately.'],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-5">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">{copy}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
