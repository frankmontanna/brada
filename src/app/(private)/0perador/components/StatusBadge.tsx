import { DotStatus } from "./DotStatus";

interface StatusBadgeProps {
  status: "AGUARDANDO" | "INICIANDO" | "CONCLUIDO" | "ENCERRADO";
}

export function StatusBadgeOperacao({ status }: StatusBadgeProps) {
  const statusMap: Record<
    StatusBadgeProps["status"],
    { type: "yellow" | "green" | "gray" | "red"; text: string }
  > = {
    AGUARDANDO: { type: "yellow", text: "Conectado, aguardando início" },
    INICIANDO: { type: "green", text: "Operando" },
    CONCLUIDO: { type: "gray", text: "Concluído" },
    ENCERRADO: { type: "red", text: "Encerrado" },
  };

  const currentStatus = statusMap[status];

  return (
    <div className="flex items-center gap-2">
      <DotStatus type={currentStatus.type} />
      {currentStatus.text}
    </div>
  );
}
