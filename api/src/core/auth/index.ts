declare global {
  export namespace Auth {
    export interface BaseSession {
      hashedToken: string
      role: string
      roles: string[]
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface Session extends BaseSession {}
  }
}

export * from './password'
export * from './session'
