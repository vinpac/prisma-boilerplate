import chalk from 'chalk'

export const required = (message: string): never => {
  console.error(message)
  process.exit(1)
}

export const logError = (message: string): void => {
  console.error(`🚨 ${chalk.red(message)}`)
}

export const env = <Value extends string>(
  envName: string,
  defaultValue?: Value,
): Value => {
  const value = process.env[envName] as Value

  if (typeof value === 'undefined') {
    if (typeof defaultValue !== 'undefined') {
      return defaultValue
    }

    logError(`Env \`${envName}\` is required`)
    process.exit(1)
  }

  return value
}
