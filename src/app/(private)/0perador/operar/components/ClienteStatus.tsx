import { DotStatus } from "../../components/DotStatus";

interface CLienteStatusProps {
  status: "AGUARDANDO" | "INICIANDO" | "CONCLUIDO" | "ENCERRADO";
}

const statusConfig = {
  AGUARDANDO: {
    text: "Contectado, aguardando inicio",
    type: "yellow",
  },
  INICIANDO: {
    text: "Operando",
    type: "blue",
  },
  CONCLUIDO: {
    text: "Concluído",
    type: "green",
  },
  ENCERRADO: {
    text: "Encerrado",
    type: "red",
  },
  ERRO: {
    text: "Sem dados",
    type: "gray",
  },
} as const;

export function CLienteStatus({ status }: CLienteStatusProps) {
  const cfg = statusConfig[status];
  if (!cfg) return null;

  return (
    <div>
      <div>
        <DotStatus type={cfg.type} animate />
        {cfg.text}
      </div>
    </div>
  );
}
