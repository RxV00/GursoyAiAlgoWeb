'use server'

import { cookies } from 'next/headers'
import { 
  createSignupSession, 
  getSignupSession, 
  consumeSignupSession,
  type SignupSessionData 
} from './db-session'

export interface PendingSignup {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  phoneE164: string
  company?: string
  role?: string
  newsletter: boolean
  createdAt: Date
  expiresAt: Date
  used: boolean
}

// Secure cookie configuration  
const COOKIE_NAME = '__Host-ssid'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 15 * 60, // 15 minutes
}

// In-memory email resend tracking (lightweight, can stay in memory)
const emailResendTimes = new Map<string, number>()

export async function createPendingSignup(data: Omit<PendingSignup, 'id' | 'createdAt' | 'expiresAt' | 'used'>): Promise<string> {
  const sessionData: SignupSessionData = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    phoneE164: data.phoneE164,
    company: data.company,
    role: data.role,
    newsletter: data.newsletter,
  }

  const result = await createSignupSession({
    email: data.email,
    metadata: sessionData,
    ttlMinutes: 15,
  })

  if (!result.success || !result.token) {
    throw new Error(result.error || 'Failed to create signup session')
  }

  // Set secure cookie
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, result.token, COOKIE_OPTIONS)

  return result.token
}

export async function getPendingSignup(token?: string): Promise<PendingSignup | null> {
  try {
    // Get token from parameter or cookie
    let sessionToken = token
    if (!sessionToken) {
      const cookieStore = await cookies()
      sessionToken = cookieStore.get(COOKIE_NAME)?.value
    }

    if (!sessionToken) {
      return null
    }

    const result = await getSignupSession(sessionToken)
    if (!result.success || !result.data) {
      return null
    }

    const session = result.data
    const pendingSignup: PendingSignup = {
      id: session.id,
      email: session.email,
      firstName: session.metadata.firstName,
      lastName: session.metadata.lastName,
      phone: session.metadata.phone,
      phoneE164: session.metadata.phoneE164,
      company: session.metadata.company,
      role: session.metadata.role,
      newsletter: session.metadata.newsletter,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      used: session.used,
    }

    return pendingSignup
  } catch (error) {
    console.error('Error getting pending signup:', error)
    return null
  }
}

export async function markSignupUsed(token?: string): Promise<void> {
  try {
    // Get token from parameter or cookie
    let sessionToken = token
    if (!sessionToken) {
      const cookieStore = await cookies()
      sessionToken = cookieStore.get(COOKIE_NAME)?.value
    }

    if (!sessionToken) {
      return
    }

    // Consume the session (marks as used atomically)
    await consumeSignupSession(sessionToken)

    // Clear the cookie
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
  } catch (error) {
    console.error('Error marking signup as used:', error)
  }
}

export async function canResendEmail(email: string): Promise<{ allowed: boolean; remainingSeconds?: number }> {
  const lastResend = emailResendTimes.get(email)
  if (!lastResend) return { allowed: true }
  
  const elapsed = Date.now() - lastResend
  const cooldownMs = 60 * 1000 // 60 seconds
  
  if (elapsed < cooldownMs) {
    return {
      allowed: false,
      remainingSeconds: Math.ceil((cooldownMs - elapsed) / 1000)
    }
  }
  
  return { allowed: true }
}

export async function recordEmailResend(email: string): Promise<void> {
  emailResendTimes.set(email, Date.now())
  
  // Clean old entries (older than 5 minutes)
  const cutoff = Date.now() - 5 * 60 * 1000
  for (const [email, time] of emailResendTimes.entries()) {
    if (time < cutoff) {
      emailResendTimes.delete(email)
    }
  }
}

// Legacy function removed - cleanup now handled by database
