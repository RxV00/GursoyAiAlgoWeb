import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'

// Apply secure overrides to Supabase auth cookies for enhanced security
const isSupabaseCookie = (name: string) => name.startsWith('sb-') || name.includes('auth-token')

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Apply secure settings to Supabase auth cookies, preserve original options for app cookies
              const finalOptions = isSupabaseCookie(name) 
                ? { ...options, secure: true, sameSite: 'lax' as const }
                : options
              cookieStore.set(name, value, finalOptions)
            })
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}