import { setupCore } from '@core/setup'
import { env } from '@core/utils'
import { IS_DEV_ENV } from '@config/constants'
import * as jwt from 'jsonwebtoken'
import { prisma } from '@context'

setupCore({
  log: 'all',
  auth: {
    session: prisma.authSession,
    hashRounds: 10,
    jwt: {
      secret: env('JWT_SECRET'),
      algorithm: env<jwt.Algorithm>('JWT_ALGORITHM', 'HS512'),
    },
  },
  integrations: {
    email: {
      template: prisma.api_SendGridEmailTemplate,
      sendGridAPIKey: env('EMAIL_SENDGRID_API_KEY'),
      defaultSender: env('EMAIL_DEFAULT_SENDER'),
      sandboxMode: IS_DEV_ENV,
    },
    sentry: {
      dsn: env('SENTRY_DSN'),
    },
    app: {
      path: prisma.api_AppPath,
    },
  },
})

export * from './auth'
export * from './comment'
export * from './post'
