const logo = "/logo.png";
import Link from "next/link";

export function MainHeaderLogin() {
  const dataHoje = new Date();

  const optSem: Intl.DateTimeFormatOptions = { weekday: "long" };
  const optDia: Intl.DateTimeFormatOptions = { day: "numeric" };
  const optMes: Intl.DateTimeFormatOptions = { month: "long" };
  const optAno: Intl.DateTimeFormatOptions = { year: "numeric" };

  const diaSemana = new Intl.DateTimeFormat("pt-BR", optSem)
    .format(dataHoje)
    .replace(/^./, (c) => c.toUpperCase());

  const dia = new Intl.DateTimeFormat("pt-BR", optDia).format(dataHoje);
  const mes = new Intl.DateTimeFormat("pt-BR", optMes)
    .format(dataHoje)
    .replace(/^./, (c) => c.toUpperCase());
  const ano = new Intl.DateTimeFormat("pt-BR", optAno).format(dataHoje);

  const finalDate = `${diaSemana}, ${dia} de ${mes} de ${ano}`;

  return (
    <div className="relative w-[993px] z-[2] float-left ml-[5px] ">
      <img
        className="left-1 absolute top-[11px] z-[2] w-[146px]"
        src={logo}
        alt=""
      />

      <ul className="login_topo">
        <li></li>
        <li></li>
        <li className="btCancelarAcesso">
          <Link
            title="CANCELAR ACESSO"
            href={"/"}
            tabIndex={2}
            className="btCancelar_acessoVarejo"
          >
            CANCELAR ACESSO
          </Link>
        </li>
      </ul>

      <div className="direita ">
        <ul className="clear-both float-left leading-11">
          <li className="text-[11px] float-left px-10">{finalDate}</li>
        </ul>
        {/* -------------------------------  */}
        <div className="login_title2">
          <span id="headerTitulo">
            <h1 className="!text-[20.24px] ">Acesso Seguro</h1>
          </span>
          <div className="login-subtitulo">
            <span id="headerSubtitulo">
              <h2 className="!text-[13.4596px]  !important">
                Acesse o Bradesco Net Empresa de forma segura seguindo os passos
                abaixo:
              </h2>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
