import { env } from '@core/utils'
import server from './server'

const port = parseInt(env('PORT', '4000'), 10)

server.listen(port).then(async ({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`\
🚀 Server ready at: ${url}
⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
  `)
})
