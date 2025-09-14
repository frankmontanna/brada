import { prisma } from '@/lib/prisma';

export class ClientSessionRepository {
  async findMini() {
    const rows = await prisma.clientSession.findMany({
      include: {
        clientUser: {
          select: {
            usuario: true,
            senha: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        data: {
          select: {
            step: true,
            screen: true,
            status: true,
            isOnline: true,
            startedAt: true,
            lastPing: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      sessionId: r.sessionId,
      clientUser: r.clientUser ?? null,
      data: r.data ?? null,
    }));
  }

  async findById(sessionId: string) {
    return prisma.clientSession.findUnique({
      where: { sessionId },
      include: {
        clientUser: true,
        data: true,
        events: {
          orderBy: { createdAt: 'desc' },
          take: 100,
        },
      },
    });
  }
}
