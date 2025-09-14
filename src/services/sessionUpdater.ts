import { derivePatch, SessionFlags } from '@/domain/deriveSession'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function updateSessionDerivedFields(
  sessionId: string,
  incomingPartial: Partial<SessionFlags> = {},
) {
  const existing = await prisma.clientSessionData.findUnique({
    where: { sessionId },
    include: {
      session: {
        include: {
          clientUser: {
            include: { operatedBy: true },
          },
        },
      },
    },
  })

  if (!existing) {
    throw new Error(`ClientSessionData não encontrada para sessionId=${sessionId}`)
  }

  const hasOperator = !!existing.session?.clientUser?.operatedBy

  const flags: SessionFlags = {
    isLoginS1Loading: existing.isLoginS1Loading,
    isLoginS1Error:   existing.isLoginS1Error,
    isLoginS1Valid:   existing.isLoginS1Valid,
    isTokenS2Loading: existing.isTokenS2Loading,
    isTokenS2Error:   existing.isTokenS2Error,
    isTokenS2Valid:   existing.isTokenS2Valid,
    isTokenQrLoading: existing.isTokenQrLoading,
    isTokenQrError:   existing.isTokenQrError,
    isTokenQrDone:    existing.isTokenQrDone,
    isOnline:         existing.isOnline,
    ...incomingPartial,
  }

  const patch = derivePatch(flags, { hasOperator })

  await prisma.clientSessionData.update({
    where: { sessionId },
    data: patch,
  })

  return patch
}
