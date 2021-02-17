import { API_SENTRY_DSN } from '@config/constants'
import * as Sentry from '@sentry/node'

export class InvariantError extends Error {
  extensions: { code: string }

  constructor(
    public code: string,
    message: string,
    public ctx?: Record<string, any>,
  ) {
    super(message)
    this.extensions = {
      code,
      ...ctx,
    }
  }
}

export class RecordNotFound extends Error {
  public static code: 'record_not_found'
  extensions: { code: string; target: string[] }

  constructor(
    target: string | string[],
    message: string = 'Record not found',
    code: string = RecordNotFound.code,
  ) {
    super(message)
    this.extensions = {
      code,
      target: typeof target === 'string' ? [target] : target,
    }
  }
}

Sentry.init({
  dsn: API_SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
})

export const reportException = (error: Error) => {
  Sentry.captureException(error)
}
