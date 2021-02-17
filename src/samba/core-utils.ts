export const required = (message: string): never => {
  console.error(message)
  process.exit(1)
}
