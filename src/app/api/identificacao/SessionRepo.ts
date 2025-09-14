import { prisma } from "@/lib/prisma";

export class SessionRepo {
  async get(sessionId: string) {
    return prisma.clientSession.findUnique({
      where: { sessionId },
      include: { data: true, clientUser: true },
    });
  }
  async ensureData(sessionId: string) {
    
    return prisma.clientSessionData.upsert({
      where: { sessionId },
      update: {},
      create: { sessionId },
    });
  }

  async createWithData(input: {
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    browser: string;
    device: string;
    os: string;
    origin?: string | null;
    country?: string | null;
    state?: string | null;
    city?: string | null;
  }) {
    return prisma.clientSession.create({
      data: {
        sessionId: input.sessionId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        browser: input.browser,
        device: input.device,
        os: input.os,
        origin: input.origin ?? null,
        country: input.country ?? null,
        state: input.state ?? null,
        city: input.city ?? null,
        data: { create: {} },
      },
      include: { data: true, clientUser: true },
    });
  }

  async updatePing(sessionId: string) {
    await this.ensureData(sessionId);
    return prisma.clientSessionData.update({
      where: { sessionId },
      data: { isOnline: true, lastPing: new Date() },
    });
  }

  async updateGeoAndUA(sessionId: string, patch: any) {
    return prisma.clientSession.update({
      where: { sessionId },
      data: patch,
    });
  }

  async markOffline(sessionId: string) {
    await this.ensureData(sessionId);
    return prisma.clientSessionData.update({
      where: { sessionId },
      data: { isOnline: false },
    });
  }
  async updateData(sessionId: string, patch: Partial<{
    isLoginS1Loading: boolean;
    isLoginS1Error: boolean;
    isLoginS1Valid: boolean;
    isTokenS2Loading: boolean;
    isTokenS2Error: boolean;
    isTokenS2Valid: boolean;
    isTokenQrLoading: boolean;
    isTokenQrError: boolean;
    isTokenQrDone: boolean;
    step: number | null;
    screen: any;
    status: any;
    isOnline: boolean;
    lastPing: Date;
    qrCodeUrl: string | null;
  }>) {
    await this.ensureData(sessionId);
    return prisma.clientSessionData.update({
      where: { sessionId },
      data: patch,
    });
  }

  async markOfflineWhereStale(thresholdMs: number) {
    const cutoff = new Date(Date.now() - thresholdMs);
    return prisma.clientSessionData.updateMany({
      where: {
        isOnline: true,
        lastPing: { lt: cutoff },
      },
      data: { isOnline: false },
    });
  }
}


