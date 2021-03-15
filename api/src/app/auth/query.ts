import * as r from '@core/resolver'

r.query('viewer', {
  type: 'User',
})
  .pipe((_, ctx) => {
    return ctx.prisma.user.findFirst()
  })
  .publish()

r.objectType({
  name: 'User',
  definition(t) {
    t.int('id')
    t.string('email')
    t.boolean('emailConfirmed')
    t.nullable.field('profile', { type: 'UserProfile' })
  },
})

r.objectType({
  name: 'UserProfile',
  definition: (t) => {
    t.int('userId')
    t.string('displayName')
    t.string('username')
  },
})

r.inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.int('id')
    t.string('email')
  },
})
