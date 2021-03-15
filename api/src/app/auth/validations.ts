import * as z from 'zod'

export const RegisterEmailInput = z.object({
  email: z.string().email(),
})

export const ConfirmEmailInput = z.object({
  token: z.string().min(1),
})

export const RequestPasswordRecoveryInput = z.object({
  email: z.string().email(),
})

export const SignupInput = z.object({
  userId: z.number(),
  displayName: z.string().min(2).max(64),
  username: z.string().min(2).max(64),
  bio: z.string().max(256),
  password: z.string().min(10).max(100),
})

export const LoginInput = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const RequestEmailValidationInput = z.object({
  userId: z.number(),
  email: z.string().email(),
})
