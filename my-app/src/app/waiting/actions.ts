'use server'

import { createClient } from '@/lib/supabase/server'
import { getPendingSignup, canResendEmail, recordEmailResend } from '@/lib/auth/session'
import { env } from '@/lib/env'

export type ResendState = { ok: boolean; error?: string }

export async function resendEmailVerification(): Promise<ResendState> {
  const supabase = await createClient()

  // Check for signup session from cookie
  const pendingSignup = await getPendingSignup()
  
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

  const siteUrl = env.NEXT_PUBLIC_SITE_URL
  
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