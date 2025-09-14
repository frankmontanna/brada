import { prisma } from "@/lib/prisma";

export class ClientSessionRepository {
  async findById(sessionId: string) {
    return prisma.clientSession.findUnique({
      where: { sessionId },
    });
  }

  async createIfNotExists(params: {
    sessionId: string;
    ipAddress?: string;
    userAgent?: string;
    browser?: string;
    device?: string;
    os?: string;
    origin?: string | null;
    country?: string | null;
    state?: string | null;
    city?: string | null;
  }) {
    const {
      sessionId,
      ipAddress = 'unknown',
      userAgent = 'unknown',
      browser = 'unknown',
      device = 'unknown',
      os = 'unknown',
      origin = null,
      country = null,
      state = null,
      city = null,
    } = params;

    return prisma.clientSession.upsert({
      where: { sessionId },
      create: {
        sessionId,
        ipAddress,
        userAgent,
        browser,
        device,
        os,
        origin,
        country,
        state,
        city,
      },
      update: {},
    });
  }

  async deleteAllBySessionId(sessionId: string) {
    await prisma.$transaction([
      prisma.clientEvent.deleteMany({ where: { sessionId } }),
      prisma.clientSession.delete({ where: { sessionId } }),
    ]);
    return { sessionId };
  }

  // ✅ NOVO MÉTODO
  async updateTokenType(sessionId: string, tokenType: "CELULAR" | "TOKEN") {
    return prisma.clientSessionData.update({
      where: { sessionId },
      data: { tokenType },
    });
  }
}
