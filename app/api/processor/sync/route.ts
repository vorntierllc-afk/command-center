/*
 * Multi-processor sync route for HighRiskIntel
 *
 * Run in Supabase SQL Editor if not already done:
 * -- alter table transactions add column if not exists processor text;
 * -- alter table transactions add column if not exists processor_txn_id text unique;
 * -- alter table merchants add column if not exists processor text;
 * -- alter table merchants add column if not exists avg_ticket numeric default 0;
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { scoreTransaction } from '@/lib/risk-engine/scorer'
import { generateAlerts } from '@/lib/alerts/generator'

const createClient_service = () => createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type SyncResult = Array<{
  amount: number
  currency: string
  country: string
  email?: string
  status: string
  disputed: boolean
  created_at: string
  processor_txn_id: string
}>

// ---------------------------------------------------------------------------
// STRIPE
// ---------------------------------------------------------------------------
async function syncStripe(secretKey: string): Promise<SyncResult> {
  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(secretKey, { apiVersion: '2025-08-27.basil' as any })
  const ninetyDaysAgo = Math.floor(Date.now() / 1000) - (90 * 24 * 60 * 60)

  const [chargesRes, disputesRes] = await Promise.all([
    stripe.charges.list({ limit: 100, created: { gte: ninetyDaysAgo } }),
    stripe.disputes.list({ limit: 100 })
  ])

  const disputedIds = new Set(disputesRes.data.map(d => d.charge as string))

  return chargesRes.data.map(charge => ({
    amount: charge.amount / 100,
    currency: charge.currency.toUpperCase(),
    country: charge.billing_details?.address?.country ?? 'US',
    email: charge.billing_details?.email ?? undefined,
    status: charge.status,
    disputed: disputedIds.has(charge.id),
    created_at: new Date(charge.created * 1000).toISOString(),
    processor_txn_id: charge.id,
  }))
}

// ---------------------------------------------------------------------------
// PAYPAL
// ---------------------------------------------------------------------------
async function syncPayPal(clientId: string, clientSecret: string): Promise<SyncResult> {
  // 1. Get access token
  const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials'
  })
  const { access_token } = await tokenRes.json()

  // 2. Get transactions (last 90 days)
  const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  const endDate = new Date().toISOString()

  const txnRes = await fetch(
    `https://api-m.paypal.com/v1/reporting/transactions?start_date=${startDate}&end_date=${endDate}&page_size=500`,
    { headers: { 'Authorization': `Bearer ${access_token}` } }
  )
  const { transaction_details } = await txnRes.json()

  // 3. Get disputes
  const dispRes = await fetch(
    'https://api-m.paypal.com/v1/customer/disputes?page_size=50',
    { headers: { 'Authorization': `Bearer ${access_token}` } }
  )
  const { items: disputes } = await dispRes.json()
  const disputedIds = new Set((disputes ?? []).map((d: any) => d.disputed_transactions?.[0]?.seller_transaction_id))

  return (transaction_details ?? [])
    .filter((t: any) => t.transaction_info?.transaction_amount?.value)
    .map((t: any) => ({
      amount: parseFloat(t.transaction_info.transaction_amount.value),
      currency: t.transaction_info.transaction_amount.currency_code ?? 'USD',
      country: t.payer_info?.country_code ?? 'US',
      email: t.payer_info?.email_address ?? undefined,
      status: t.transaction_info.transaction_status ?? 'unknown',
      disputed: disputedIds.has(t.transaction_info.transaction_id),
      created_at: t.transaction_info.transaction_initiation_date ?? new Date().toISOString(),
      processor_txn_id: t.transaction_info.transaction_id,
    }))
}

// ---------------------------------------------------------------------------
// AUTHORIZE.NET
// ---------------------------------------------------------------------------
async function syncAuthorizeNet(apiLoginId: string, transactionKey: string): Promise<SyncResult> {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)

  // Get settled transactions via getSettledBatchListRequest then getTransactionListRequest
  const batchRes = await fetch('https://api.authorize.net/xml/v1/request.api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      getSettledBatchListRequest: {
        merchantAuthentication: { name: apiLoginId, transactionKey },
        firstSettlementDate: ninetyDaysAgo.toISOString().split('T')[0],
        lastSettlementDate: new Date().toISOString().split('T')[0],
        includeStatistics: true
      }
    })
  })
  const batchData = await batchRes.json()
  const batches: any[] = batchData.batchList?.batch ?? []

  const transactions: SyncResult = []

  for (const batch of batches.slice(0, 10)) {
    const txnRes = await fetch('https://api.authorize.net/xml/v1/request.api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        getTransactionListRequest: {
          merchantAuthentication: { name: apiLoginId, transactionKey },
          batchId: batch.batchId
        }
      })
    })
    const txnData = await txnRes.json()
    const txns: any[] = txnData.transactions?.transaction ?? []

    for (const t of txns) {
      transactions.push({
        amount: parseFloat(t.settleAmount ?? t.submitTimeUTC ?? 0),
        currency: 'USD',
        country: t.customer?.country ?? 'US',
        email: t.customer?.email ?? undefined,
        status: t.transactionStatus ?? 'unknown',
        disputed: t.transactionStatus === 'chargedBack' || t.transactionStatus === 'refundSettledSuccessfully',
        created_at: t.submitTimeUTC ?? new Date().toISOString(),
        processor_txn_id: t.transId,
      })
    }
  }

  return transactions
}

// ---------------------------------------------------------------------------
// BRAINTREE
// NOTE: Requires `npm install braintree` — not currently in package.json.
// ---------------------------------------------------------------------------
async function syncBraintree(merchantId: string, publicKey: string, privateKey: string): Promise<SyncResult> {
  let braintree: any
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    braintree = await (new Function('m', 'return import(m)'))('braintree')
  } catch {
    throw new Error('Braintree package is not installed. Run: npm install braintree')
  }

  const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Production,
    merchantId,
    publicKey,
    privateKey,
  })

  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)

  const stream = gateway.transaction.search((search: any) => {
    search.createdAt().greaterThanOrEqualTo(ninetyDaysAgo)
  })

  const transactions: SyncResult = []
  await new Promise<void>((resolve, reject) => {
    stream.on('data', (txn: any) => {
      transactions.push({
        amount: parseFloat(txn.amount),
        currency: txn.currencyIsoCode ?? 'USD',
        country: txn.billing?.countryCodeAlpha2 ?? txn.customer?.countryCodeAlpha2 ?? 'US',
        email: txn.customer?.email ?? undefined,
        status: txn.status ?? 'unknown',
        disputed: txn.disputes?.length > 0,
        created_at: txn.createdAt?.toISOString() ?? new Date().toISOString(),
        processor_txn_id: txn.id,
      })
    })
    stream.on('end', resolve)
    stream.on('error', reject)
  })

  return transactions
}

// ---------------------------------------------------------------------------
// SQUARE
// ---------------------------------------------------------------------------
async function syncSquare(accessToken: string): Promise<SyncResult> {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()

  const [paymentsRes, disputesRes] = await Promise.all([
    fetch('https://connect.squareup.com/v2/payments?sort_order=DESC&limit=200', {
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Square-Version': '2024-11-20' }
    }),
    fetch('https://connect.squareup.com/v2/disputes?cursor=&limit=200', {
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Square-Version': '2024-11-20' }
    })
  ])

  const { payments } = await paymentsRes.json()
  const { disputes } = await disputesRes.json()
  const disputedIds = new Set((disputes ?? []).map((d: any) => d.disputed_payment?.payment_id))

  return (payments ?? [])
    .filter((p: any) => new Date(p.created_at) >= new Date(ninetyDaysAgo))
    .map((p: any) => ({
      amount: (p.amount_money?.amount ?? 0) / 100,
      currency: p.amount_money?.currency ?? 'USD',
      country: p.billing_address?.country ?? 'US',
      email: p.buyer_email_address ?? undefined,
      status: p.status?.toLowerCase() ?? 'unknown',
      disputed: disputedIds.has(p.id),
      created_at: p.created_at,
      processor_txn_id: p.id,
    }))
}

// ---------------------------------------------------------------------------
// NMI (Network Merchants)
// ---------------------------------------------------------------------------
async function syncNMI(securityKey: string): Promise<SyncResult> {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  const startDate = ninetyDaysAgo.toISOString().split('T')[0].replace(/-/g, '')
  const endDate = new Date().toISOString().split('T')[0].replace(/-/g, '')

  const res = await fetch('https://secure.nmi.com/api/query.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      security_key: securityKey,
      report_type: 'transaction',
      date_search: 'range',
      start_date: startDate,
      end_date: endDate,
    }).toString()
  })

  const text = await res.text()

  // NMI returns XML — parse it
  const transactions: SyncResult = []
  const txnMatches = text.match(/<transaction>([\s\S]*?)<\/transaction>/g) ?? []

  for (const txnXml of txnMatches) {
    const get = (tag: string) => txnXml.match(new RegExp(`<${tag}>(.*?)</${tag}>`))?.[1] ?? ''
    transactions.push({
      amount: parseFloat(get('amount') || '0'),
      currency: 'USD',
      country: get('billing_country') || 'US',
      email: get('email') || undefined,
      status: get('condition') || 'unknown',
      disputed: get('condition') === 'failed' || get('type') === 'chargeback',
      created_at: get('date_created') ? new Date(get('date_created')).toISOString() : new Date().toISOString(),
      processor_txn_id: get('transaction_id'),
    })
  }

  return transactions
}

// ---------------------------------------------------------------------------
// CREDENTIAL VALIDATORS — fast ping before full sync
// ---------------------------------------------------------------------------
async function validateStripe(secretKey: string): Promise<void> {
  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(secretKey, { apiVersion: '2025-08-27.basil' as any })
  await stripe.balance.retrieve() // throws if key is invalid
}

async function validatePayPal(clientId: string, clientSecret: string): Promise<void> {
  const res = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const json = await res.json()
  if (!json.access_token) throw new Error('Invalid PayPal credentials')
}

async function validateAuthorizeNet(apiLoginId: string, transactionKey: string): Promise<void> {
  const res = await fetch('https://api.authorize.net/xml/v1/request.api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      authenticateTestRequest: {
        merchantAuthentication: { name: apiLoginId, transactionKey },
      },
    }),
  })
  const data = await res.json()
  if (data.messages?.resultCode !== 'Ok') throw new Error('Invalid Authorize.net credentials')
}

async function validateSquare(accessToken: string): Promise<void> {
  const res = await fetch('https://connect.squareup.com/v2/merchants/me', {
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Square-Version': '2024-11-20' },
  })
  if (!res.ok) throw new Error('Invalid Square access token')
}

async function validateNMI(securityKey: string): Promise<void> {
  const res = await fetch('https://secure.nmi.com/api/query.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ security_key: securityKey, report_type: 'transaction', result_limit: '1' }).toString(),
  })
  const text = await res.text()
  if (text.includes('Authentication Failed') || text.includes('Invalid')) throw new Error('Invalid NMI security key')
}

// ---------------------------------------------------------------------------
// MAIN POST HANDLER
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { processor: string; credentials: Record<string, string> }
  const { processor, credentials } = body

  // Validate credentials first — fast check before committing to full sync
  try {
    switch (processor) {
      case 'stripe':
        await validateStripe(credentials.secret_key)
        break
      case 'paypal':
        await validatePayPal(credentials.client_id, credentials.client_secret)
        break
      case 'authorize_net':
        await validateAuthorizeNet(credentials.api_login_id, credentials.transaction_key)
        break
      case 'square':
        await validateSquare(credentials.access_token)
        break
      case 'nmi':
        await validateNMI(credentials.security_key)
        break
      // Braintree validation happens implicitly during sync
    }
  } catch (e: any) {
    return NextResponse.json({ error: `Invalid credentials: ${e.message}` }, { status: 400 })
  }

  let rawTransactions: SyncResult = []

  try {
    switch (processor) {
      case 'stripe':
        rawTransactions = await syncStripe(credentials.secret_key)
        break
      case 'paypal':
        rawTransactions = await syncPayPal(credentials.client_id, credentials.client_secret)
        break
      case 'authorize_net':
        rawTransactions = await syncAuthorizeNet(credentials.api_login_id, credentials.transaction_key)
        break
      case 'braintree':
        rawTransactions = await syncBraintree(credentials.merchant_id, credentials.public_key, credentials.private_key)
        break
      case 'square':
        rawTransactions = await syncSquare(credentials.access_token)
        break
      case 'nmi':
        rawTransactions = await syncNMI(credentials.security_key)
        break
      default:
        return NextResponse.json({ error: `Unsupported processor: ${processor}` }, { status: 400 })
    }
  } catch (e: any) {
    return NextResponse.json({ error: `Sync failed for ${processor}: ${e.message}` }, { status: 400 })
  }

  // Score each transaction
  const scored = rawTransactions.map(tx => {
    const { score, action, signals } = scoreTransaction({
      amount: tx.amount,
      country: tx.country,
      email: tx.email,
      created_at: tx.created_at,
      disputed: tx.disputed,
    })
    return { ...tx, risk_score: score, risk_action: action, risk_signals: signals }
  })

  // Save to transactions table
  const serviceSupabase = createClient_service()

  if (scored.length > 0) {
    await serviceSupabase.from('transactions').upsert(
      scored.map(tx => ({
        user_id: user.id,
        amount: tx.amount,
        currency: tx.currency,
        country: tx.country,
        email: tx.email,
        status: tx.status,
        disputed: tx.disputed,
        risk_score: tx.risk_score,
        risk_signals: tx.risk_signals,
        processor_txn_id: tx.processor_txn_id,
        processor,
        created_at: tx.created_at,
      })),
      { onConflict: 'processor_txn_id' }
    )
  }

  // Calculate metrics
  const total = scored.length
  const disputed = scored.filter(t => t.disputed).length
  const chargebackRate = total > 0 ? (disputed / total) * 100 : 0
  const totalVolume = scored.reduce((sum, t) => sum + t.amount, 0)
  const avgTicket = total > 0 ? totalVolume / total : 0

  // Update merchants
  await serviceSupabase.from('merchants').update({
    chargeback_rate: chargebackRate,
    total_volume: totalVolume,
    avg_ticket: avgTicket,
    onboard_method: 'processor',
    status: 'active',
    processor,
  }).eq('user_id', user.id)

  // Generate alerts
  await generateAlerts(user.id, chargebackRate, scored)

  return NextResponse.json({
    success: true,
    transactions_synced: total,
    chargeback_rate: chargebackRate,
    total_volume: totalVolume,
  })
}
