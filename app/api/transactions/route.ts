import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const HIGH_RISK_COUNTRIES = ['NG', 'RU', 'UA', 'BY', 'IR', 'KP', 'SY', 'VE', 'MM', 'CU']
const DISPOSABLE_DOMAINS = ['mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email', 'yopmail.com']

function scoreTransaction(amount: number, country: string, email: string, disputed: boolean): number {
  let score = 0
  if (HIGH_RISK_COUNTRIES.includes((country || '').toUpperCase())) score += 40
  if (amount > 500) score += 20
  else if (amount > 200) score += 10
  if (disputed) score += 30
  const domain = (email || '').split('@')[1] || ''
  if (DISPOSABLE_DOMAINS.includes(domain.toLowerCase())) score += 15
  // Off-hours (midnight to 5am)
  const hour = new Date().getHours()
  if (hour >= 0 && hour < 5) score += 10
  return Math.min(100, score)
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 0)
    const limit = Number(url.searchParams.get('limit') || 25)
    const riskFilter = url.searchParams.get('risk_filter')
    const search = url.searchParams.get('search') || ''

    const { data: merchant } = await supabase
      .from('merchants')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!merchant) return NextResponse.json({ data: [], total: 0 })

    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('merchant_id', merchant.id)
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1)

    if (riskFilter === 'high') query = query.gte('risk_score', 80)
    else if (riskFilter === 'medium') query = query.gte('risk_score', 50).lt('risk_score', 80)
    else if (riskFilter === 'disputed') query = query.eq('disputed', true)

    if (search) query = query.ilike('email', `%${search}%`)

    const { data, count } = await query
    return NextResponse.json({ data: data || [], total: count || 0 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json() as {
      amount: number
      country?: string
      email?: string
      disputed?: boolean
      card_network?: string
      description?: string
      currency?: string
    }

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 })
    }

    const { data: merchant } = await supabase
      .from('merchants')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!merchant) return NextResponse.json({ error: 'Merchant not found' }, { status: 404 })

    const risk_score = scoreTransaction(body.amount, body.country || '', body.email || '', body.disputed || false)
    const risk_signals: string[] = []
    if (HIGH_RISK_COUNTRIES.includes((body.country || '').toUpperCase())) risk_signals.push('high_risk_country')
    if (body.amount > 500) risk_signals.push('high_value')
    if (body.disputed) risk_signals.push('disputed')

    const tx_id = `TXN-${Date.now().toString(36).toUpperCase()}`

    const { data: newTx, error } = await supabase
      .from('transactions')
      .insert({
        merchant_id: merchant.id,
        user_id: user.id,
        tx_id,
        amount: body.amount,
        currency: body.currency || 'USD',
        country: body.country || 'US',
        email: body.email || '',
        disputed: body.disputed || false,
        risk_score,
        risk_signals,
        status: body.disputed ? 'disputed' : 'active',
        card_network: body.card_network || '',
        description: body.description || '',
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Recalculate and update merchant chargeback_rate
    const { data: allTxs } = await supabase
      .from('transactions')
      .select('disputed')
      .eq('merchant_id', merchant.id)

    if (allTxs && allTxs.length > 0) {
      const total = allTxs.length
      const chargebacks = allTxs.filter(t => t.disputed).length
      const cbRate = chargebacks / total  // stored as fraction

      const { data: allAmounts } = await supabase
        .from('transactions')
        .select('amount')
        .eq('merchant_id', merchant.id)
      const totalVolume = (allAmounts || []).reduce((s, t) => s + t.amount, 0)

      await supabase.from('merchants').update({
        chargeback_rate: cbRate,
        total_volume: totalVolume,
        status: 'active',
      }).eq('id', merchant.id)

      // Generate alert if crossing thresholds
      const cbPercent = cbRate * 100
      if (cbPercent >= 1.8) {
        await supabase.from('alerts').insert({
          user_id: user.id,
          type: 'critical',
          message: `Chargeback rate is ${cbPercent.toFixed(2)}% — above Visa's 1.8% termination threshold. Immediate action required.`,
          read: false,
        })
      } else if (cbPercent >= 1.0) {
        await supabase.from('alerts').insert({
          user_id: user.id,
          type: 'warning',
          message: `Chargeback rate is ${cbPercent.toFixed(2)}% — approaching the 1.0% early warning threshold.`,
          read: false,
        })
      }
    }

    return NextResponse.json({ success: true, transaction: newTx, risk_score })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
