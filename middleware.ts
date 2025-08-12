import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/trips', '/profile', '/search']

// Routes that should redirect to dashboard if user is authenticated
const authRoutes = ['/auth/signin', '/auth/signup', '/auth/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Check if it's an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // For now, we'll allow all routes since we're using client-side auth with Appwrite
  // In a production app, you might want to implement server-side auth checking
  
  // If user is on auth page and already authenticated, redirect to dashboard
  // This would require server-side session checking with Appwrite
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
