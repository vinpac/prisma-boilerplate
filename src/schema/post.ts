import {
  arg,
  enumType,
  inputObjectType,
  intArg,
  list,
  mutationField,
  objectType,
  queryField,
} from 'nexus'

export const feed = queryField('feed', {
  type: list('Post'),
  resolve: (_, __, ctx) => {
    return ctx.prisma.post.findMany({
      include: { author: true, comments: true, likedBy: true },
      orderBy: [{ id: 'desc' }],
      take: 25,
    })
  },
})
export const createDraft = mutationField('createDraft', {
  type: 'Post',
  args: {
    data: arg({
      type: 'PostCreateInput',
    }),
    userId: intArg(),
  },
  resolve: (_, args, context) => {
    return context.prisma.post.create({
      data: {
        title: args.data.title,
        content: args.data.content,
        author: {
          connect: { id: args.userId },
        },
      },
    })
  },
})

export const likePost = mutationField('likePost', {
  type: 'Boolean',
  args: {
    userId: intArg(),
    postId: intArg(),
  },
  resolve: async (_, { postId, userId }, context) => {
    await context.prisma.user.update({
      data: {
        likes: {
          connect: {
            id: postId,
          },
        },
      },
      where: {
        id: userId,
      },
    })
    return true
  },
})

// mutation((t) =>
//   t.field('createDraft', {
//     type: 'Post',
//     args: {
//       data: nonNull(
//         arg({
//           type: 'PostCreateInput',
//         }),
//       ),
//       authorEmail: nonNull(stringArg()),
//     },
//     resolve: (_, args, context) => {
//       return context.prisma.post.create({
//         data: {
//           title: args.data.title,
//           content: args.data.content,
//           author: {
//             connect: { email: args.authorEmail },
//           },
//         },
//       })
//     },
//   }),
// )

// query((t) => {
//   t.list.field('draftsByUser', {
//     type: 'Post',
//     args: {
//       userUniqueInput: nonNull(
//         arg({
//           type: 'UserUniqueInput',
//         }),
//       ),
//     },
//     resolve: (_parent, args, context) => {
//       return context.prisma.user
//         .findUnique({
//           where: {
//             id: args.userUniqueInput.id || undefined,
//             email: args.userUniqueInput.email || undefined,
//           },
//         })
//         .posts({
//           where: {
//             published: false,
//           },
//         })
//     },
//   })

//   t.nonNull.list.nonNull.field('feed', {
//     type: 'Post',
//     args: {
//       searchString: stringArg(),
//       skip: intArg(),
//       take: intArg(),
//       orderBy: arg({
//         type: 'PostOrderByUpdatedAtInput',
//       }),
//     },
//     resolve: (_parent, args, context) => {
//       const or = args.searchString
//         ? {
//             OR: [
//               { title: { contains: args.searchString } },
//               { content: { contains: args.searchString } },
//             ],
//           }
//         : {}

//       return context.prisma.post.findMany({
//         where: {
//           published: true,
//           ...or,
//         },
//         take: args.take || undefined,
//         skip: args.skip || undefined,
//         orderBy: args.orderBy || undefined,
//       })
//     },
//   })

//   t.nonNull.list.nonNull.field('myPosts', {
//     type: 'Post',
//     args: {
//       id: intArg(),
//     },
//     resolve: (_parent, args, context) => {
//       return context.prisma.post.findMany({
//         where: {
//           authorId: 1,
//         },
//       })
//     },
//   })

//   t.nullable.field('postById', {
//     type: 'Post',
//     args: {
//       id: intArg(),
//     },
//     resolve: (_parent, args, context) => {
//       return context.prisma.post.findUnique({
//         where: { id: args.id || undefined },
//       })
//     },
//   })
// })

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.string('title')
    t.string('content')
    t.nonNull.boolean('published')
    t.nonNull.int('viewCount')

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

export const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})

export const PostOrderByUpdatedAtInput = inputObjectType({
  name: 'PostOrderByUpdatedAtInput',
  definition(t) {
    t.nonNull.field('updatedAt', { type: 'SortOrder' })
  },
})

export const PostCreateInput = inputObjectType({
  name: 'PostCreateInput',
  definition(t) {
    t.nonNull.string('title')
    t.string('content')
  },
})
