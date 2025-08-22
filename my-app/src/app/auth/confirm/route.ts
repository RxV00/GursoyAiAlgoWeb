import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { markSignupUsed } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // Handle code-based verification (most common)
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Mark signup session as used to clean up
      await markSignupUsed()
      redirect(next)
    }
  }

  // Handle token_hash-based verification (fallback)
  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // Mark signup session as used to clean up
      await markSignupUsed()
      redirect(next)
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/auth/auth-code-error')
}