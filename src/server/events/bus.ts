import { EventEmitter } from 'events';
export const bus = new EventEmitter();
export const SESSIONS_UPDATE = 'sessions:update';

export type SessionsUpdatePayload = { sessionId?: string };

export function emitSessionsUpdate(payload?: SessionsUpdatePayload) {
  bus.emit(SESSIONS_UPDATE, payload ?? {});
}