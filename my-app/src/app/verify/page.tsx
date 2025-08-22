import VerifyChoiceClient from './VerifyChoiceClient'
import { getPendingSignup } from '@/lib/auth/session'
import { VerifyPageClient } from './VerifyPageClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function VerifyChoicePage() {
  // Check for signup session from cookie
  const pendingSignup = await getPendingSignup()

  if (!pendingSignup || pendingSignup.used) {
    // No valid signup session, redirect to signup
    redirect('/signup')
  }

  return (
    <>
      <VerifyPageClient email={pendingSignup.email} />
      <VerifyChoiceClient email={pendingSignup.email} />
    </>
  )
}

