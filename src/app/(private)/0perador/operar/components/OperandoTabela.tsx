"use client";

import fmtTime from "@/utils/formatTime";

interface OperandoTabelaProps {
  estado?: string;
  cidade?: string;
  device?: string;
  hora?: string;
}

export function OperandoTabela(props: OperandoTabelaProps) {
  return (
    <div className="w-full ">
      <div className="w-full overflow-hidden rounded-lg border">
        {/* Cabeçalho */}
        <div className="flex bg-secondary font-bold">
          <div className="flex-1 p-3 text-start">Estado</div>
          <div className="flex-1 p-3 text-start">Cidade</div>
          <div className="flex-1 p-3 text-start">Dispositivo</div>
          <div className="flex-1 p-3 text-start">Hora</div>
        </div>

        {/* Linha de dados */}
        <div className="flex border-t">
          <div className="flex-1 p-3">{props.estado}</div>
          <div className="flex-1 p-3">{props.cidade}</div>
          <div className="flex-1 p-3">{props.device}</div>
          <div className="flex-1 p-3">{fmtTime(props.hora)}</div>
        </div>
      </div>
    </div>
  );
}
