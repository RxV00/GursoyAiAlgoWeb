'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Mail, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { resendEmailVerification, type ResendState } from './actions'
import { useActionState } from 'react'

type Props = { 
  email: string
  signupTimestamp: number
}

export default function WaitingClient({ email, signupTimestamp }: Props) {
  const [isChecking, setIsChecking] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [checkCount, setCheckCount] = useState(0)
  const router = useRouter()
  const supabase = createClient()
  
  const [resendState, resendAction, isResending] = useActionState<ResendState, FormData>(
    resendEmailVerification, 
    { ok: false }
  )

  useEffect(() => {
    let mounted = true
    let interval: NodeJS.Timeout

    // Listen for auth state changes (this will fire when user clicks email verification link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      // When user successfully verifies email, they'll get signed in
      if (event === 'SIGNED_IN' && session?.user) {
        const user = session.user
        
        // Check if this is the user we're waiting for and they're confirmed AFTER signup
        if (user.email === email && user.email_confirmed_at) {
          const confirmTime = new Date(user.email_confirmed_at).getTime()
          
          // Only proceed if confirmed after this signup attempt
          if (confirmTime > signupTimestamp) {
            setIsConfirmed(true)
            setIsChecking(false)
            
            // Immediate redirect on auth state change
            if (mounted) {
              router.push('/dashboard')
            }
          }
        }
      }
    })

    // Polling function to check user status periodically
    const checkConfirmation = async () => {
      if (!mounted || isConfirmed) return
      
      setIsChecking(true)
      setCheckCount(prev => prev + 1)
      
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user && session.user.email === email && session.user.email_confirmed_at) {
          const confirmTime = new Date(session.user.email_confirmed_at).getTime()
          
          // Only proceed if confirmed after this signup attempt
          if (confirmTime > signupTimestamp) {
            setIsConfirmed(true)
            if (mounted) {
              router.push('/dashboard')
            }
            return
          }
        }
      } catch (error) {
        console.warn('Error checking confirmation:', error)
      } finally {
        setIsChecking(false)
      }
    }

    // Don't check immediately - only start polling after user has had time to check email
    setTimeout(() => {
      if (mounted) {
        interval = setInterval(checkConfirmation, 2000)
      }
    }, 3000)

    return () => {
      mounted = false
      if (interval) clearInterval(interval)
      subscription.unsubscribe()
    }
  }, [supabase.auth, router, isConfirmed, email, signupTimestamp])

  if (isConfirmed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="border-slate-200 shadow-elegant max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-green-900">Email Confirmed!</CardTitle>
            <CardDescription>Redirecting to dashboard...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="border-slate-200 shadow-elegant max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-slate-900">Check Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to{' '}
            <span className="font-medium text-slate-700">{email}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600">
              Click the verification link in your email to continue.
            </p>
            <p className="text-xs text-slate-500">
              Don&apos;t forget to check your spam folder.
            </p>
          </div>

          {/* Status indicator */}
          <div className="flex items-center justify-center space-x-2 py-4">
            {isChecking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-slate-600">Checking for confirmation...</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                <span className="text-sm text-slate-600">Waiting for email confirmation</span>
              </>
            )}
          </div>

          {/* Resend section */}
          <div className="border-t pt-4 space-y-3">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-3">Didn&apos;t receive the email?</p>
              <form action={resendAction}>
                <Button 
                  type="submit" 
                  variant="outline" 
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Resend verification email'
                  )}
                </Button>
              </form>
            </div>
            
            {resendState?.error && (
              <p className="text-xs text-red-600 text-center">{resendState.error}</p>
            )}
            {resendState?.ok && !resendState.error && (
              <p className="text-xs text-green-600 text-center">
                Email sent! Check your inbox and spam folder.
              </p>
            )}
          </div>

          {/* Debug info (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-slate-400 text-center border-t pt-2">
              Checks performed: {checkCount}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}