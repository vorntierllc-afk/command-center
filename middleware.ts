import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

const protectedPrefixes = [
  "/onboarding",
  "/api/onboarding"
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const needsAuth = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  updateSupabaseSession(request);

  if (!needsAuth) {
    return NextResponse.next();
  }

  // Basic cookie presence check (Edge Runtime compatible).
  // Full cryptographic verification happens in server-side route handlers.
  const sessionCookie = request.cookies.get("highriskintel_session")?.value;
  if (!sessionCookie || !sessionCookie.includes(".")) {
    const url = new URL("/signin", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/api/:path*"]
};
