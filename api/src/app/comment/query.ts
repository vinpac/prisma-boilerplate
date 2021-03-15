import * as r from '@core/resolver'

r.objectType({
  name: 'Comment',
  nonNullDefaults: { output: true },
  definition(t) {
    t.int('id')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.string('content')
  },
})
