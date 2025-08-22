import { z } from 'zod'

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
})

const parsedServerEnv = serverEnvSchema.safeParse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
})

if (!parsedServerEnv.success) {
  const errorDetails = parsedServerEnv.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('\n')
  throw new Error(`Invalid server environment variables:\n${errorDetails}`)
}

export const serverEnv = parsedServerEnv.data