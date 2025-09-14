import { ClientSessionService } from '@/repositories/ClientSessionService';
import type { Server as HTTPServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import { Events } from './events';

type IntervalMap = Map<string, NodeJS.Timeout>;

let io: IOServer | undefined;

export function initSocketServer(server: HTTPServer) {
  if (io) return io;

  io = new IOServer(server, {
    cors: { origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3000'] },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket: Socket) => {
    const service = new ClientSessionService();
    const intervals: IntervalMap = new Map();

    socket.on(Events.SUBSCRIBE_MINI, async (pollMs: number = 3000) => {
      clearIntervalIfAny(intervals, Events.SUBSCRIBE_MINI);
      emitMini(socket, service).catch(console.error);
      const id = setInterval(() => emitMini(socket, service).catch(console.error), pollMs);
      intervals.set(Events.SUBSCRIBE_MINI, id);
    });

    socket.on(Events.SUBSCRIBE_BY_ID, async (params: { sessionId: string; pollMs?: number }) => {
      const { sessionId, pollMs = 3000 } = params ?? {};
      if (!sessionId) return;
      clearIntervalIfAny(intervals, Events.SUBSCRIBE_BY_ID + sessionId);
      const room = `session:${sessionId}`;
      await socket.join(room);
      emitById(socket, service, sessionId).catch(console.error);
      const id = setInterval(() => emitById(socket, service, sessionId).catch(console.error), pollMs);
      intervals.set(Events.SUBSCRIBE_BY_ID + sessionId, id);
    });

    socket.on(Events.UNSUBSCRIBE, (key?: string) => {
      if (key) {
        clearIntervalIfAny(intervals, key);
      } else {
        for (const [k] of intervals) clearIntervalIfAny(intervals, k);
      }
    });

    socket.on('disconnect', () => {
      for (const [k] of intervals) clearIntervalIfAny(intervals, k);
    });
  });

  return io;
}

function clearIntervalIfAny(map: IntervalMap, key: string) {
  const i = map.get(key);
  if (i) {
    clearInterval(i);
    map.delete(key);
  }
}

async function emitMini(socket: Socket, service: ClientSessionService) {
  const data = await service.getClientSessionMini();
  socket.emit(Events.MINI_DATA, data);
}

async function emitById(socket: Socket, service: ClientSessionService, sessionId: string) {
  const data = await service.getClientSessionById(sessionId);
  socket.emit(Events.BY_ID_DATA, data);
}
