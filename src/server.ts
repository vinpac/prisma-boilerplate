import { ApolloServer } from 'apollo-server'
import { schema } from './schema'
import { context } from './context'
import { PORT } from '@config/constants'

const server = new ApolloServer({
  schema: schema,
  context: context,
})

server.listen(PORT).then(async ({ url }) => {
  console.log(`\
🚀 Server ready at: ${url}
⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
  `)
})
