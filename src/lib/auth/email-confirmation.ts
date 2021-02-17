import { prisma } from '@context'
import {
  getEmailTemplateId,
  sendEmail,
  getAppPath,
  reportException,
  assertRecordExists,
  invariant,
} from '@samba'
import {
  RequestEmailValidationInput,
  RequestEmailValidationInputType,
} from './validation'

export const confirmEmail = async (token: string) => {
  const confirmationRequest = await prisma.emailConfirmationRequest.findUnique({
    where: { token },
  })

  assertRecordExists(confirmationRequest, ['emailConfirmationRequest', 'token'])
  invariant(
    !confirmationRequest.confirmedAt,
    'email_already_confirmed',
    'The email confirmation request is already confirmed',
  )

  await prisma.emailConfirmationRequest.update({
    where: { id: confirmationRequest.id },
    data: {
      confirmedAt: new Date(),
    },
  })
  await prisma.user.update({
    where: { id: confirmationRequest.userId },
    data: {
      emailConfirmed: true,
    },
  })

  return confirmationRequest
}

export const requestEmailConfirmation = async (
  input: RequestEmailValidationInputType,
) => {
  // This throws an error if input is invalid
  const { email, userId } = RequestEmailValidationInput.parse(input)

  const token = String(Date.now() * 100000000000)
  const confirmationRequest = await prisma.emailConfirmationRequest.create({
    data: {
      token,
      userId,
    },
  })

  const ctaLink = await getAppPath('EmailConfirmation', {
    token,
  })
  const templateId = await getEmailTemplateId('EmailConfirmation')

  try {
    await sendEmail({
      to: email,
      templateId,
      data: {
        ctaLink,
      },
    })
  } catch (error) {
    // Remove email confirmation
    await prisma.emailConfirmationRequest.delete({
      where: { id: confirmationRequest.id },
    })

    reportException(error)
  }
}
