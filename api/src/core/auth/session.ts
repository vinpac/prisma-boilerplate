import jwt from 'jsonwebtoken'
import { getCoreConfig } from '@core/setup'

type SessionInput = Omit<Auth.Session, 'hashedToken'>

export interface CreateSessionInput {
  data: SessionInput
  publicData?: Record<string, any>
  privateData?: Record<string, any>
}
export const createSession = async ({
  data,
  publicData,
  privateData,
}: CreateSessionInput): Promise<CoreModel<'auth.session'>> => {
  const hashedToken = stringifyToken(data)
  const core = getCoreConfig()

  return await core.auth.session.create({
    data: {
      ...data,
      hashedToken,
      publicData:
        typeof publicData !== 'undefined'
          ? JSON.stringify(publicData)
          : undefined,
      privateData:
        typeof privateData !== 'undefined'
          ? JSON.stringify(privateData)
          : undefined,
    },
  })
}

export const stringifyToken = (data: SessionInput): string => {
  const core = getCoreConfig()

  return jwt.sign(data, core.auth.jwt.secret, {
    algorithm: core.auth.jwt.algorithm,
  })
}

export const parseToken = (token: string): Promise<Auth.Session> => {
  const core = getCoreConfig()

  return new Promise((resolve, reject) =>
    jwt.verify(
      token,
      core.auth.jwt.secret,
      { algorithms: [core.auth.jwt.algorithm] },
      (error, payload) => {
        if (error) {
          reject(error)
          return
        }

        const session = payload as Auth.Session
        session.hashedToken = token

        resolve(session)
      },
    ),
  )
}
