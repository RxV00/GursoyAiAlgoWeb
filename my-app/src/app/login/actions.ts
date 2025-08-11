'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { createPendingSignup } from '@/lib/auth/session'
import { setSecureSessionCookie } from '@/lib/auth/cookies'

export type AuthActionState = {
  ok: boolean
  error?: string
}

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email'),
    phone: z
      .string()
      .min(8, 'Phone number is required')
      .regex(/^[0-9+()\-\s]{8,}$/i, 'Enter a valid phone number'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
    company: z.string().optional().or(z.literal('')),
    role: z.string().optional().or(z.literal('')),
    agreeToTerms: z.union([z.literal('on'), z.literal('true')], {
      required_error: 'You must agree to the Terms of Service',
      invalid_type_error: 'You must agree to the Terms of Service',
    }),
    newsletter: z.union([z.literal('on'), z.literal('true')]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export async function login(_prevState: AuthActionState | null, formData: FormData): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  })

  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? 'Invalid input'
    return { ok: false, error: firstError }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { ok: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(_prevState: AuthActionState | null, formData: FormData): Promise<AuthActionState> {
  const parsed = signupSchema.safeParse({
    firstName: String(formData.get('firstName') ?? ''),
    lastName: String(formData.get('lastName') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    password: String(formData.get('password') ?? ''),
    confirmPassword: String(formData.get('confirmPassword') ?? ''),
    company: String(formData.get('company') ?? ''),
    role: String(formData.get('role') ?? ''),
    agreeToTerms: String(formData.get('agreeToTerms') ?? formData.get('terms') ?? ''),
    newsletter: String(formData.get('newsletter') ?? ''),
  })

  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? 'Invalid input'
    return { ok: false, error: firstError }
  }

  const supabase = await createClient()

  // Normalize Turkish phone numbers to E.164 (+90XXXXXXXXXX) and keep a display version
  const digitsOnly = parsed.data.phone.replace(/\D/g, '')
  let national = digitsOnly
  if (national.startsWith('0')) national = national.slice(1)
  if (national.startsWith('90')) national = national.slice(2)
  const phoneE164 = national.length === 10 ? `+90${national}` : `+${digitsOnly}`
  const phoneDisplay = parsed.data.phone

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Create the account immediately via signUp and send verification email
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm?next=/dashboard`,
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        phone: phoneDisplay,
        phone_e164: phoneE164,
        company: parsed.data.company,
        role: parsed.data.role,
        newsletter: !!parsed.data.newsletter,
      },
    },
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  // If signup succeeded but no email was sent automatically, send it explicitly
  if (data?.user && !data?.user?.email_confirmed_at) {
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: parsed.data.email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/confirm?next=/dashboard`,
      },
    })
    
    // Don't fail the whole signup if resend fails, just log it
    if (resendError) {
      console.warn('Failed to resend verification email:', resendError.message)
    }
  }

  // Store signup session info to track auto-resend in /verify
  const pendingId = await createPendingSignup({
    email: parsed.data.email,
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    phone: phoneDisplay,
    phoneE164: phoneE164,
    company: parsed.data.company,
    role: parsed.data.role,
    newsletter: !!parsed.data.newsletter,
  })

  // Store only opaque reference
  await setSecureSessionCookie('signup-session', pendingId, 60 * 30)

  redirect('/waiting')
}