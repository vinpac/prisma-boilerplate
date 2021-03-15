import { getCoreConfig } from '@core/setup'
import bcrypt from 'bcrypt'

export const hashPassword = (password: string): Promise<string> => {
  const core = getCoreConfig()
  return bcrypt.hash(password, core.auth.hashRounds)
}

export const verifyPasswordHash = (
  hash: string,
  password: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}
