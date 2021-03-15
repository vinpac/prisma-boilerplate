import { AddCommentInput } from '@app/comment/validations'
import { mutation, zod } from '@core/resolver'
import { intArg, stringArg } from 'nexus'

export const commentPost = mutation('commentPost', {
  type: 'Comment',
  args: {
    content: stringArg(),
    postId: intArg(),
    authorId: intArg(),
  },
})
  .pipe(zod(AddCommentInput))
  .pipe((input, ctx) => {
    return ctx.prisma.comment.create({
      data: input,
    })
  })
  .publish()
