import {
  SENDGRID_API_KEY,
  SENDGRID_DEFAULT_SENDER,
  IS_DEV_ENV,
} from '@config/constants'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(SENDGRID_API_KEY)

interface SendEmailConfig {
  to: string
  from?: string
  templateId: string
  data?: Record<string, string | number>
}

export const sendEmail = async (config: SendEmailConfig) => {
  const configFrom = config.from || SENDGRID_DEFAULT_SENDER
  return sgMail
    .send({
      to: config.to,
      from: configFrom,
      templateId: config.templateId,
      dynamicTemplateData: config.data,
      mailSettings: {
        sandboxMode: {
          enable: IS_DEV_ENV,
        },
      },
    })
    .then((result) => {
      if (IS_DEV_ENV) {
        /* eslint-disable no-console */
        console.log('EMAIL ----------------------------')
        console.log('To:', config.to)
        console.log('From:', configFrom)
        console.log('Template ID:', config.templateId)
        console.log('Data:', config.data)
        /* eslint-enable no-console */
      }

      return result
    })
}
