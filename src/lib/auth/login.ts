import { prisma } from '@context'
import {
  verifyPasswordHash,
  assertRecordExists,
  invariant,
  RecordNotFound,
} from '@samba'
import { createSession } from './session-token'
import { LoginInput, LoginInputType } from './validation'

const invariantForCredentials = (check: any) =>
  invariant(check, 'invalid_credentials', 'Invalid credentials for this user')

export const login = async (input: LoginInputType) => {
  // This throws an error if input is invalid
  const { email, password } = LoginInput.parse(input)

  // This throws an error if credentials are invalid
  const user = await authenticateUser(email, password).catch((error) => {
    invariantForCredentials(error.code !== RecordNotFound.code)

    throw error
  })

  const session = await createSession({
    userId: user.id,
    role: 'user',
  })

  return {
    user,
    session,
  }
}

export const authenticateUser = async (email: string, password: string) => {
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
