export function LoginActionToken() {
  return (
    <div>
      <div className="mt-[10px]">
        <ul className="btos_bottom">
          <li id="identificationForm:li_btos_bottom_1">
            <a
              href="/ibpjlogin/logoff.jsf"
              title="Cancelar Acesso"
              className="btnCancelarAcesso mr10 fecharFiltroExtrato tabindex"
              tabIndex={44}
            />
          </li>
          <li>
            <input
              alt="Avançar"
              title="Avançar"
              className="btnAcessar botoesLogin !m-0 cursor-pointer"
              tabIndex={20}
              style={{ display: "block" }}
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
