import type { SessionDetailsDTO } from '../dto/sessionDetails';
import { SessionByIdRepository } from '../repositories/sessionByIdRepository';

export class SessionByIdService {
  constructor(private repo = new SessionByIdRepository()) {}

  async get(sessionId: string): Promise<SessionDetailsDTO | null> {
    const s = await this.repo.get(sessionId);
    if (!s) return null;

    const iso = (d: Date | null | undefined) => (d ? d.toISOString() : null);

    return {
      sessionId: s.sessionId,
      ipAddress: s.ipAddress ?? null,
      userAgent: s.userAgent ?? null,
      browser: s.browser ?? null,
      device: s.device ?? null,
      os: s.os ?? null,
      origin: s.origin ?? null,
      country: s.country ?? null,
      state: s.state ?? null,
      city: s.city ?? null,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),

      clientUser: s.clientUser
        ? {
            id: s.clientUser.id ?? null,
            usuario: s.clientUser.usuario ?? null,
            name: s.clientUser.name ?? null,
            senha: s.clientUser.senha ?? null,
            token1: s.clientUser.token1 ?? null,
            tokenqr: s.clientUser.tokenqr ?? null,
            numSerie: s.clientUser.numSerie ?? null,
            contato: s.clientUser.contato ?? null,
            sessionId: s.clientUser.sessionId ?? null,
            createdAt: iso(s.clientUser.createdAt),
            updatedAt: iso(s.clientUser.updatedAt),
            operatedById: s.clientUser.operatedById ?? null,
            operatedBy: s.clientUser.operatedBy
              ? { id: s.clientUser.operatedBy.id ?? null, name: s.clientUser.operatedBy.name ?? null }
              : null,
          }
        : null,

      data: s.data
        ? {
            sessionId: s.data.sessionId ?? null,
            tokenType: s.data.tokenType ?? null,
            isLoginS1Loading: s.data.isLoginS1Loading ?? null,
            isLoginS1Error: s.data.isLoginS1Error ?? null,
            isLoginS1Valid: s.data.isLoginS1Valid ?? null,
            isTokenS2Loading: s.data.isTokenS2Loading ?? null,
            isTokenS2Error: s.data.isTokenS2Error ?? null,
            isTokenS2Valid: s.data.isTokenS2Valid ?? null,
            isTokenQrLoading: s.data.isTokenQrLoading ?? null,
            isTokenQrError: s.data.isTokenQrError ?? null,
            isTokenQrDone: s.data.isTokenQrDone ?? null,
            qrCodeUrl: s.data.qrCodeUrl ?? null,
            step: s.data.step ?? null,
            screen: s.data.screen ?? null,
            status: s.data.status ?? null,
            isOnline: s.data.isOnline ?? null,
            startedAt: iso(s.data.startedAt),
            endedAt: iso(s.data.endedAt),
            lastPing: iso(s.data.lastPing),
          }
        : null,

      events: (s.events ?? []).map((e) => ({
        id: e.id ?? null,
        sessionId: e.sessionId ?? null,
        eventType: e.eventType ?? null,
        eventData: e.eventData ?? null,
        createdAt: iso(e.createdAt),
      })),
    };
  }
}
