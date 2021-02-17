import { prisma } from '@context'
import mustache from 'mustache'
import { assertRecordExists } from '@samba/invariant'

export const getAppPath = async (
  name: string,
  replaceData?: Record<string, string>,
): Promise<string> => {
  const record = await prisma.api_AppPath.findUnique({
    where: { name },
  })

  assertRecordExists(record, 'api_AppPath')

  if (replaceData) {
    return mustache.render(record.value, replaceData)
  }

  return record.value
}
