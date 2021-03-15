import './app'

import { ApolloServer } from 'apollo-server'
import { Context, context } from './context'
import { PrismaClient } from '@prisma/client'
import { schema } from './schema'

declare global {
  export type ConfigClaims = {
    context: Context
    'auth.session': PrismaClient['authSession']
    'integrations.email.template': PrismaClient['api_SendGridEmailTemplate']
    'integrations.app.path': PrismaClient['api_AppPath']
  }

  export namespace Auth {
    export interface Session extends BaseSession {
      userId: number
    }
  }
}

export default new ApolloServer({
  schema: schema,
  context: context,
})
