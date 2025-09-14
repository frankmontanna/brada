import { ClientSessionDataRepository } from '../repositories/ClientSessionDataRepository';
import { ClientSessionRepository } from '../repositories/ClientSessionRepository';
import { ClientUserRepository } from '../repositories/ClientUserRepository';

export class EnsureSessionService {
  constructor(
    private sessions = new ClientSessionRepository(),
    private data = new ClientSessionDataRepository(),
    private users = new ClientUserRepository(),
  ) {}
  async run(sessionId: string, operatedById?: string) {
    await this.sessions.createIfNotExists({ sessionId });
    await this.data.ensure(sessionId);
    await this.users.setOperatedByIfEmpty(sessionId, operatedById);
  }
}
