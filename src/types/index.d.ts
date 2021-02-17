import { ObjectDefinitionBlock } from 'nexus/dist/core'

declare global {
  export interface Mutation {
    (t: ObjectDefinitionBlock<'Mutation'>): any
  }
}
