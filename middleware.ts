import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PROTECTED = ['/dashboard', '/onboarding']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const path = request.nextUrl.pathname

  const isProtected = PROTECTED.some(p => path.startsWith(p))
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }
  if ((path === '/signin' || path === '/signup') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  // Prevent completed merchants from being stuck in onboarding
  // (onboarding page itself handles the redirect-to-dashboard if already done)
  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
