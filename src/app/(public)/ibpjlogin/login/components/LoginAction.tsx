export function LoginAction() {
  return (
    <div>
        <div className="mt-[10px]">
      <ul className="btos_bottom" >
        <li >
          <b>
            <b>
              <a
                href="/ibpjlogin/logoff.jsf"
                title="Cancelar Acesso"
                className="btnCancelarAcesso mr10 fecharFiltroExtrato tabindex"
                tabIndex={44}
              />
            </b>
          </b>
        </li>
        <li >
          <b>
            <b>
              <input
                alt="Avançar"
                title="Avançar"
                className="bt_avancar botoesLogin"
                tabIndex={20}
                style={{ display: "block" }}
              />
            </b>
          </b>
        </li>
      </ul>

      
    </div>
    {/* primeiro acesso */}
      <div className="pt-[30px] text-[11px] font-bold">
        <b>Se seu contrato foi feito na agência, <a 
        href=""
        className="underline hover:text-bradesco-text"
        >
        faça seu primeiro acesso por aqui.    
        </a></b>
      </div>


    </div>
  );
}


