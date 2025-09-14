'use client';
import { io, Socket } from 'socket.io-client';

let s: Socket | undefined;

export function getSocket(): Socket {
  if (!s) {
    s = io('http://localhost:4000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
    });
    s.on('connect', () => console.log('[client] connected', s!.id));
    s.on('disconnect', (reason) => console.log('[client] disconnected', reason));
    s.on('connect_error', (e) => console.error('[client] connect_error', (e as Error).message));
  }
  return s;
}
