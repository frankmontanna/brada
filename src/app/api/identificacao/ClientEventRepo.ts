import { prisma } from "@/lib/prisma";
export class ClientEventRepo {
  async create(input: {
    sessionId: string;
    eventType: string;
    eventData?: string | null;
  }) {
    return prisma.clientEvent.create({
      data: {
        sessionId: input.sessionId,
        eventType: input.eventType,
        eventData: input.eventData ?? null,
      },
    });
  }
}
