import {
  inputObjectType,
  list,
  mutationField,
  objectType,
  queryField,
  stringArg,
} from 'nexus'
import * as Auth from '@lib/auth'

export const allUsers = queryField('allUsers', {
  type: list('User'),
  resolve: (_, __, { prisma }) => {
    return prisma.user.findMany()
  },
})

export const registerEmail = mutationField('registerEmail', {
  type: 'Int',
  args: {
    email: stringArg(),
  },
  resolve: async (_, { email }) => {
    const user = await Auth.registerEmail({ email })

    return user.id
  },
})

export const login = mutationField('login', {
  type: 'String',
  description: `Generates a session token by email and password.

### Errors

**invalid_credentials**
Email or password are not valid inputs

**invalid_input**
Email or password don't match any user
`.trim(),
  args: {
    email: stringArg(),
    password: stringArg(),
  },
  resolve: async (_, input) => {
    const { session } = await Auth.login(input)
    return session.hashedToken
  },
})

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.nonNull.string('email')
    t.nonNull.list.nonNull.field('posts', {
      type: 'Post',
      resolve: (parent, _, context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .posts()
      },
    })
  },
})

export const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.int('id')
    t.string('email')
  },
})

export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email')
    t.string('name')
    t.list.nonNull.field('posts', { type: 'PostCreateInput' })
  },
})
