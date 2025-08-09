'use server'

import VerifyChoiceClient from './VerifyChoiceClient'
import { cookies } from 'next/headers'

export default async function VerifyChoicePage() {
  const cookieStore = await cookies()
  const pendingRaw = cookieStore.get('pending_signup')?.value
  const issuedAtStr = cookieStore.get('verify_issued_at')?.value
  const issuedAt = issuedAtStr ? Number(issuedAtStr) : 0
  const isFresh = issuedAt > 0 && Date.now() - issuedAt < 1000 * 60 * 30
  if (!pendingRaw || !isFresh) {
    // Hard server-side guard: if no fresh pending signup, avoid rendering and let middleware redirect
    return null
  }
  const pending = pendingRaw ? JSON.parse(pendingRaw) as { email?: string } : null
  const email = pending?.email || ''

  // If somehow missing, render a minimal fallback CTA
  return <VerifyChoiceClient email={email} />
}

