import { PrismaError } from 'prisma-error-enum'

export const isUniqueConstraintViolationOf = (
  error: Error | { code: string; meta?: { target: string[] } },
  target: string,
): error is { code: string; meta: { target: [string] } } => {
  return (
    'code' in error &&
    error.code === PrismaError.UniqueConstraintViolation &&
    error.meta?.target[0] === target
  )
}
