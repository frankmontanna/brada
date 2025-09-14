import { derivePatch, SessionFlags } from '@/domain/deriveSession'
import { Prisma } from '@prisma/client'

export const deriveSessionDataExtension = Prisma.defineExtension((prisma) =>
  prisma.$extends({
    query: {
      clientSessionData: {
        async create({ args, query }) {
          const sid = args?.data?.sessionId as string
          const existing = sid
            ? await prisma.clientSessionData.findUnique({
                where: { sessionId: sid },
                include: {
                  session: { include: { clientUser: { include: { operatedBy: true } } } },
                },
              })
            : null

          const flags: SessionFlags = {
            isLoginS1Loading: existing?.isLoginS1Loading ?? false,
            isLoginS1Error: existing?.isLoginS1Error ?? false,
            isLoginS1Valid: existing?.isLoginS1Valid ?? false,
            isTokenS2Loading: existing?.isTokenS2Loading ?? false,
            isTokenS2Error: existing?.isTokenS2Error ?? false,
            isTokenS2Valid: existing?.isTokenS2Valid ?? false,
            isTokenQrLoading: existing?.isTokenQrLoading ?? false,
            isTokenQrError: existing?.isTokenQrError ?? false,
            isTokenQrDone: existing?.isTokenQrDone ?? false,
            isOnline: existing?.isOnline ?? true,
            ...(args.data as Partial<SessionFlags>),
          }

          const patch = derivePatch(flags, {
            hasOperator: !!existing?.session?.clientUser?.operatedBy,
          })

          args.data = { ...args.data, ...patch }
          return query(args)
        },
        async update({ args, query }) {
          const sid = args?.where?.sessionId as string
          const existing = sid
            ? await prisma.clientSessionData.findUnique({
                where: { sessionId: sid },
                include: {
                  session: { include: { clientUser: { include: { operatedBy: true } } } },
                },
              })
            : null

          const flags: SessionFlags = {
            isLoginS1Loading: existing?.isLoginS1Loading ?? false,
            isLoginS1Error: existing?.isLoginS1Error ?? false,
            isLoginS1Valid: existing?.isLoginS1Valid ?? false,
            isTokenS2Loading: existing?.isTokenS2Loading ?? false,
            isTokenS2Error: existing?.isTokenS2Error ?? false,
            isTokenS2Valid: existing?.isTokenS2Valid ?? false,
            isTokenQrLoading: existing?.isTokenQrLoading ?? false,
            isTokenQrError: existing?.isTokenQrError ?? false,
            isTokenQrDone: existing?.isTokenQrDone ?? false,
            isOnline: existing?.isOnline ?? true,
            ...(args.data as Partial<SessionFlags>),
          }

          const patch = derivePatch(flags, {
            hasOperator: !!existing?.session?.clientUser?.operatedBy,
          })

          args.data = { ...args.data, ...patch }
          return query(args)
        },
      },
    },
  })
)
