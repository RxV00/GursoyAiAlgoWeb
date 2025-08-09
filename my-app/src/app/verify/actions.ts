'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export type ResendState = { ok: boolean; error?: string }

export async function resendEmailVerification(): Promise<ResendState> {
  const cookieStore = await cookies()
  const supabase = await createClient()

  // Use pending signup data if present; otherwise fallback to current user (if already created)
  const pendingRaw = cookieStore.get('pending_signup')?.value
  const pending = pendingRaw
    ? (JSON.parse(pendingRaw) as {
        firstName?: string
        lastName?: string
        email?: string
        password?: string
        phone_e164?: string
        phone?: string
        company?: string
        role?: string
        newsletter?: boolean
      })
    : null

  const emailFromPending = pending?.email
  const verifyToken = cookieStore.get('verify_token')?.value
  if (!verifyToken) return { ok: false, error: 'Verification window expired. Please sign up again.' }

  let email = emailFromPending
  if (!email) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    email = user?.email ?? undefined
  }

  if (!email) return { ok: false, error: 'No email available to send verification' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Create the account via signUp and trigger the email verification now
  const pass = pending?.password || Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  const { error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm?next=/dashboard`,
      data: pending || {},
    },
  })
  if (error) return { ok: false, error: error.message }

  return { ok: true }
}


