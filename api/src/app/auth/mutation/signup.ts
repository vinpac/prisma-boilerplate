import {
  invariant,
  reportException,
  isUniqueConstraintViolationOf,
} from '@core/exceptions'
import { requestEmailConfirmation } from './email-confirmation'
import { RegisterEmailInput, SignupInput } from '@app/auth/validations'
import * as r from '@core/resolver'
import { intArg, stringArg } from 'nexus'
import { hashPassword } from '@core/auth'

r.mutation('registerEmail', {
  type: 'User',
  description: `
  Register an user by email only
  `,
  args: {
    email: stringArg(),
  },
})
  .pipe(r.zod(RegisterEmailInput))
  .pipe(async ({ email }, ctx) => {
    try {
      const user = await ctx.prisma.user.create({
        data: {
          email,
        },
      })

      // let's not wait for the email confirmation response since there's
      // no proble if it fails
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
  })

r.objectType({
  name: 'SignupResult',
  definition: (t) => {
    t.field('login', { type: 'Boolean' })
    t.field('profile', { type: 'UserProfile' })
  },
})

r.mutation('signup', {
  type: 'SignupResult',
  description: `
    Register an user by email only
    `,
  args: {
    userId: intArg(),
    displayName: stringArg(),
    username: stringArg(),
    bio: stringArg(),
    password: stringArg(),
  },
})
  .pipe(r.zod(SignupInput))
  .pipe(async ({ username, userId, displayName, bio, password }, ctx) => {
    const passwordHash = await hashPassword(password)

    const [, profile] = await ctx.prisma.$transaction([
      ctx.prisma.userLogin.create({
        data: {
          name: 'password',
          value: passwordHash,
          userId,
        },
      }),
      ctx.prisma.userProfile.create({
        data: {
          bio,
          displayName,
          username,
          userId,
        },
      }),
    ])

    return { login: true, profile }
  })
