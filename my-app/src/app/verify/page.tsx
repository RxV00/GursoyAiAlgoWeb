import VerifyChoiceClient from './VerifyChoiceClient'
import { autoResendVerification } from './actions'
import { getPendingSignup } from '@/lib/auth/session'
import { getSecureSessionCookie } from '@/lib/auth/cookies'

export default async function VerifyChoicePage() {
  // Check for new signup session
  const signupSessionId = await getSecureSessionCookie('signup-session')
  const pendingSignup = signupSessionId ? await getPendingSignup(signupSessionId) : null
  
  if (!pendingSignup || pendingSignup.used) {
    return null
  }

  // Auto-resend verification email once for fresh signups
  const autoResendKey = `auto-resend-${signupSessionId?.slice(-8)}`
  const hasAutoResent = await getSecureSessionCookie(autoResendKey)
  
  if (!hasAutoResent) {
    // Perform auto-resend server-side
    await autoResendVerification(pendingSignup.email, signupSessionId!)
  }

  return <VerifyChoiceClient email={pendingSignup.email} />
}

