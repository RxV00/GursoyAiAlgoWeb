import WaitingClient from './WaitingClient'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPendingSignup } from '@/lib/auth/session'

export default async function WaitingPage() {
  const supabase = await createClient()
  
  // Check for signup session from cookie
  const pendingSignup = await getPendingSignup()
  
  if (!pendingSignup || pendingSignup.used) {
    // No valid signup session, redirect to signup
    redirect('/signup')
  }

  // Check if user was confirmed AFTER this signup attempt
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user && user.email === pendingSignup.email && user.email_confirmed_at) {
      const signupTime = pendingSignup.createdAt.getTime()
      const confirmTime = new Date(user.email_confirmed_at).getTime()
      
      // Only redirect if confirmed after this signup attempt
      if (confirmTime > signupTime) {
        redirect('/dashboard')
      }
    }
  } catch (error) {
    // If we can't check auth status, continue to waiting page
    console.warn('Could not check auth status:', error)
  }

  return <WaitingClient email={pendingSignup.email} signupTimestamp={pendingSignup.createdAt.getTime()} />
}