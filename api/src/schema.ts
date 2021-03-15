import {
  makeSchema,
  asNexusMethod,
  queryType,
  mutationType,
  queryField,
} from 'nexus'
import { GraphQLDateTime } from 'graphql-iso-date'
import { getRegisteredFields } from '@core/resolver'
import path from 'path'

const status = queryField('status', {
  type: 'Boolean',
  resolve: () => true,
})

const emptyDefinition = (): void => {
  // nothing...
}

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

    // Get registered fields
    ...getRegisteredFields(),

    // Insert the DateTime scalar
    asNexusMethod(GraphQLDateTime, 'date'),
  ],
  outputs: {
    schema: path.resolve('src', 'generated', 'schema.graphql'),
    typegen: path.resolve('src', 'generated', 'nexus.ts'),
  },
  contextType: {
    module: require.resolve('./context'),
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
