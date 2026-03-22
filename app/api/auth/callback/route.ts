import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Ensure merchant row exists (fallback if trigger didn't fire)
        const { data: merchant } = await supabase
          .from('merchants')
          .select('status')
          .eq('user_id', user.id)
          .single()

        if (!merchant) {
          await supabase.from('merchants').insert({
            user_id: user.id,
            business_name: user.user_metadata?.full_name || 'My Business',
            status: 'onboarding',
          })
          return NextResponse.redirect(new URL('/onboarding', request.url))
        }

        if (merchant.status === 'active') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }
  }

  return NextResponse.redirect(new URL('/signin?error=auth_failed', request.url))
}
