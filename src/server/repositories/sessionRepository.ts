import { prisma } from "@/lib/prisma";

export class SessionRepository {
  async getAllSessions() {
    return prisma.clientSession.findMany({
      include: {
        clientUser: true,
        data: true,
      },
    });
  }
}
