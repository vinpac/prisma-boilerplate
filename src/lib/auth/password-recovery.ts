import { prisma } from '@context'
import {
  sendEmail,
  getAppPath,
  hashPassword,
  assertRecordExists,
  invariant,
  getEmailTemplateId,
} from '@samba'

export const requestPasswordRecoveryByEmail = async (email: string) => {
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

export const recoverPassword = async (token: string, newPassword: string) => {
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
