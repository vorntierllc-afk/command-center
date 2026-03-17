import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-08-27.basil' as any })
    const PRICE_IDS: Record<string, string> = {
      basic: process.env.STRIPE_PRICE_BASIC ?? '',
      pro: process.env.STRIPE_PRICE_PRO ?? '',
      agency: process.env.STRIPE_PRICE_AGENCY ?? '',
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { plan } = await request.json() as { plan: string }
    const priceId = PRICE_IDS[plan]
    if (!priceId) return NextResponse.json({ error: 'Invalid plan or price not configured' }, { status: 400 })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_URL ?? 'https://highriskintel.com'}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL ?? 'https://highriskintel.com'}/dashboard`,
      metadata: { user_id: user.id },
      customer_email: user.email,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Create checkout error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
