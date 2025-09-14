import { prisma } from '@/lib/prisma';

export class ClientUserRepository {
  async ensureBySession(sessionId: string) {
    return prisma.clientUser.upsert({
      where: { sessionId },
      create: { sessionId },
      update: {},
    });
  }

  async setOperatedByIfEmpty(sessionId: string, operatedById?: string) {
    if (!operatedById) return this.ensureBySession(sessionId);

    const current = await prisma.clientUser.findUnique({ where: { sessionId } });
    if (current?.operatedById) return current;

    return prisma.clientUser.update({
      where: { sessionId },
      data: { operatedById },
    });
  }

  async resetUserBySessionId(sessionId: string) {
  // Zera somente os campos solicitados
  return prisma.clientUser.update({
    where: { sessionId },
    data: {
      usuario: null,
      name: null,
      senha: null,
      token1: null,
      tokenqr: null,
      numSerie: null,
    },
  });
}

  

  async upsertNameNumSerie(sessionId: string, name: string, numSerie: string, operatedById?: string) {
    const current = await this.ensureBySession(sessionId);

    return prisma.clientUser.update({
      where: { sessionId },
      data: {
        name,
        numSerie,
        ...(current.operatedById ? {} : operatedById ? { operatedById } : {}),
      },
    });
  }
}


