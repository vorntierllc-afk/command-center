import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { scoreTransaction } from '@/lib/risk-engine/scorer'
import { generateAlerts } from '@/lib/alerts/generator'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json() as { user_id?: string; processor: string; secret_key: string }
    const { processor, secret_key } = body

    if (!secret_key) return NextResponse.json({ error: 'secret_key is required' }, { status: 400 })

    // Init Stripe with provided key
    const stripe = new Stripe(secret_key, { apiVersion: '2025-08-27.basil' })

    // Pull last 90 days of charges
    const ninetyDaysAgo = Math.floor(Date.now() / 1000) - 90 * 24 * 3600
    const charges = await stripe.charges.list({ limit: 100, created: { gte: ninetyDaysAgo } })

    // Pull disputes
    const disputes = await stripe.disputes.list({ limit: 100 })
    const disputedIds = new Set(disputes.data.map(d => d.charge as string))

    // Score each transaction
    const scoredTransactions = charges.data.map(charge => {
      const amount = charge.amount / 100
      const country = charge.billing_details?.address?.country ?? 'US'
      const email = charge.billing_details?.email ?? undefined
      const created_at = new Date(charge.created * 1000).toISOString()
      const disputed = disputedIds.has(charge.id)

      const { score, action, signals } = scoreTransaction({
        amount,
        country,
        email,
        created_at,
        disputed,
      })

      return {
        user_id: user.id,
        amount,
        currency: charge.currency.toUpperCase(),
        country,
        email,
        status: charge.status,
        disputed,
        risk_score: score,
        risk_signals: signals,
        risk_action: action,
        created_at,
        stripe_charge_id: charge.id,
      }
    })

    // Save transactions to Supabase (upsert by stripe_charge_id to avoid duplicates)
    if (scoredTransactions.length > 0) {
      const rows = scoredTransactions.map(tx => ({
        user_id: tx.user_id,
        amount: tx.amount,
        currency: tx.currency,
        country: tx.country,
        email: tx.email,
        status: tx.status,
        disputed: tx.disputed,
        risk_score: tx.risk_score,
        risk_signals: tx.risk_signals,
        created_at: tx.created_at,
      }))
      await supabase.from('transactions').insert(rows)
    }

    // Calculate metrics
    const total_transactions = scoredTransactions.length
    const disputed_count = scoredTransactions.filter(t => t.disputed).length
    const chargeback_rate = total_transactions > 0 ? (disputed_count / total_transactions) * 100 : 0
    const total_volume = scoredTransactions.reduce((s, t) => s + t.amount, 0)
    const avg_ticket = total_transactions > 0 ? total_volume / total_transactions : 0

    // Update merchants table
    await supabase.from('merchants').update({
      chargeback_rate,
      total_volume,
      avg_ticket,
      onboard_method: 'processor',
      status: 'active',
    }).eq('user_id', user.id)

    // Generate alerts
    await generateAlerts(user.id, chargeback_rate, scoredTransactions.map(t => ({
      risk_score: t.risk_score,
      country: t.country,
    })))

    return NextResponse.json({
      success: true,
      transactions_synced: total_transactions,
      chargeback_rate,
    })
  } catch (err) {
    console.error('Processor sync error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
