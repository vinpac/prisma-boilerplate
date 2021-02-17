import { required } from '@samba/core-utils'
import jwt from 'jsonwebtoken'

export interface ConstantsEnv {
  JWT_SECRET: string
  SENDGRID_API_KEY: string
  SENDGRID_DEFAULT_SENDER: string
  JWT_ALGORITHM: jwt.Algorithm
  AUTHORIZED_DEFAULT_ROLE: string
  API_SENTRY_DSN: string
  APP_URL: string
  HASURA_GRAPHQL_ADMIN_SECRET: string
  BCRYPT_ROUNDS: number
  HASURA_ENDPOINT: string
  TWILIO_AUTH_TOKEN: string
  TWILIO_ACCOUNT_SID: string
  TWILIO_VERIFY_SERVICE_ID: string
  SENDGRID_TEMPLATE_ID_EMAIL_VALIDATION: string
  SENDGRID_TEMPLATE_ID_PASSWORD_RECOVERY: string
}

export const {
  JWT_SECRET = required('JWT_SECRET is a required env'),
  JWT_ALGORITHM = 'HS512' as jwt.Algorithm,
  AUTHORIZED_DEFAULT_ROLE = 'user',
  APP_URL = 'http://localhost:3000',
  HASURA_ENDPOINT = 'http://graphql-engine:8080/v1/graphql',
  HASURA_GRAPHQL_ADMIN_SECRET = 'myadminsecretkey',
  BCRYPT_ROUNDS = 10,
  TWILIO_ACCOUNT_SID,
  TWILIO_VERIFY_SERVICE_ID,
  TWILIO_AUTH_TOKEN,
  SENDGRID_TEMPLATE_ID_EMAIL_VALIDATION,
  SENDGRID_TEMPLATE_ID_PASSWORD_RECOVERY,
  API_SENTRY_DSN,
  SENDGRID_API_KEY = required('SENDGRID_API_KEY is a required env'),
  SENDGRID_DEFAULT_SENDER = required(
    'SENDGRID_DEFAULT_SENDER is a required env',
  ),
} = (process.env as any) as ConstantsEnv

export const DEFAULT_LOCALE = 'pt-BR'
export const APP = {
  name: 'Robo da Nasa',
}
export const EMAIL_DATA = {
  app: APP,
}

export const IS_DEV_ENV = process.env.NODE_ENV !== 'production'
