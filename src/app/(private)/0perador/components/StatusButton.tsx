// src\app\(private)\0perador\components\StatusButton.tsx

import { Button } from "@/components/ui/button";
import { IconCheck, IconHeadset, IconLoader, IconX } from "@tabler/icons-react";

interface StatusButtonProps {
  status: "AGUARDANDO" | "INICIANDO" | "CONCLUIDO" | "ENCERRADO";
}

const statusConfig = {
  AGUARDANDO: {
    icon: <IconLoader className="animate-spin" />,
    text: "Aguardando...",
    className: "",
  },
  INICIANDO: {
    icon: <IconHeadset />,
    text: "Operando",
    className: "blueBav",
  },
  CONCLUIDO: {
    icon: <IconCheck />,
    text: "Concluído",
    className: "greenVar",
  },
  ENCERRADO: {
    icon: <IconX />,
    text: "Encerrado",
    className: "redVar",
  },
} as const;

export function StatusButton({ status }: StatusButtonProps) {
  const cfg = statusConfig[status];
  if (!cfg) return null;

  return (
    <Button className={`w-full cursor-pointer ${cfg.className}`}>
      {cfg.icon}
      {cfg.text}
    </Button>
  );
}
