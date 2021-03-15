import * as r from '@core/resolver'
import { list } from 'nexus'

r.query('feed', {
  type: list('Post'),
  description: `
  A list of recent posts based on current user
  `,
})
  .pipe((_, ctx) => {
    return ctx.prisma.post.findMany({ take: 20 })
  })
  .publish()

r.objectType({
  name: 'Post',
  definition(t) {
    t.int('id')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.string('title')
    t.nullable.string('content')
    t.boolean('published')
    t.int('viewCount')

    t.field('comments', {
      type: list('Comment'),
      resolve: (parent, _, context) => {
        return context.prisma.post
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .comments()
      },
    })

    t.field('author', {
      type: 'User',
      resolve: (parent, _, context) => {
        return context.prisma.post
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .author()
      },
    })
  },
})

r.enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})
