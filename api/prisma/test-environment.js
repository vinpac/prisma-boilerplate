/* eslint-disable @typescript-eslint/explicit-function-return-type */

const NodeEnvironment = require('jest-environment-node')
const { nanoid } = require('nanoid')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const { PrismaClient } = require('@prisma/client')

const { DATABASE_URL } = process.env

class PrismaTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)

    // Generate a unique schema identifier for this test context
    this.schema = `test_${nanoid()}`

    // Generate the pg connection string for the test schema
    this.databaseUrl = `${DATABASE_URL}?schema=${this.schema}`

    // Set the required environment variable to contain the connection string
    // to our database test schema
    process.env.DATABASE_URL = this.databaseUrl
    this.global.process.env.DATABASE_URL = this.databaseUrl

    this.client = new PrismaClient()
  }

  async setup() {
    await this.client.$executeRaw(
      `create schema if not exists "${this.schema}"`,
    )

    await exec('yarn migrate')

    return super.setup()
  }

  async teardown() {
    // Drop the schema after the tests have completed
    await this.client.$executeRaw(
      `drop schema if exists "${this.schema}" cascade`,
    )
    await this.client.$disconnect()
  }
}

module.exports = PrismaTestEnvironment
