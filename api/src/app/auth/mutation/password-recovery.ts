import { prisma } from '@context'
import { hashPassword } from '@core/auth'
import { assertRecordExists, invariant, RecordNotFound } from '@core/exceptions'
import { getAppPath } from '@core/integrations/app'
import { getEmailTemplateId, sendEmail } from '@core/integrations/email'
import { PasswordRecoveryRequest } from '@prisma/client'
import * as r from '@core/resolver'
import { stringArg } from 'nexus'
import { RequestPasswordRecoveryInput } from '@app/auth/validations'

r.mutation('requestPasswordRecovery', {
  type: 'Boolean',
  args: {
    email: stringArg(),
  },
})
  .pipe(r.zod(RequestPasswordRecoveryInput))
  .pipe(async ({ email }) => {
    try {
      await requestPasswordRecoveryByEmail(email)
    } catch (error) {
      if (
        error instanceof RecordNotFound &&
        error.extensions.target[0] === 'user'
      ) {
        // Don't tell tell the request if the email doesn't exist
        return true
      }

      throw error
    }

    return true
  })

export const requestPasswordRecoveryByEmail = async (
  email: string,
): Promise<PasswordRecoveryRequest> => {
  const user = await prisma.user.findFirst({ where: { email } })

  assertRecordExists(user, ['user', 'email'])

  const token = String(Date.now() * 100000000000)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 1)

  const recoveryRequest = await prisma.passwordRecoveryRequest.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  })

  const ctaLink = await getAppPath('PasswordRecovery', {
    token,
  })
  const templateId = await getEmailTemplateId('PasswordRecovery')

  await sendEmail({
    to: email,
    templateId,
    data: {
      ctaLink,
    },
  })

  return recoveryRequest
}

export const recoverPassword = async (
  token: string,
  newPassword: string,
): Promise<PasswordRecoveryRequest> => {
  const recoveryRequest = await prisma.passwordRecoveryRequest.findFirst({
    where: { token },
  })

  assertRecordExists(recoveryRequest, ['recovery_request', 'token'])
  invariant(
    !recoveryRequest.invalidatedAt,
    'invalidated_by_user',
    'This recovery request was already invalidated',
  )
  invariant(
    Date.now() < recoveryRequest.expiresAt.getTime(),
    'recovery_request_expired',
    'This recovery request is expired',
  )

  const hashedPassword = await hashPassword(newPassword)
  await prisma.passwordRecoveryRequest.updateMany({
    where: {
      userId: recoveryRequest.userId,
    },
    data: {
      invalidatedAt: new Date(),
    },
  })
  await prisma.userLogin.update({
    where: {
      UserLogin_name_value_unique_constraint: {
        name: 'password',
        userId: recoveryRequest.userId,
      },
    },
    data: {
      value: hashedPassword,
    },
  })

  return recoveryRequest
}
