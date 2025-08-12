'use server'

import { createClient } from '@/lib/supabase/server'
import { getPendingSignup, canResendEmail, recordEmailResend } from '@/lib/auth/session'
import { getSecureSessionCookie, setSecureSessionCookie } from '@/lib/auth/cookies'
import { env } from '@/lib/env'

export type ResendState = { ok: boolean; error?: string }

export async function autoResendVerification(email: string, sessionId: string): Promise<void> {
  const supabase = await createClient()
  
  const autoResendKey = `auto-resend-${sessionId.slice(-8)}`
  
  // Check if auto-resend already happened for this session
  if (await getSecureSessionCookie(autoResendKey)) {
    return // Already auto-resent for this session
  }

  // Check server-side rate limit
  const canResend = await canResendEmail(email)
  if (!canResend.allowed) {
    console.warn(`Auto-resend blocked: must wait ${canResend.remainingSeconds} more seconds`)
    return
  }

  const siteUrl = env.NEXT_PUBLIC_SITE_URL

  // Attempt to resend verification email
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm?next=/dashboard`,
    },
  })

  // Record the resend attempt
  if (!error) {
    await recordEmailResend(email)
  }

  // Mark as auto-resent regardless of success/failure to prevent spam
  await setSecureSessionCookie(autoResendKey, 'true', 60 * 30)

  if (error) {
    console.warn('Auto-resend verification email failed:', error.message)
  }
}

export async function resendEmailVerification(): Promise<ResendState> {
  const supabase = await createClient()

  // Check for new signup session first
  const signupSessionId = await getSecureSessionCookie('signup-session')
  const pendingSignup = signupSessionId ? await getPendingSignup(signupSessionId) : null
  
  if (pendingSignup && !pendingSignup.used) {
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

  // No valid session found
  return { ok: false, error: 'Verification session expired. Please sign up again.' }
}


