export function FooterLogin() {
  return (
    <footer className="h-[55px] flex footer w-full bg border-y border-[#c3c3c3]">
      <ul className="ml-[15px] bg-white w-fit border-[#c3c3c3] border-x  h-full">
        <li className="pt-3 pl-[22px]   h-[41px] w-fit ">
          <div className="listaLogosImg w-[115px] h-[31px] "></div>
        </li>
      </ul>
      <ul className="flex text-center text-[11px] bg-white py-[6px] border-[#c3c3c3] border-r">
        <li className="w-[202px] pt-[6px] pb-[7px] leading-[14px] text-center font-bold">
          Bradesco Apoio à Empresa <br /> 3003-1000
        </li>
        <li className="w-[199px] border-x border-[#c3c3c3] pt-[6px] pb-[7px] leading-[14px] text-center font-bold">
          Alô Bradesco <br /> 0800 202 1000
        </li>
        <li className="w-[202px] pt-[6px]   pb-[7px] leading-[14px] text-center font-bold">
          Deficiente Auditivo ou de Fala <br /> 0800 722 0099
        </li>
        <li className="w-[203px] pt-[6px] border-l border-[#c3c3c3] pb-[7px] leading-[14px] text-center font-bold">
          Ouvidoria <br /> 0800 727 9933
        </li>
      </ul>
    </footer>
  );
}
