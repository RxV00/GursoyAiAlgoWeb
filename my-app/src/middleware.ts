import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Run middleware on dashboard routes, auth routes, and login/signup for redirect guard
     */
    '/dashboard/:path*',
    '/api/:path*',
    '/verify',
    '/login',
    '/signup',
  ],
}