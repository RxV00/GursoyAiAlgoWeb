import VerifyChoiceClient from './VerifyChoiceClient'
import { getPendingSignup } from '@/lib/auth/session'
import { getSecureSessionCookie } from '@/lib/auth/cookies'
import { VerifyPageClient } from './VerifyPageClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function VerifyChoicePage() {
  // Check for new signup session
  const signupSessionId = await getSecureSessionCookie('signup-session')
  const pendingSignup = signupSessionId ? await getPendingSignup(signupSessionId) : null

  if (!pendingSignup || pendingSignup.used) {
    // No valid signup session, redirect to signup
    redirect('/signup')
  }

  // Auto-resend verification email once for fresh signups
  const autoResendKey = `auto-resend-${signupSessionId?.slice(-8)}`
  const hasAutoResent = await getSecureSessionCookie(autoResendKey)

  return (
    <>
      {!hasAutoResent && <VerifyPageClient email={pendingSignup.email} sessionId={signupSessionId!} />}
      <VerifyChoiceClient email={pendingSignup.email} />
    </>
  )
}

