import { prisma } from '@context'
import { assertRecordExists } from '@samba/invariant'

export const getEmailTemplateId = async (name: string): Promise<string> => {
  const record = await prisma.api_SendGridEmailTemplate.findUnique({
    where: { name },
  })

  assertRecordExists(record, ['api_SendGridEmailTemplate', 'name', name])

  return record.templateId
}
