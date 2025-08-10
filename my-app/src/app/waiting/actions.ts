'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export type ResendState = { ok: boolean; error?: string }

export async function resendEmailVerification(): Promise<ResendState> {
  const cookieStore = await cookies()
  const supabase = await createClient()

  const signupEmail = cookieStore.get('signup_email')?.value
  const signupSession = cookieStore.get('signup_session')?.value
  
  if (!signupEmail || !signupSession) {
    return { ok: false, error: 'Session expired. Please sign up again.' }
  }

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