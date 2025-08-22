'use client'

import { useEffect } from 'react'
import { autoResendVerification } from './actions'

export function VerifyPageClient({ email }: { email: string }) {
  useEffect(() => {
    if (email) {
      autoResendVerification(email)
    }
  }, [email])

  return null
}
