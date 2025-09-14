import { ClientSessionRepository } from '@/repositories/ClientSessionRepository';

export class ClientSessionService {
  constructor(private readonly repo: ClientSessionRepository = new ClientSessionRepository()) {}

  async getClientSessionMini() {
    return this.repo.findMini();
  }

  async getClientSessionById(sessionId: string) {
    if (!sessionId) throw new Error('sessionId é obrigatório');
    return this.repo.findById(sessionId);
  }
}
