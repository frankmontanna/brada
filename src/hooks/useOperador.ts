import type { OperadorListItem } from '@/types/operador';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';

export type ClientEvent = {
  id: string;
  sessionId: string;
  eventType: string;
  eventData: string | null;
  createdAt: string;
};

export const queryClient = new QueryClient();

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ' + res.status);
  return res.json();
}

export function useAllSectionResumed() {
  return useQuery<{ ok: boolean; data: OperadorListItem[] }>(
    {
      queryKey: ['allSectionResumed'],
      queryFn: () => fetcher('/api/operador?op=getAllSectionResumed'),
    },
    queryClient 
  );
}
export async function deleteSession(sessionId: string) {
  const res = await fetch(`/api/operador/${sessionId}`, { method: 'DELETE' });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j?.error ?? 'Falha ao deletar sessão');
  }
  return true;
}
export function useAllEvents() {
  return useQuery<{ ok: boolean; data: ClientEvent[] }>(
    {
      queryKey: ['allEvents'],
      queryFn: () => fetcher('/api/operador?op=getAllEvents'),
    },
    queryClient
  );
}

export function useDeleteSession() {
  return useMutation(
    {
      mutationFn: async (sessionId: string) => {
        const res = await fetch(`/api/operador/${sessionId}`, { method: 'DELETE' });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j?.error ?? 'Falha ao deletar sessão');
        }
        return true;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['allSectionResumed'] });
        queryClient.invalidateQueries({ queryKey: ['allEvents'] });
      },
    },
    queryClient 
  );
}
