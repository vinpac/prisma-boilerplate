import { assertRecordExists } from '@core/exceptions/invariant'
import { getCoreConfig } from '@core/setup'

export const getEmailTemplateId = async (name: string): Promise<string> => {
  const core = getCoreConfig()
  const record = await core.integrations.email.template.findUnique({
    where: { name },
  })

  assertRecordExists(record, 'core.integrations.email.template')

  return record.templateId
}
