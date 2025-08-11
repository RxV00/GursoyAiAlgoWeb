'use server'

import { createClient } from '@/lib/supabase/server'
import { getPendingSignup, canResendEmail, recordEmailResend } from '@/lib/auth/session'
import { getSecureSessionCookie } from '@/lib/auth/cookies'

export type ResendState = { ok: boolean; error?: string }

export async function resendEmailVerification(): Promise<ResendState> {
  const supabase = await createClient()

  // Check for secure signup session
  const signupSessionId = await getSecureSessionCookie('signup-session')
  const pendingSignup = signupSessionId ? await getPendingSignup(signupSessionId) : null
  
  if (!pendingSignup || pendingSignup.used) {
    return { ok: false, error: 'Session expired. Please sign up again.' }
  }

  // Check server-side rate limit
  const canResend = await canResendEmail(pendingSignup.email)
  if (!canResend.allowed) {
    return { 
      ok: false, 
      error: `Please wait ${canResend.remainingSeconds} more seconds before requesting another verification email.` 
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: pendingSignup.email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm?next=/dashboard`,
    },
  })
  
  if (error) {
    return { ok: false, error: error.message }
  }
  
  // Record the resend
  await recordEmailResend(pendingSignup.email)
  
  return { ok: true }
}