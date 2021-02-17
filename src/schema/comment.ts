import {
  arg,
  inputObjectType,
  intArg,
  mutationField,
  objectType,
  stringArg,
} from 'nexus'

export const commentPost = mutationField('commentPost', {
  type: 'Comment',
  args: {
    content: stringArg(),
    postId: intArg(),
    authorId: intArg(),
  },
  resolve: (_, { content, authorId, postId }, context) => {
    return context.prisma.comment.create({
      data: {
        content,
        authorId,
        postId,
      },
    })
  },
})

export const Comment = objectType({
  name: 'Comment',
  nonNullDefaults: { output: true },
  definition(t) {
    t.int('id')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.string('content')
  },
})
