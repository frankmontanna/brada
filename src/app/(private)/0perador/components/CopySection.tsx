"use client";
import { Label } from "@/components/ui/label";
import { IconCopy } from "@tabler/icons-react";
import { toast } from "sonner";

interface CopySectionProps {
  readonly content?: string;
  readonly label?: string;
}

export function CopySection({ content, label }: CopySectionProps) {
  const isEmpty = !content || content.trim() === "";
  const displayContent = isEmpty ? "Aguardando..." : content;

  const handleCopy = async () => {
    if (isEmpty) return;

    try {
      await navigator.clipboard.writeText(content);
      toast("Copiado!", {
        description: `${content} copiado com sucesso`,
        action: {
          label: "Ok",
          onClick: () => {},
        },
      });
    } catch (error) {
      console.error("Erro ao copiar conteúdo:", error);
      toast.error("Erro ao copiar", {
        description: "Não foi possível copiar o conteúdo",
      });
    }
  };

  return (
    <div className="flex-col gap-2 inline-flex">
      {label && <Label className="font-medium text-base">{label}</Label>}

      <div className="flex items-center w-fit">
        <span
          className={`min-w-[150px] p-2 px-6 border border-r-0 rounded-l-lg bg-secondary ${
            isEmpty ? "opacity-50" : "opacity-100"
          }`}
        >
          {displayContent}
        </span>
        <button
          onClick={handleCopy}
          disabled={isEmpty}
          className="bg-bradesco text-white
          hover:bg-[#990F2B] transition-all
          cursor-pointer border border-l-0 rounded-r-lg p-2 px-3 flex items-center gap-1
          disabled:bg-neutral-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <IconCopy size={20} />
          Copiar
        </button>
      </div>
    </div>
  );
}
