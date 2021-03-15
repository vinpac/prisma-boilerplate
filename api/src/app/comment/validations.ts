import * as z from 'zod'

export const AddCommentInput = z.object({
  content: z.string(),
  postId: z.number().int(),
  authorId: z.number().int(),
})
