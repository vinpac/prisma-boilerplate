import mustache from 'mustache'
import { assertRecordExists } from '@core/exceptions'
import { getCoreConfig } from '@core/setup'

export const getAppPath = async (
  name: string,
  replaceData?: Record<string, string>,
): Promise<string> => {
  const core = getCoreConfig()
  const record = await core.integrations.app.path.findUnique({
    where: { name },
  })

  assertRecordExists(record, 'core.integrations.appPath.model')

  if (replaceData) {
    return mustache.render(record.value, replaceData)
  }

  return record.value
}
