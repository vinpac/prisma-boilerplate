import { prisma } from '@context'
import {
  invariant,
  reportException,
  hashPassword,
  isUniqueConstraintViolationOf,
} from '@samba'
import { requestEmailConfirmation } from './email-confirmation'

import {
  RegisterEmailInput,
  RegisterEmailInputType,
  SignupInput,
  SignupInputType,
} from './validation'

export const registerEmail = async (input: RegisterEmailInputType) => {
  // This throws an error if input is invalid
  const { email } = RegisterEmailInput.parse(input)

  try {
    const user = await prisma.user.create({
      data: {
        email,
      },
    })

    requestEmailConfirmation({ userId: user.id, email: user.email }).catch(
      (error) => {
        // Here we supress the exception because the user can request
        // an email confirmation later
        reportException(error)
      },
    )

    return user
  } catch (error) {
    invariant(
      !isUniqueConstraintViolationOf(error, 'email'),
      'email_taken',
      'This email is already registered by another user',
    )

    throw error
  }
}

export const signupUser = async (input: SignupInputType) => {
  const { username, userId, displayName, bio, password } = SignupInput.parse(
    input,
  )
  const passwordHash = await hashPassword(password)

  const [userLogin, userProfile] = await prisma.$transaction([
    prisma.userLogin.create({
      data: {
        name: 'password',
        value: passwordHash,
        userId,
      },
    }),
    prisma.userProfile.create({
      data: {
        bio,
        displayName,
        username,
        userId,
      },
    }),
  ])

  return { userLogin, userProfile }
}
