'use client';

import { useSocketCtx } from '@/app/providers/SocketProvider';
import { Events } from '@/realtime/events';
import type { ClientSessionByIdPayload } from '@/types/realtime';
import { useEffect } from 'react';
import { useSocketEvent } from './useSocket';

export function useClientSessionById(sessionId: string | null, pollMs: number = 3000) {
  const { socket } = useSocketCtx();
  const data = useSocketEvent<ClientSessionByIdPayload>(Events.BY_ID_DATA);

  useEffect(() => {
    if (!socket || !sessionId) return;
    socket.emit(Events.SUBSCRIBE_BY_ID, { sessionId, pollMs });
    return () => {
      socket.emit(Events.UNSUBSCRIBE, Events.SUBSCRIBE_BY_ID + sessionId);
    };
  }, [socket, sessionId, pollMs]);

  return data;
}
