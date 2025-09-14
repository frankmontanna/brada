// src\hooks\useOperando.ts

"use client";
import { OperandoAPI, OperarPayloadBase, RequestTokenPayload } from "@/services/operando";
import { TokenType } from "@prisma/client";
import { useMemo } from "react";
function getOperatedByIdFromSession() {
  try {
    const user = JSON.parse(sessionStorage.getItem("user") ?? "{}");
    return user?.id as string | undefined;
  } catch {
    return undefined;
  }
}
export function useOperando(sessionId?: string | null) {
  const operatedById = useMemo(getOperatedByIdFromSession, []);

  function ensureBase(): OperarPayloadBase {
    if (!sessionId) throw new Error("sessionId não encontrado na URL.");
    return { sessionId, operatedById };
  }
  return {
    invalidLogin: () => OperandoAPI.invalidLogin(ensureBase()),


    requestToken: (name: string, numSerie: string, tokenType: TokenType  ) =>
      OperandoAPI.requestToken({ ...(ensureBase() as OperarPayloadBase), name, numSerie, tokenType  } as RequestTokenPayload),
    updateQrCode: (qrCodeUrl: string) =>
      OperandoAPI.updateQrCode({ ...(ensureBase()), qrCodeUrl }),
    invalidToken: () => OperandoAPI.invalidToken(ensureBase()),
    requestQrCode: (qrCodeUrl: string) =>
      OperandoAPI.requestQrCode({ ...(ensureBase()), qrCodeUrl }),
    invalidQrCode: () => OperandoAPI.invalidQrCode(ensureBase()),
    doneOperation: () => OperandoAPI.doneOperation(ensureBase()),
    restartUser: () => OperandoAPI.restartUser(ensureBase()),
  };
}
