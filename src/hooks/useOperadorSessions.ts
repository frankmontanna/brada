'use client';

import { getSocket } from '@/lib/socket/client';
import { useEffect, useState } from 'react';
export type OperadorRow = {
  sessionId: string;
  usuario: string | null;
  senha: string | null;
  status: string | null;
  isOnline: boolean | null;
  startedAt: string | null; 
  updatedAt: string | null; 
};
type SessionsPayload = OperadorRow[];

export function useOperadorSessions() {
  const [data, setData] = useState<SessionsPayload>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const socket = getSocket();

    const onData = (payload: SessionsPayload | null | undefined) => {
      console.log('[useOperadorSessions] sessions:data len=', payload?.length ?? 0);
      setData(payload ?? []);
      setIsLoading(false);
    };
    const onHello = (m: unknown) => console.log('[useOperadorSessions] hello', m);
    const onHeartbeat = (m: unknown) => console.log('[useOperadorSessions] heartbeat', m);
    const onConnect = () => {
      console.log('[useOperadorSessions] connected as', socket.id);
      socket.emit('sessions:get');
    };
    const onError = (e: unknown) => {
      console.error('[useOperadorSessions] socket error', e);
      setIsLoading(false);
    };

    socket.on('connect', onConnect);
    socket.on('hello', onHello);
    socket.on('heartbeat', onHeartbeat);
    socket.on('sessions:data', onData);
    socket.on('connect_error', onError);
    socket.on('error', onError);
    socket.emit('sessions:get');
    return () => {
      socket.off('connect', onConnect);
      socket.off('hello', onHello);
      socket.off('heartbeat', onHeartbeat);
      socket.off('sessions:data', onData);
      socket.off('connect_error', onError);
      socket.off('error', onError);
    };
  }, []);

  return { data, isLoading };
}
