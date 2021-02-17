import { InvariantError, RecordNotFound } from './errors'

export function assertRecordExists(
  condition: any,
  target: string | string[],
): asserts condition {
  if (condition) {
    return
  }

  // When not in production we allow the message to pass through
  // *This block will be removed in production builds*
  throw new RecordNotFound(target)
}

export function invariant(
  condition: any,
  code: string,
  message: string,
  ctx?: Record<string, any>,
): asserts condition {
  if (condition) {
    return
  }

  // When not in production we allow the message to pass through
  // *This block will be removed in production builds*
  throw new InvariantError(code, message, ctx)
}
