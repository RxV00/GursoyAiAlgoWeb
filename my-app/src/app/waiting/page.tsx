import WaitingClient from './WaitingClient'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function WaitingPage() {
  const cookieStore = await cookies()
  const supabase = await createClient()
  
  // Check for signup session
  const signupSession = cookieStore.get('signup_session')?.value
  const signupEmail = cookieStore.get('signup_email')?.value
  const signupTimestamp = cookieStore.get('signup_timestamp')?.value
  
  // Check if this is a fresh signup (within last 30 minutes)
  const isFreshSignup = signupTimestamp && 
    (Date.now() - Number(signupTimestamp)) < (30 * 60 * 1000)
  
  if (!signupSession || !signupEmail || !isFreshSignup) {
    // No valid signup session, redirect to signup
    redirect('/signup')
  }

  // Check if user was confirmed AFTER this signup attempt
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user && user.email === signupEmail && user.email_confirmed_at) {
      const signupTime = Number(signupTimestamp)
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

  return <WaitingClient email={signupEmail} signupTimestamp={Number(signupTimestamp)} />
}