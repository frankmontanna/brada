import {
  IconCheck,
  IconHeadset,
  IconPlayerPlayFilled,
  IconPlugConnectedX,
} from "@tabler/icons-react";

interface ButtonAnimationProps {
  type?: "waiting" | "operating" | "done" | "disconected";
}

export function ButtonAnimation({ type = "waiting" }: ButtonAnimationProps) {
  const variants = {
    waiting: {
      label: "Iniciar Operação",
      icon: <IconPlayerPlayFilled size={18} />,
      bg: "bg-yellow-500 animate-pulse",
    },
    operating: {
      label: "Operando",
      icon: <IconHeadset size={18} className="" />,
      bg: "bg-blue-500",
    },
    done: {
      label: "Finalizada",
      icon: <IconCheck size={18} />,
      bg: "bg-emerald-500",
    },
    disconected: {
      label: "Desconectado",
      icon: <IconPlugConnectedX size={18} />,
      bg: "bg-neutral-500",
    },
  };

  const current = variants[type];

  return (
    <div className="relative cursor-pointer w-fit h-fit">
      <div
        className="absolute top-0 left-0 h-11 min-w-[200px]
        flex items-center justify-center gap-2 z-[1]"
      >
        {current.icon} {current.label}
      </div>
      <button
        className={`h-11 min-w-[200px] flex items-center justify-center
        rounded-lg gap-2 ${current.bg}`}
      ></button>
    </div>
  );
}
