import {
  makeSchema,
  asNexusMethod,
  queryType,
  mutationType,
  queryField,
} from 'nexus'
import { GraphQLDateTime } from 'graphql-iso-date'
import path from 'path'
import * as post from '@schema/post'
import * as user from '@schema/user'
import * as comment from '@schema/comment'

const status = queryField('status', {
  type: 'Boolean',
  resolve: () => true,
})
const fields = [post, user, comment]

const emptyDefinition = () => {}
export const schema = makeSchema({
  types: [
    queryType({
      nonNullDefaults: {
        input: true, // input types are non-nullable by default
        output: true, // output types are non-nullable by default
      },
      definition: emptyDefinition,
    }),
    mutationType({
      nonNullDefaults: {
        input: true, // input types are non-nullable by default
        output: true, // output types are non-nullable by default
      },
      definition: emptyDefinition,
    }),
    status,

    // Transforms the exported values of ./{module}.ts into an array of fields
    // We take the `post` object, for example, and make it as a Field[]
    // Since fields an array of objects we have to reduce it first
    ...fields.reduce((list, value) => {
      list.push(Object.values(value))
      return list
    }, [] as any[]),

    // Insert the DateTime scalar
    asNexusMethod(GraphQLDateTime, 'date'),
  ],
  outputs: {
    schema: path.resolve('src', 'generated', 'schema.graphql'),
    typegen: path.resolve('src', 'generated', 'nexus.ts'),
  },
  contextType: {
    module: require.resolve('../context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})
