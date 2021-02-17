import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_ALGORITHM } from '@config/constants'
import { prisma } from '@context'
import { AuthSession } from '@prisma/client'

export interface JWTPayload {
  userId: number
  role: string
}

export interface CreateSessionInput {
  userId: number
  role: string
  publicData?: Record<string, any>
  privateData?: Record<string, any>
}
export const createSession = async (
  input: CreateSessionInput,
): Promise<AuthSession> => {
  const hashedToken = stringifyToken({
    userId: input.userId,
    role: input.role,
  })

  return prisma.authSession.create({
    data: {
      userId: input.userId,
      hashedToken,
      publicData: input.publicData && JSON.stringify(input.publicData),
      privateData: input.privateData && JSON.stringify(input.privateData),
    },
  })
}

export const stringifyToken = (data: JWTPayload): string =>
  jwt.sign(data, JWT_SECRET, { algorithm: JWT_ALGORITHM as any })

export const parseToken = (token: string): Promise<JWTPayload> =>
  new Promise((resolve, reject) =>
    jwt.verify(
      token,
      JWT_SECRET,
      { algorithms: [JWT_ALGORITHM] },
      (error, payload) => {
        if (error) {
          reject(error)
          return
        }

        resolve(payload as JWTPayload)
      },
    ),
  )
