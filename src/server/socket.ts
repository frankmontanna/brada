// src/server/socket.ts
import type { Server as IOServer } from 'socket.io';

declare global {
   
  var _io: IOServer | undefined;
}
export function io() {
  if (!(global as any)._io) {
    throw new Error('Socket.IO não inicializado (ver server.ts)');
  }
  return (global as any)._io as IOServer;
}
