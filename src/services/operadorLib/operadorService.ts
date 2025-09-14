import { prisma } from '@/lib/prisma';

export type SessionResumed = {
  sessionId: string;
  ipAddress: string;
  device: string;
  country: string | null;
  state: string | null;
  city: string | null;
  clientUser: {
    usuario: string | null;
    senha: string | null;
    contato: string | null;
    createdAt: Date;
    updatedAt: Date;
    operatedBy: { id: string; username: string } | null;
  } | null;
  data: {
    step: number | null;
    screen: string | null;
    status: string;
    lastPing: Date;
  } | null;
};

class OperadorService {
  async getAllSectionResumed(): Promise<SessionResumed[]> {
    const sessions = await prisma.clientSession.findMany({
      select: {
        sessionId: true,
        ipAddress: true,
        device: true,
        country: true,
        state: true,
        city: true,
        clientUser: {
          select: {
            usuario: true,
            senha: true,
            contato: true,
            createdAt: true,
            updatedAt: true,
            operatedBy: {
              select: { id: true, username: true }
            }
          }
        },
        data: {
          select: {
            step: true,
            screen: true,
            status: true,
            lastPing: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return sessions.map(s => ({
      sessionId: s.sessionId,
      ipAddress: s.ipAddress,
      device: s.device,
      country: s.country ?? null,
      state: s.state ?? null,
      city: s.city ?? null,
      clientUser: s.clientUser
        ? {
            usuario: s.clientUser.usuario,
            senha: s.clientUser.senha,
            contato: s.clientUser.contato,
            createdAt: s.clientUser.createdAt,
            updatedAt: s.clientUser.updatedAt,
            operatedBy: s.clientUser.operatedBy
              ? { id: s.clientUser.operatedBy.id, username: s.clientUser.operatedBy.username }
              : null
          }
        : null,
      data: s.data
        ? {
            step: s.data.step ?? null,
            screen: s.data.screen ?? null,
            status: s.data.status,
            lastPing: s.data.lastPing
          }
        : null
    }));
  }

  async getAllEvents() {
    return prisma.clientEvent.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async getSessionById(sessionId: string) {
    return prisma.clientSession.findUnique({
      where: { sessionId },
      include: {
        clientUser: {
          include: {
            operatedBy: { select: { id: true, username: true, role: true } }
          }
        },
        data: true,
        events: { orderBy: { createdAt: 'desc' } }
      }
    });
  }

  async deleteSessionCascade(sessionId: string) {
    return prisma.clientSession.delete({
      where: { sessionId }
    });
  }
}

export const operadorService = new OperadorService();
