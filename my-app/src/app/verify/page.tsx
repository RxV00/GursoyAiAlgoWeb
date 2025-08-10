'use server'

import VerifyChoiceClient from './VerifyChoiceClient'
import { cookies } from 'next/headers'
import { autoResendVerification } from './actions'

export default async function VerifyChoicePage() {
  const cookieStore = await cookies()
  
  // Check for new signup session
  const signupSession = cookieStore.get('signup_session')?.value
  const signupEmail = cookieStore.get('signup_email')?.value
  const signupTimestamp = cookieStore.get('signup_timestamp')?.value
  
  // Check if this is a fresh signup (within last 30 minutes)
  const isFreshSignup = signupTimestamp && 
    (Date.now() - Number(signupTimestamp)) < (30 * 60 * 1000)
  
  if (!signupSession || !signupEmail || !isFreshSignup) {
    // Fall back to old pending signup logic for backward compatibility
    const pendingRaw = cookieStore.get('pending_signup')?.value
    const issuedAtStr = cookieStore.get('verify_issued_at')?.value
    const issuedAt = issuedAtStr ? Number(issuedAtStr) : 0
    const isFresh = issuedAt > 0 && Date.now() - issuedAt < 1000 * 60 * 30
    
    if (!pendingRaw || !isFresh) {
      return null
    }
    
    const pending = pendingRaw ? JSON.parse(pendingRaw) as { email?: string } : null
    const email = pending?.email || ''
    return <VerifyChoiceClient email={email} />
  }

  // Auto-resend verification email once for fresh signups
  const autoResendKey = `auto_resend_${signupSession}`
  const hasAutoResent = cookieStore.get(autoResendKey)?.value
  
  if (!hasAutoResent) {
    // Perform auto-resend server-side
    await autoResendVerification(signupEmail, signupSession)
  }

  return <VerifyChoiceClient email={signupEmail} />
}

