'use client'

import { useEffect } from 'react'
import { autoResendVerification } from './actions'

export function VerifyPageClient({ email, sessionId }: { email: string; sessionId: string }) {
  useEffect(() => {
    if (email && sessionId) {
      autoResendVerification(email, sessionId)
    }
  }, [email, sessionId])

  return null
}
