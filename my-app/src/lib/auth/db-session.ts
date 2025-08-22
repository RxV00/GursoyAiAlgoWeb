'use server'

import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase/service'

export interface SignupSessionData {
  email: string
  firstName: string
  lastName: string
  phone: string
  phoneE164: string
  company?: string
  role?: string
  newsletter: boolean
}

export interface SignupSession {
  id: string
  tokenHash: string
  email: string
  metadata: SignupSessionData
  createdAt: Date
  expiresAt: Date
  used: boolean
}

interface CreateSessionParams {
  email: string
  metadata: SignupSessionData
  ttlMinutes?: number
}

interface SessionResult {
  success: boolean
  data?: SignupSession
  error?: string
}

interface CreateResult {
  success: boolean
  token?: string
  error?: string
}

// Utility functions for secure token handling
function generateToken(): string {
  return crypto.randomBytes(32).toString('base64url')
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('base64url')
}

export async function createSignupSession(params: CreateSessionParams): Promise<CreateResult> {
  try {
    const supabase = createServiceClient()
    const token = generateToken()
    const tokenHash = hashToken(token)
    const ttlMinutes = params.ttlMinutes || 15
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000)

    const { error } = await supabase
      .from('auth_signup_sessions')
      .insert({
        token_hash: tokenHash,
        email: params.email,
        metadata: params.metadata,
        expires_at: expiresAt.toISOString(),
      })

    if (error) {
      console.error('Failed to create signup session:', error.message)
      return { success: false, error: 'Failed to create session' }
    }

    // Cleanup expired sessions opportunistically
    await cleanupExpiredSessions()

    return { success: true, token }
  } catch (error) {
    console.error('Error creating signup session:', error)
    return { success: false, error: 'Internal server error' }
  }
}

export async function getSignupSession(token: string): Promise<SessionResult> {
  try {
    const supabase = createServiceClient()
    const tokenHash = hashToken(token)

    const { data, error } = await supabase
      .from('auth_signup_sessions')
      .select('*')
      .eq('token_hash', tokenHash)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !data) {
      return { success: false, error: 'Session not found or expired' }
    }

    const session: SignupSession = {
      id: data.id,
      tokenHash: data.token_hash,
      email: data.email,
      metadata: data.metadata as SignupSessionData,
      createdAt: new Date(data.created_at),
      expiresAt: new Date(data.expires_at),
      used: data.used,
    }

    return { success: true, data: session }
  } catch (error) {
    console.error('Error getting signup session:', error)
    return { success: false, error: 'Internal server error' }
  }
}

export async function consumeSignupSession(token: string): Promise<SessionResult> {
  try {
    const supabase = createServiceClient()
    const tokenHash = hashToken(token)

    // Atomic update to mark as used (single-use guarantee)
    const { data, error } = await supabase
      .from('auth_signup_sessions')
      .update({ used: true })
      .eq('token_hash', tokenHash)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .select()
      .single()

    if (error || !data) {
      return { success: false, error: 'Session not found, expired, or already used' }
    }

    const session: SignupSession = {
      id: data.id,
      tokenHash: data.token_hash,
      email: data.email,
      metadata: data.metadata as SignupSessionData,
      createdAt: new Date(data.created_at),
      expiresAt: new Date(data.expires_at),
      used: data.used,
    }

    return { success: true, data: session }
  } catch (error) {
    console.error('Error consuming signup session:', error)
    return { success: false, error: 'Internal server error' }
  }
}

export async function extendSignupSession(token: string, additionalMinutes: number): Promise<SessionResult> {
  try {
    const supabase = createServiceClient()
    const tokenHash = hashToken(token)
    const newExpiresAt = new Date(Date.now() + additionalMinutes * 60 * 1000)

    const { data, error } = await supabase
      .from('auth_signup_sessions')
      .update({ expires_at: newExpiresAt.toISOString() })
      .eq('token_hash', tokenHash)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .select()
      .single()

    if (error || !data) {
      return { success: false, error: 'Session not found, expired, or already used' }
    }

    const session: SignupSession = {
      id: data.id,
      tokenHash: data.token_hash,
      email: data.email,
      metadata: data.metadata as SignupSessionData,
      createdAt: new Date(data.created_at),
      expiresAt: new Date(data.expires_at),
      used: data.used,
    }

    return { success: true, data: session }
  } catch (error) {
    console.error('Error extending signup session:', error)
    return { success: false, error: 'Internal server error' }
  }
}

export async function cleanupExpiredSessions(): Promise<void> {
  try {
    const supabase = createServiceClient()
    
    await supabase
      .from('auth_signup_sessions')
      .delete()
      .or(`expires_at.lt.${new Date().toISOString()},used.eq.true`)
  } catch (error) {
    // Log but don't throw - cleanup is opportunistic
    console.error('Error cleaning up expired sessions:', error)
  }
}