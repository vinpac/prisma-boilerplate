import { InvariantError, RecordNotFound } from './classes'

export function assertRecordExists(
  condition: boolean | any,
  target: string | string[],
): asserts condition {
  if (condition) {
    return
  }

  throw new RecordNotFound(target)
}

export function invariant(
  condition: boolean | any,
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
