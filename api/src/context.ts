import { PrismaClient } from '@prisma/client'

export interface Context {
  prisma: PrismaClient
  session?: Auth.Session
}

export const prisma = new PrismaClient()

export const context: Context = {
  prisma: prisma,
}
