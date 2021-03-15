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
    message = 'Record not found',
    code: string = RecordNotFound.code,
  ) {
    super(message)
    this.extensions = {
      code,
      target: typeof target === 'string' ? [target] : target,
    }
  }
}

export const reportException = (error: Error): void => {
  Sentry.captureException(error)
}
