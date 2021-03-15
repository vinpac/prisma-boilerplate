import {
  ConfirmEmailInput,
  RequestEmailValidationInput,
} from '@app/auth/validations'
import * as z from 'zod'
import * as r from '@core/resolver'
import { getAppPath } from '@core/integrations/app'
import { getEmailTemplateId, sendEmail } from '@core/integrations/email'
import { prisma } from '@context'
import {
  assertRecordExists,
  invariant,
  reportException,
} from '@core/exceptions'
import { stringArg } from 'nexus'
import { EmailConfirmationRequest } from '.prisma/client'

r.mutation('confirmEmail', {
  type: 'Boolean',
  args: {
    token: stringArg(),
  },
})
  .pipe(r.zod(ConfirmEmailInput))
  .pipe(async ({ token }) => {
    await confirmEmailByToken(token)

    return true
  })
  .publish()

export const confirmEmailByToken = async (
  token: string,
): Promise<EmailConfirmationRequest> => {
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

export const requestEmailConfirmation = async ({
  email,
  userId,
}: z.infer<
  typeof RequestEmailValidationInput
>): Promise<EmailConfirmationRequest> => {
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

    throw error
  }

  return confirmationRequest
}
