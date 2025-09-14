'use client';
import { useSocketCtx } from '@/app/providers/SocketProvider';
import { Events } from '@/realtime/events';
import type { ClientSessionMiniPayload } from '@/types/realtime';
import { useEffect } from 'react';
import { useSocketEvent } from './useSocket';

export function useClientSessionMini(pollMs: number = 3000) {
  const { socket } = useSocketCtx();
  const data = useSocketEvent<ClientSessionMiniPayload>(Events.MINI_DATA);

  useEffect(() => {
    if (!socket) return;
    socket.emit(Events.SUBSCRIBE_MINI, pollMs);
    return () => {
      socket.emit(Events.UNSUBSCRIBE, Events.SUBSCRIBE_MINI);
    };
  }, [socket, pollMs]);

  return data;
}
