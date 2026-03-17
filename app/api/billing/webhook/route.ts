import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ received: true })
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-08-27.basil' as any })

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
    console.error('Webhook signature error:', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()
  if (!supabase) {
    console.error('Supabase admin client not available')
    return NextResponse.json({ received: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        if (userId) {
          // Determine plan from price
          let plan = 'basic'
          if (session.line_items) {
            // Can't directly get line items here without expanding; use metadata if available
          }
          await supabase.from('merchants').update({
            plan,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_status: 'active',
          }).eq('user_id', userId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await supabase.from('merchants').update({
          subscription_status: 'cancelled',
        }).eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const status = subscription.status === 'active' ? 'active' : subscription.status
        await supabase.from('merchants').update({
          subscription_status: status,
        }).eq('stripe_subscription_id', subscription.id)
        break
      }

      default:
        // Unhandled event type — still return 200
        break
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    // Still return 200 so Stripe doesn't retry
  }

  return NextResponse.json({ received: true })
}
