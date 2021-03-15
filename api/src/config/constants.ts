import jwt from 'jsonwebtoken'

export interface ConstantsEnv {
  JWT_SECRET: string
  SENDGRID_API_KEY: string
  PORT: number
  SENDGRID_DEFAULT_SENDER: string
  JWT_ALGORITHM: jwt.Algorithm
  AUTHORIZED_DEFAULT_ROLE: string
  API_SENTRY_DSN: string
  APP_URL: string
  BCRYPT_ROUNDS: number
  HASURA_ENDPOINT: string
  TWILIO_AUTH_TOKEN: string
  TWILIO_ACCOUNT_SID: string
  TWILIO_VERIFY_SERVICE_ID: string
}

export const DEFAULT_LOCALE = 'pt-BR'
export const APP = {
  name: 'Robo da Nasa',
}
export const EMAIL_DATA = {
  app: APP,
}

export const IS_DEV_ENV = process.env.NODE_ENV !== 'production'
