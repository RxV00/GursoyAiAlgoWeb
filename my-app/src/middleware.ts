import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Only run middleware on dashboard routes and auth routes
     * Public pages (/, /login, /signup) don't need middleware
     */
    '/dashboard/:path*',
    '/api/:path*',
    '/verify',
  ],
}