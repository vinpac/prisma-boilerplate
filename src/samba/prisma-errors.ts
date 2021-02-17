import { PrismaError } from 'prisma-error-enum'

export const isUniqueConstraintViolationOf = (
  error: any,
  target: string,
): error is { code: string; meta: { target: [string] } } => {
  return (
    error.code === PrismaError.UniqueConstraintViolation &&
    error.meta?.target[0] === target
  )
}
