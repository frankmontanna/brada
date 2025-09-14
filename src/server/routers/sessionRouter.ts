//src\server\routers\sessionRouter.ts
import { bus, SESSIONS_UPDATE } from '@/server/events/bus';
import { initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { WsResponse } from '../dto/sessionAnalytics';
import { SessionRepository } from '../repositories/sessionRepository';
import { SessionService } from '../services/sessionService';
const t = initTRPC.create();
const sessionService = new SessionService(new SessionRepository());
export const sessionRouter = t.router({
  onSessions: t.procedure.subscription(() =>
    observable<WsResponse>((emit) => {
      let isClosed = false;

      const push = async () => {
        if (isClosed) return;
        const data = await sessionService.getSessionAnalytics();
        emit.next(data);
      };
      void push();

      const handler = () => void push();
      bus.on(SESSIONS_UPDATE, handler);

      return () => {
        isClosed = true;
        bus.off(SESSIONS_UPDATE, handler);
      };
    }),
  ),
});
