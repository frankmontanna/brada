'use client';

import { getSocket } from '@/lib/socket/client';
import type { SessionDetailsDTO } from '@/server/dto/sessionDetails';
import { useEffect, useState } from 'react';

type Payload = SessionDetailsDTO | null;

export function useSessionDetails(sessionId: string) {
  const [data, setData] = useState<Payload>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const socket = getSocket();

    const onDetails = (payload: Payload) => {
      setData(payload);
      setIsLoading(false);
    };
    const onError = (err: unknown) => {
      console.error('[socket session:details] error:', err);
      setIsLoading(false);
    };

    socket.emit('session:join', sessionId);
    socket.on('session:details', onDetails);
    socket.on('connect_error', onError);
    socket.on('error', onError);

    return () => {
      socket.off('session:details', onDetails);
      socket.off('connect_error', onError);
      socket.off('error', onError);
    };
  }, [sessionId]);

  return { data, isLoading };
}
