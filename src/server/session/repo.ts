import { prisma } from "@/lib/prisma";

export async function getSessionAggregate(sessionId: string) {
  const [session, user, data] = await Promise.all([
    prisma.clientSession.findUnique({ where: { sessionId } }),
    prisma.clientUser.findUnique({ where: { sessionId } }),
    prisma.clientSessionData.findUnique({ where: { sessionId } }),
  ]);

  return {
    session,
    user, 
    data,
  };
}

export async function upsertSessionData(sessionId: string, update: any) {
  return prisma.clientSessionData.upsert({
    where: { sessionId },
    create: {
      sessionId,
      ...update,
    },
    update,
  });
}
