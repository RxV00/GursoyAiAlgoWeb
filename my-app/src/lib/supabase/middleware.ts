import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '@/lib/env'

// Apply secure overrides to Supabase auth cookies for enhanced security
const isSupabaseCookie = (name: string) => name.startsWith('sb-') || name.includes('auth-token')

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            // Apply secure settings to Supabase auth cookies, preserve original options for app cookies
            const finalOptions = isSupabaseCookie(name)
              ? { ...options, secure: true, sameSite: 'lax' as const }
              : options
            supabaseResponse.cookies.set(name, value, finalOptions)
          })
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect sensitive routes; public pages remain accessible
  // Gatekeeping rules
  const isVerify = request.nextUrl.pathname.startsWith('/verify')
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isPricing = request.nextUrl.pathname === '/pricing'
  const isLogin = request.nextUrl.pathname === '/login'
  const isSignup = request.nextUrl.pathname === '/signup'

  // Unauthenticated users:
  // - dashboard/pricing -> login with next parameter
  // - pricing APIs -> 401 (handled in API)
  // - verify/phone -> require pending + token else redirect signup
  if (!user) {
    if (isDashboard || isPricing) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    if (isVerify) {
      // Check for secure session cookie
      const signupSessionId = request.cookies.get('__Host-ssid')?.value
      if (!signupSessionId) {
        const url = request.nextUrl.clone()
        url.pathname = '/signup'
        return NextResponse.redirect(url)
      }
      // Note: Full server-side validation would require async lookup here
    }
  }

  // Redirect authenticated users away from login/signup pages
  if (user && (isLogin || isSignup)) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    const response = NextResponse.redirect(url)
    response.headers.set('Cache-Control', 'no-store')
    return response
  }

  // Additional gate: allow /verify only if user just finished signup (session present)
  // If authenticated already, allow verify only during onboarding. Otherwise send to dashboard.
  if (user && isVerify) {
    const signupSession = request.cookies.get('__Host-ssid')?.value
    if (!signupSession) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}