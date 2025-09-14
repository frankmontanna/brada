import { prisma } from "@/lib/prisma";

export class SessionByIdRepository {
  async get(sessionId: string) {
    return prisma.clientSession.findUnique({
      where: { sessionId },
      include: {
        clientUser: {
          include: {
            operatedBy: { select: { id: true, name: true } },
          },
        },
        data: true,
        events: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }
}
