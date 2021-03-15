import * as jwt from 'jsonwebtoken'
import * as Sentry from '@sentry/node'
import { PrismaClient } from '@prisma/client'
import { CreateSessionInput } from '@core/auth'

type ExtractModels<T> = {
  // We can disable eslint here because we are using Function just to match
  // the delegates. Prisma assures they are valid functions. Otherwise
  // it wouldn't work as a ORM
  // eslint-disable-next-line @typescript-eslint/ban-types
  [k in keyof T]: T[k] extends { findUnique: Function } ? T[k] : never
}[keyof T]

type AllModels = ExtractModels<PrismaClient>

export interface CreateSessionRecordInput extends CreateSessionInput {
  hashedToken: string
}

type Await<T> = T extends Promise<infer N> ? N : never

declare global {
  type ConfigClaim<T extends keyof ConfigClaims> = ConfigClaims[T]
  type CoreModel<
    T extends keyof ConfigClaims
  > = ConfigClaims[T] extends AllModels
    ? Await<ReturnType<ConfigClaims[T]['create']>>
    : never
}

interface CoreConfig {
  log?: 'all'
  auth: {
    session: ConfigClaim<'auth.session'>
    hashRounds: number
    jwt: {
      secret: string
      algorithm: jwt.Algorithm
    }
  }
  integrations: {
    sentry: Sentry.NodeOptions & {
      dsn: string
    }
    email: {
      template: ConfigClaim<'integrations.email.template'>
      sendGridAPIKey: string
      defaultSender: string
      sandboxMode: boolean
    }
    app: {
      path: ConfigClaim<'integrations.app.path'>
    }
  }
}

let coreConfig: CoreConfig | undefined
export const getCoreConfig = (): CoreConfig => {
  if (!coreConfig) {
    throw new Error("Core wasn't set up")
  }

  return coreConfig
}

export const setupCore = (config: CoreConfig): void => {
  coreConfig = config

  Sentry.init({
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,

    ...config.integrations.sentry,
  })

  return
}
