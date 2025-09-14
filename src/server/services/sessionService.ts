import { SessionAnalytics } from '../dto/sessionAnalytics';
import { SessionRepository } from '../repositories/sessionRepository';

export class SessionService {
  private repo: SessionRepository;

  constructor(repo: SessionRepository) {
    this.repo = repo;
  }

  async getSessionAnalytics(): Promise<SessionAnalytics[]> {
    const sessions = await this.repo.getAllSessions();

    return sessions.map((s) => ({
      sessionId: s.sessionId,
      usuario: s.clientUser?.usuario ?? null,
      senha: s.clientUser?.senha ?? null,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      status: s.data?.status ?? 'AGUARDANDO',
      isOnline: s.data?.isOnline ?? false,
      startedAt: s.data?.startedAt.toISOString() ?? s.createdAt.toISOString(),
    }));
  }
}
