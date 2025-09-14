'use client';

import { useSocketCtx } from '@/app/providers/SocketProvider';
import { useEffect, useState } from 'react';

export function useSocketEvent<T>(eventName: string) {
  const { socket } = useSocketCtx();
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!socket) return;
    const handler = (payload: T) => setData(payload);
    socket.on(eventName, handler);
    return () => {
      socket.off(eventName, handler);
    };
  }, [socket, eventName]);

  return data;
}
