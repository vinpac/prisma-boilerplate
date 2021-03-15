import { getCoreConfig } from '@core/setup'
import sendgrid from '@sendgrid/mail'
import { ClientResponse } from '@sendgrid/client/src/response'

interface SendEmailConfig {
  to: string
  from?: string
  templateId: string
  data?: Record<string, string | number>
}

export const sendEmail = async (
  config: SendEmailConfig,
): Promise<ClientResponse> => {
  const core = getCoreConfig()
  const configFrom = config.from || core.integrations.email.defaultSender
  return sendgrid
    .send({
      to: config.to,
      from: configFrom,
      templateId: config.templateId,
      dynamicTemplateData: config.data,
      mailSettings: {
        sandboxMode: {
          enable: core.integrations.email.sandboxMode,
        },
      },
    })
    .then((result) => {
      if (core.integrations.email.sandboxMode) {
        /* eslint-disable no-console */
        console.log('EMAIL ----------------------------')
        console.log('To:', config.to)
        console.log('From:', configFrom)
        console.log('Template ID:', config.templateId)
        console.log('Data:', config.data)
        /* eslint-enable no-console */
      }

      return result[0]
    })
}
