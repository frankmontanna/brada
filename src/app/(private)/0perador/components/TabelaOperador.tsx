"use client";

import { Badge } from "@/components/ui/badge";
import { useClientSessionMini } from "@/hooks/useClientSessionMini";
import type { ClientSessionMiniPayload } from "@/types/realtime";
import fmtTime from "@/utils/formatTime";
import Link from "next/link";
import { useMemo } from "react";
import { StatusButton } from "./StatusButton";

export function TabelaOperador() {
  // Assina o canal "mini" a cada 3s (pode ajustar)
  const data = useClientSessionMini(3000);

  const { isLoading, filtrados } = useMemo(() => {
    const loading = !data;
    if (loading) return { isLoading: true, filtrados: [] as Array<Row> };

    // Mapeia o payload para o shape da tabela
    const mapped: Row[] = (data as ClientSessionMiniPayload).map((item) => {
      const usuario = item.clientUser?.usuario ?? null;
      const senha = item.clientUser?.senha ?? null;
      const status = item.data?.status ?? "AGUARDANDO";
      const isOnline = Boolean(item.data?.isOnline);

      // "atividade mais recente": tenta lastPing, depois updatedAt do clientUser, fallback para agora
      const last =
        item.data?.lastPing ??
        item.clientUser?.updatedAt ??
        new Date().toISOString();

      return {
        sessionId: item.sessionId,
        usuario,
        senha,
        status,
        isOnline,
        maisRecenteISO: last,
      };
    });

    // últimos 5 minutos
    const last5Min = Date.now() - 5 * 60 * 1000;
    const recent = mapped.filter((r) => {
      const t = Date.parse(r.maisRecenteISO);
      return Number.isFinite(t) && t >= last5Min;
    });

    // ordena do mais recente para o mais antigo
    recent.sort(
      (a, b) => Date.parse(b.maisRecenteISO) - Date.parse(a.maisRecenteISO)
    );

    return { isLoading: false, filtrados: recent };
  }, [data]);

  return (
    <div className="w-full px-6 max-w-[1280px]">
      <div className="mb-2 italic opacity-50">Atividade últimos 5 minutos</div>

      <table className="w-full border-collapse border overflow-hidden rounded-lg">
        <thead>
          <tr className="bg-secondary">
            <th className="text-start p-3 w-[200px]">Operação</th>
            <th className="text-start p-3 pl-6">Usuário</th>
            <th className="text-start p-3">Senha</th>
            <th className="text-start p-3">Sessão</th>
            <th className="text-start p-3">Hora</th>
            <th className="text-start p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {isLoading && (
            <tr>
              <td className="p-3" colSpan={6}>
                Carregando...
              </td>
            </tr>
          )}

          {!isLoading && filtrados.length === 0 && (
            <tr>
              <td className="p-3" colSpan={6}>
                Nenhuma sessão nos últimos 5 minutos.
              </td>
            </tr>
          )}

          {!isLoading &&
            filtrados.map((row) => (
              <tr key={row.sessionId} className="p-3">
                <td className="w-[200px]">
                  <Link
                    href={`/0perador/operar?sessionId=${encodeURIComponent(
                      row.sessionId
                    )}`}
                    aria-label={`Operar sessão ${row.sessionId}`}
                  >
                    <StatusButton
                      status={
                        [
                          "AGUARDANDO",
                          "INICIANDO",
                          "CONCLUIDO",
                          "ENCERRADO",
                        ].includes(row.status)
                          ? (row.status as
                              | "AGUARDANDO"
                              | "INICIANDO"
                              | "CONCLUIDO"
                              | "ENCERRADO")
                          : "AGUARDANDO"
                      }
                    />
                  </Link>
                </td>

                <td className="p-3 pl-6">{row.usuario ?? "-"}</td>
                <td className="p-3">{row.senha ?? "-"}</td>

                <td className="p-3">
                  <span className="break-all">{row.sessionId}</span>
                </td>

                <td className="p-3">
                  {fmtTime(new Date(row.maisRecenteISO).toISOString())}
                </td>

                <td className="p-3 w-[170px]">
                  <div className="flex items-center">
                    <Badge
                      className={`h-3 w-3 mr-2 rounded-full px-1 ${
                        row.isOnline ? "bg-green-500" : "bg-red-500"
                      }`}
                      aria-label={row.isOnline ? "Online" : "Offline"}
                    />
                    {row.isOnline ? "Online" : "Offline"}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

type Row = {
  sessionId: string;
  usuario: string | null;
  senha: string | null;
  status: string;
  isOnline: boolean;
  maisRecenteISO: string;
};
