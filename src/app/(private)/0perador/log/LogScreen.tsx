"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { useAllEvents } from "@/hooks/useOperador";

function truncate(s: string | null, n = 80) {
  if (!s) return "-";
  return s.length > n ? s.slice(0, n) + "…" : s;
}

export function LogScreen() {
  const { data, isLoading, isError } = useAllEvents();

  if (isLoading)
    return (
      <TableRow>
        <TableCell colSpan={4}>Carregando eventos…</TableCell>
      </TableRow>
    );
  if (isError)
    return (
      <TableRow>
        <TableCell colSpan={4}>Erro ao carregar eventos.</TableCell>
      </TableRow>
    );

  const events = data?.data ?? [];

  return (
    <div>
      <div className="w-full max-w-[1024px] h-full bg-secondary rounded-sm border">
        {events.map((ev) => (
          <div key={ev.id} className="p-2 text-cyan-400">
            <p className="inline-block">&#91;&#42;&#93; &nbsp;</p>

            <p className="inline-block">{ev.eventType}&nbsp;&nbsp;</p>
            <p className="inline-block">[{ev.sessionId}]&nbsp;&nbsp;</p>
            <p className="inline-block">{truncate(ev.eventData)}&nbsp;&nbsp;</p>
            <p className="inline-block">
              {new Date(ev.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
