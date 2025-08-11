import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Only apply secure overrides to our custom cookies, not Supabase auth cookies
const isSupabaseCookie = (name: string) => name.startsWith('sb-') || name.includes('auth-token')

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Apply secure settings only to non-Supabase cookies
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