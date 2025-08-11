'use server'

import crypto from 'crypto'

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

// In-memory store (replace with database in production)
const pendingSignups = new Map<string, PendingSignup>()
const emailResendTimes = new Map<string, number>()

export async function createPendingSignup(data: Omit<PendingSignup, 'id' | 'createdAt' | 'expiresAt' | 'used'>): Promise<string> {
  const id = crypto.randomUUID()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 30 * 60 * 1000) // 30 minutes
  
  pendingSignups.set(id, {
    ...data,
    id,
    createdAt: now,
    expiresAt,
    used: false
  })
  
  // Clean expired entries
  cleanExpiredSignups()
  
  return id
}

export async function getPendingSignup(id: string): Promise<PendingSignup | null> {
  const signup = pendingSignups.get(id)
  if (!signup) return null
  
  if (signup.expiresAt < new Date()) {
    pendingSignups.delete(id)
    return null
  }
  
  return signup
}

export async function markSignupUsed(id: string): Promise<void> {
  const signup = pendingSignups.get(id)
  if (signup) {
    signup.used = true
    pendingSignups.set(id, signup)
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

function cleanExpiredSignups(): void {
  const now = new Date()
  for (const [id, signup] of pendingSignups.entries()) {
    if (signup.expiresAt < now) {
      pendingSignups.delete(id)
    }
  }
}
