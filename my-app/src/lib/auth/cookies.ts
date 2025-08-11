'use server'

import { cookies } from 'next/headers'

const SECURE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
}

export async function setSecureSessionCookie(name: string, value: string, maxAge: number): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(`__Secure-${name}`, value, {
    ...SECURE_COOKIE_OPTIONS,
    maxAge,
  })
}

export async function getSecureSessionCookie(name: string): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(`__Secure-${name}`)?.value
}

export async function deleteSecureSessionCookie(name: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(`__Secure-${name}`)
}
