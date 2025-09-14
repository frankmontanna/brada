import { bus, SESSIONS_UPDATE } from '@/server/events/bus';
import { sessionByIdRouter } from '@/server/routers/sessionByIdRouter';
import { sessionRouter } from '@/server/routers/sessionRouter';
import { initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';
export function createContext() {
  return {};
}

const t = initTRPC.context<typeof createContext>().create();

export const appRouter = t.router({
  session: sessionRouter,
  sessionById: sessionByIdRouter,

  onSessionsUpdate: t.procedure.subscription(() =>
    observable<void>((emit) => {
      const handler = () => emit.next();
      bus.on(SESSIONS_UPDATE, handler);
      return () => bus.off(SESSIONS_UPDATE, handler);
    }),
  ),
});

export type AppRouter = typeof appRouter;
