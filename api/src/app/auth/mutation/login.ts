import { PrismaClient, User } from '.prisma/client'
import { LoginInput } from '@app/auth/validations'
import { createSession, verifyPasswordHash } from '@core/auth'
import { assertRecordExists, invariant } from '@core/exceptions'
import * as r from '@core/resolver'
import { stringArg } from 'nexus'

export const authenticateUser = async (
  prisma: PrismaClient,
  email: string,
  password: string,
): Promise<User> => {
  const user = await prisma.user.findFirst({
    where: { email },
    include: {
      logins: {
        where: {
          name: 'password',
        },
      },
    },
  })

  assertRecordExists(user, ['user', 'email'])

  const login = user.logins[0]
  invariant(
    login,
    'password_not_configured',
    'Password login not configure for this user',
  )

  const verified = await verifyPasswordHash(login.value, password)
  invariantForCredentials(verified)

  const { logins, ...rest } = user
  return rest
}

const invariantForCredentials = (check: boolean | any): void =>
  invariant(check, 'invalid_credentials', 'Invalid credentials for this user')

r.mutation('createSessionToken', {
  type: 'String',
  description: `
  Generates a session token by email and password.

  ### Errors
  
  **invalid_credentials**
  Email or password are not valid inputs
  
  **invalid_input**
  Email or password don't match any user
  `,
  args: {
    email: stringArg(),
    password: stringArg(),
  },
})
  .pipe(r.zod(LoginInput))
  .pipe(async ({ email, password }, ctx) => {
    const user = await authenticateUser(ctx.prisma, email, password)
    const session = await createSession({
      data: {
        userId: user.id,
        role: 'user',
        roles: ['user'],
      },
    })

    return session.hashedToken
  })
  .publish()
