import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
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
  // Phone verification routes removed
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')

  // Unauthenticated users:
  // - dashboard -> login
  // - verify/phone -> require pending + token else redirect signup
  if (!user) {
    if (isDashboard) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    if (isVerify) {
      const hasPending = !!request.cookies.get('pending_signup')?.value
      const verifyToken = request.cookies.get('verify_token')?.value
      const issuedAtStr = request.cookies.get('verify_issued_at')?.value
      const issuedAt = issuedAtStr ? Number(issuedAtStr) : 0
      const isFresh = issuedAt > 0 && Date.now() - issuedAt < 1000 * 60 * 30
      if (!hasPending || !verifyToken || !isFresh) {
        const url = request.nextUrl.clone()
        url.pathname = '/signup'
        return NextResponse.redirect(url)
      }
    }
  }

  // Additional gate: allow /verify only if user just finished signup (cookie flag)
  // If authenticated already, allow verify only during onboarding (token present). Otherwise send to dashboard.
  if (user && isVerify) {
    const verifyToken = request.cookies.get('verify_token')?.value
    if (!verifyToken) {
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