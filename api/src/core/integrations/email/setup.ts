import sendgrid from '@sendgrid/mail'

export const setupSendGrid = (apiKey: string): void => {
  sendgrid.setApiKey(apiKey)
}
