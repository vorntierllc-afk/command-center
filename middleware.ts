import { NextResponse, type NextRequest } from "next/server";
import { decodeSession } from "@/lib/server/session";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

const protectedPrefixes = [
  "/dashboard",
  "/onboarding",
  "/api/dashboard",
  "/api/transactions",
  "/api/alerts",
  "/api/reports"
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const needsAuth = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  updateSupabaseSession(request);

  if (!needsAuth) {
    return NextResponse.next();
  }

  const session = decodeSession(request.cookies.get("highriskintel_session")?.value);
  if (!session) {
    const url = new URL("/signin", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/api/:path*"]
};
