'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm?next=/dashboard`,
      data: {
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        company: parsed.data.company,
        role: parsed.data.role,
        newsletter_subscription: parsed.data.newsletter ? true : false,
      },
    },
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  // On successful sign up, let Supabase send confirmation email and land user on confirm flow
  // Keep user on the same page and show success info, or navigate to login.
  return { ok: true }
}