import { z } from "zod"

export const MIN_PASSWORD_LENGTH = 8
export const PASSWORD_STRENGTH_REQUIREMENTS = {
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  digit: /\d/,
  symbol: /[^A-Za-z0-9]/,
} as const

const passwordValidation = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
  .refine((password) => {
    const checks = Object.values(PASSWORD_STRENGTH_REQUIREMENTS)
    const passedChecks = checks.filter(regex => regex.test(password)).length
    return passedChecks >= 3
  }, "Password must include at least 3 of: lowercase, uppercase, digit, symbol")

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: passwordValidation,
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type SignupFormData = z.infer<typeof signupSchema>

export function getPasswordStrength(password: string): "Weak" | "Fair" | "Strong" {
  if (password.length < MIN_PASSWORD_LENGTH) return "Weak"
  
  const checks = Object.values(PASSWORD_STRENGTH_REQUIREMENTS)
  const passedChecks = checks.filter(regex => regex.test(password)).length
  
  if (passedChecks < 2) return "Weak"
  if (passedChecks < 3) return "Fair"
  return "Strong"
}