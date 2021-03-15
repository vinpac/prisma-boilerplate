import * as r from '@core/resolver'

r.inputObjectType({
  name: 'PostOrderByUpdatedAtInput',
  definition(t) {
    t.field('updatedAt', { type: 'SortOrder' })
  },
})

r.inputObjectType({
  name: 'PostCreateInput',
  definition(t) {
    t.string('title')
    t.string('content')
  },
})
