'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { resendEmailVerification, type ResendState } from './actions'

type Props = { email: string }

export default function VerifyChoiceClient({ email }: Props) {
  const [resendState, resendAction, isResending] = useActionState<ResendState, FormData>(resendEmailVerification, { ok: false })

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-slate-900">Verify by Email</CardTitle>
            <CardDescription>We sent a secure link to your email. You can also resend it below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-slate-700 truncate">{email || 'Your email'}</div>
            <div className="flex gap-3">
              <Button asChild variant="secondary">
                <Link href="/login">Open mail app</Link>
              </Button>
              <form action={resendAction}>
                <Button type="submit" disabled={isResending}>Resend link</Button>
              </form>
            </div>
            {resendState?.error && <p className="text-xs text-red-600">{resendState.error}</p>}
            {resendState?.ok && !resendState.error && (
              <p className="text-xs text-green-600">Email sent. Check your inbox and spam folder.</p>
            )}
            <p className="text-xs text-slate-500">After clicking the email link, you’ll be redirected automatically.</p>
          </CardContent>
        </Card>

        {/* Phone verification removed per request */}
      </div>
    </div>
  )
}


