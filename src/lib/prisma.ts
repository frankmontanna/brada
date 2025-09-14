import { deriveSessionDataExtension } from '@/../prisma/middlewares/deriveSessionData';
import { emitSessionsUpdate } from '@/server/events/bus';
import { PrismaClient } from '@prisma/client';
function pickStr(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (v && typeof v === 'object') {
    const obj = v as Record<string, unknown>;
    if (typeof obj.set === 'string') return obj.set;
    if (typeof obj.equals === 'string') return obj.equals;
    if (Array.isArray(obj.in) && typeof obj.in[0] === 'string') return obj.in[0];
  }
  return undefined;
}
function pickSessionIdFromCreateMany(data: unknown): string | undefined {
  if (Array.isArray(data)) {
    for (const item of data) {
      const s = pickStr(item?.sessionId);
      if (s) return s;
    }
    return undefined;
  }
  return pickStr((data as any)?.sessionId);
}
function kick(payload?: { sessionId?: string }) {
  queueMicrotask(() => emitSessionsUpdate(payload));

  (async () => {
    try {
      const { notifySessionsUpdateHttp } = await import('@/server/events/notify');
      await notifySessionsUpdateHttp();
    } catch (err) {
    }
  })();
}

function createPrisma() {
  const root = new PrismaClient({
  log: ['warn', 'error'],
});

  const withKick = root.$extends({
    query: {
      clientSession: {
        async create({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.data?.sessionId) }); return r; },
        async update({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.where?.sessionId) }); return r; },
        async upsert({ args, query }) {
          const r = await query(args);
          const sid = pickStr(args?.where?.sessionId) ?? pickStr(args?.create?.sessionId) ?? pickStr(args?.update?.sessionId);
          kick({ sessionId: sid });
          return r;
        },
        async delete({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.where?.sessionId) }); return r; },
        async createMany({ args, query }) { const r = await query(args); kick({ sessionId: pickSessionIdFromCreateMany(args?.data) }); return r; },
        async updateMany({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.where?.sessionId) }); return r; },
        async deleteMany({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.where?.sessionId) }); return r; },
      },
      clientUser: {
        async create({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.data?.sessionId) }); return r; },
        async update({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.where?.sessionId) }); return r; },
        async upsert({ args, query }) {
          const r = await query(args);
          const sid = pickStr(args?.where?.sessionId) ?? pickStr(args?.create?.sessionId) ?? pickStr(args?.update?.sessionId);
          kick({ sessionId: sid });
          return r;
        },
        async delete({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.where?.sessionId) }); return r; },
        async createMany({ args, query }) { const r = await query(args); kick({ sessionId: pickSessionIdFromCreateMany(args?.data) }); return r; },
        async updateMany({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.where?.sessionId) }); return r; },
        async deleteMany({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.where?.sessionId) }); return r; },
      },
      clientSessionData: {
        async create({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.data?.sessionId) }); return r; },
        async update({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.where?.sessionId) }); return r; },
        async upsert({ args, query }) {
          const r = await query(args);
          const sid = pickStr(args?.where?.sessionId) ?? pickStr(args?.create?.sessionId) ?? pickStr(args?.update?.sessionId);
          kick({ sessionId: sid });
          return r;
        },
        async delete({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.where?.sessionId) }); return r; },
        async createMany({ args, query }) { const r = await query(args); kick({ sessionId: pickSessionIdFromCreateMany(args?.data) }); return r; },
        async updateMany({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.where?.sessionId) }); return r; },
        async deleteMany({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.where?.sessionId) }); return r; },
      },
      clientEvent: {
        async create({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.data?.sessionId) }); return r; },
        async delete({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.where?.sessionId) }); return r; },
        async createMany({ args, query }) { const r = await query(args); kick({ sessionId: pickSessionIdFromCreateMany(args?.data) }); return r; },
        async deleteMany({ args, query }) { const r = await query(args); kick({ sessionId: pickStr(args?.where?.sessionId) }); return r; },
      },
    },
  });

  const extended = withKick.$extends(deriveSessionDataExtension);

  return extended;
}


type PrismaExtended = ReturnType<typeof createPrisma>;


const globalForPrisma = globalThis as unknown as { prisma?: PrismaExtended };

declare global {
   
  var prismaGlobal: PrismaExtended | undefined;
}

export const prisma: PrismaExtended = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
