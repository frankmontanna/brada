
import { prisma } from "@/lib/prisma";
import { ClientSessionDataRepository } from "../repositories/ClientSessionDataRepository";
import { ClientUserRepository } from "../repositories/ClientUserRepository";

export class RestartUserService {
  private users = new ClientUserRepository();
  private data = new ClientSessionDataRepository();

  async run(sessionId: string) {
    // Garante atomicidade
    const [_, sessionData] = await prisma.$transaction([
      // mantém o reset do usuário como antes
      this.users.resetUserBySessionId(sessionId) as any,
      this.data.resetFlagsBySessionId(sessionId) as any,
    ]);

    return { data: sessionData };
  }
}
