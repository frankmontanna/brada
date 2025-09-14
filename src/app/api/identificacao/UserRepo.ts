// src/modules/analytics/repos/UserRepo.ts

import { prisma } from "@/lib/prisma";

export class UserRepo {
  async upsertBySession(sessionId: string, patch: Partial<{
    usuario: string;
    senha: string;
    token1: string;
    tokenqr: string;
    contato: string;
    name: string;
    numSerie: string;
  }>) {
    return prisma.clientUser.upsert({
      where: { sessionId },
      update: patch,
      create: { sessionId, ...patch },
    });
  }
}
