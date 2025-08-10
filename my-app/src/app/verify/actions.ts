'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export type ResendState = { ok: boolean; error?: string }

export async function autoResendVerification(email: string, sessionId: string): Promise<void> {
  const cookieStore = await cookies()
  const supabase = await createClient()
  
  const autoResendKey = `auto_resend_${sessionId}`
  
  // Check if auto-resend already happened for this session
  if (cookieStore.get(autoResendKey)?.value) {
    return // Already auto-resent for this session
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Attempt to resend verification email
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm?next=/dashboard`,
    },
  })

  // Mark as auto-resent regardless of success/failure to prevent spam
  cookieStore.set(autoResendKey, 'true', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 30, // 30 minutes
  })

  if (error) {
    console.warn('Auto-resend verification email failed:', error.message)
  }
}

export async function resendEmailVerification(): Promise<ResendState> {
  const cookieStore = await cookies()
  const supabase = await createClient()

  // Check for new signup session first
  const signupEmail = cookieStore.get('signup_email')?.value
  const signupSession = cookieStore.get('signup_session')?.value
  
  if (signupEmail && signupSession) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: signupEmail,
      options: {
        emailRedirectTo: `${siteUrl}/auth/confirm?next=/dashboard`,
      },
    })
    
    if (error) {
      return { ok: false, error: error.message }
    }
    
    return { ok: true }
  }

  // Fallback to legacy pending signup logic
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


