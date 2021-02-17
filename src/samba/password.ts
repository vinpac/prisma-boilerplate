import { BCRYPT_ROUNDS } from '@config/constants'
import bcrypt from 'bcrypt'

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export const verifyPasswordHash = (
  hash: string,
  password: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}
