import { bus, SESSIONS_UPDATE, type SessionsUpdatePayload } from '@/server/events/bus';
import { initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { z } from 'zod';
import { SessionByIdService } from '../services/sessionByIdService';

const t = initTRPC.create();
const service = new SessionByIdService();

export const sessionByIdRouter = t.router({
  onDetails: t.procedure
    .input(z.object({ sessionId: z.string().min(1) }))
    .subscription(({ input }) =>
      observable<Awaited<ReturnType<typeof service.get>>>((emit) => {
        let closed = false;

        const push = async () => {
          if (closed) return;
          const data = await service.get(input.sessionId);
          emit.next(data);
        };

        void push();

        const handler = (payload?: SessionsUpdatePayload) => {
          if (!payload?.sessionId || payload.sessionId === input.sessionId) {
            void push();
          }
        };

        bus.on(SESSIONS_UPDATE, handler);
        return () => {
          closed = true;
          bus.off(SESSIONS_UPDATE, handler);
        };
      }),
    ),
});
