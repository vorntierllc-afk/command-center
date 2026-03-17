import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { scoreTransaction } from '@/lib/risk-engine/scorer'
import * as crypto from 'crypto'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function encryptKey(key: string): string {
  const encKey = (process.env.ENCRYPTION_KEY || '0'.repeat(64)).slice(0, 64).padEnd(64, '0')
  const keyBuffer = Buffer.from(encKey, 'hex')
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv)
  const encrypted = Buffer.concat([cipher.update(key, 'utf8'), cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

interface RawTransaction {
  tx_id: string
  amount: number
  currency: string
  country: string
  status: string
  disputed: boolean
  email: string
  created_at: string
}

async function pullStripeTransactions(secretKey: string): Promise<RawTransaction[]> {
  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(secretKey)
    const ninetyDaysAgo = Math.floor(Date.now() / 1000) - 90 * 24 * 3600
    const charges = await stripe.charges.list({ limit: 100, created: { gte: ninetyDaysAgo } })
    const disputes = await stripe.disputes.list({ limit: 100 })
    const disputedIds = new Set(disputes.data.map(d => d.charge as string))
    return charges.data.map(c => ({
      tx_id: c.id,
      amount: c.amount / 100,
      currency: c.currency.toUpperCase(),
      country: c.billing_details?.address?.country || 'US',
      status: c.status,
      disputed: disputedIds.has(c.id),
      email: c.billing_details?.email || '',
      created_at: new Date(c.created * 1000).toISOString(),
    }))
  } catch {
    return []
  }
}

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

async function generateAlerts(
  supabase: SupabaseClient,
  merchantId: string,
  userId: string,
  chargebackRate: number,
  highRiskCount: number
) {
  const alerts: Array<{ merchant_id: string; user_id: string; type: string; message: string; read: boolean }> = []
  const rate = chargebackRate * 100
  if (rate > 1.8) {
    alerts.push({
      merchant_id: merchantId,
      user_id: userId,
      type: 'critical',
      message: `Your chargeback rate is ${rate.toFixed(2)}% — above Visa's 1.8% termination threshold. Immediate action required.`,
      read: false
    })
  } else if (rate > 1.0) {
    alerts.push({
      merchant_id: merchantId,
      user_id: userId,
      type: 'warning',
      message: `Your chargeback rate is ${rate.toFixed(2)}% — approaching the 1.0% early warning threshold.`,
      read: false
    })
  }
  if (highRiskCount > 0) {
    alerts.push({
      merchant_id: merchantId,
      user_id: userId,
      type: 'warning',
      message: `${highRiskCount} high-risk transaction${highRiskCount > 1 ? 's' : ''} detected and flagged for review.`,
      read: false
    })
  }
  if (alerts.length > 0) await supabase.from('alerts').insert(alerts)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { processor, credentials } = await request.json() as { processor: string; credentials: Record<string, string> }

  const { data: merchant } = await supabase.from('merchants').select('id').eq('user_id', user.id).single()
  if (!merchant) return NextResponse.json({ error: 'Merchant not found' }, { status: 404 })

  // Encrypt and save credentials
  const encryptedCreds: Record<string, string> = {}
  for (const [k, v] of Object.entries(credentials)) {
    encryptedCreds[k] = encryptKey(v)
  }
  await supabase.from('processor_connections').upsert({
    merchant_id: merchant.id,
    user_id: user.id,
    processor,
    encrypted_credentials: encryptedCreds,
    connected_at: new Date().toISOString()
  }).then(() => {}, () => {})

  // Pull transactions
  let rawTxs: RawTransaction[] = []
  if (processor === 'Stripe' && credentials.secretKey) {
    rawTxs = await pullStripeTransactions(credentials.secretKey)
  }

  // Score each transaction and save
  const scoredTxs = rawTxs.map(tx => {
    const { score, action, signals } = scoreTransaction({
      amount: tx.amount,
      country: tx.country,
      email: tx.email,
      disputed: tx.disputed,
      created_at: tx.created_at,
    })
    return { ...tx, risk_score: score, risk_signals: signals, recommended_action: action }
  })

  if (scoredTxs.length > 0) {
    await supabase.from('transactions').insert(
      scoredTxs.map(tx => ({
        merchant_id: merchant.id,
        tx_id: tx.tx_id,
        amount: tx.amount,
        currency: tx.currency,
        country: tx.country,
        status: tx.status,
        disputed: tx.disputed,
        email: tx.email,
        risk_score: tx.risk_score,
        risk_signals: tx.risk_signals,
        created_at: tx.created_at,
      }))
    )
  }

  // Calculate metrics
  const total = scoredTxs.length
  const disputed = scoredTxs.filter(t => t.disputed).length
  const chargeback_rate = total > 0 ? disputed / total : 0
  const total_volume = scoredTxs.reduce((s, t) => s + t.amount, 0)
  const avg_ticket = total > 0 ? total_volume / total : 0
  const high_risk = scoredTxs.filter(t => t.risk_score >= 80)

  // AI analysis
  let aiAnalysis: Record<string, unknown> = {}
  try {
    const txSummary = `Total transactions: ${total}, Disputed: ${disputed}, Chargeback rate: ${(chargeback_rate * 100).toFixed(2)}%, Total volume: $${total_volume.toFixed(2)}, Avg ticket: $${avg_ticket.toFixed(2)}, High-risk transactions: ${high_risk.length}, Countries: ${[...new Set(scoredTxs.map(t => t.country))].join(', ')}`
    const resp = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `You are a payment risk analyst. Analyze this merchant's transaction data and return ONLY a valid JSON object with no markdown or explanation.\n\nData: ${txSummary}\n\nReturn: {"total_volume":number,"chargeback_rate":number,"dispute_count":number,"total_transactions":number,"avg_ticket_size":number,"top_risk_factors":["max 5 strings"],"recommended_actions":["max 5 actionable strings"],"mid_risk_level":"low|moderate|high|critical","summary":"2-3 sentences","biggest_threat":"single most important fix"}`
      }]
    })
    const text = resp.content[0].type === 'text' ? resp.content[0].text : ''
    const match = text.match(/\{[\s\S]*\}/)
    if (match) aiAnalysis = JSON.parse(match[0])
  } catch (e) {
    console.error('AI analysis error', e)
    aiAnalysis = {
      chargeback_rate,
      total_transactions: total,
      summary: `Synced ${total} transactions from ${processor}.`,
      biggest_threat: high_risk.length > 0 ? 'High-risk transactions detected' : 'Monitor chargeback rate'
    }
  }

  // Update merchant
  await supabase.from('merchants').update({
    chargeback_rate,
    total_volume,
    avg_ticket,
    ai_analysis: aiAnalysis,
    biggest_threat: (aiAnalysis.biggest_threat as string) || null,
    top_risk_factors: (aiAnalysis.top_risk_factors as string[]) || [],
    recommended_actions: (aiAnalysis.recommended_actions as string[]) || [],
    mid_risk_level: (aiAnalysis.mid_risk_level as string) || 'unknown',
    status: 'active',
    onboard_method: 'api',
  }).eq('user_id', user.id)

  await generateAlerts(supabase, merchant.id, user.id, chargeback_rate, high_risk.length)

  return NextResponse.json({ analysis: aiAnalysis, transactions_synced: total })
}
