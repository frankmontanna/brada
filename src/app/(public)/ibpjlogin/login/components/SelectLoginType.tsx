"use client";

import { useState } from "react";

export function SelectLoginType() {
  const [loginType] = useState("usuario"); // sempre "usuario"

  return (
    <>
      <div className="mb-[5px] flex">
        <input
          type="radio"
          value="usuario"
          checked={loginType === "usuario"}
          readOnly
          className="!w-[13px] !h-[13px] mb-[3px] mr-[5px]"
        />
        <div>
          <span className="block leading-4 mr-[5px] text-[11px]">Usuário</span>
        </div>
      </div>

      <div className="mb-[5px] flex">
        <input
          type="radio"
          value="icp"
          disabled
          checked={loginType === "icp"}
          readOnly
          className="!w-[13px] !h-[13px] mb-[3px] mr-[5px]"
        />
        <div>
          <span className="block leading-4 mr-[5px] text-[11px]">
            ICP Brasil
          </span>
        </div>
      </div>

      <div className="mb-[5px] flex">
        <input
          type="radio"
          value="bradesco"
          disabled
          checked={loginType === "bradesco"}
          readOnly
          className="!w-[13px] !h-[13px] mb-[3px] mr-[5px]"
        />
        <div>
          <span className="block leading-4 mr-[5px] text-[11px]">
            Certificado Digital Bradesco
          </span>
        </div>
      </div>
    </>
  );
}
