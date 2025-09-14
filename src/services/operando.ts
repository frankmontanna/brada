import { TokenType } from "@prisma/client";

// src\services\operando.ts
export type OperarPayloadBase = {
  sessionId: string;
  operatedById?: string; 
};
export type RequestQrCodePayload = {
  sessionId: string;
  operatedById?: string;
  qrCodeUrl: string;
};
export type UpdateQrCodePayload = {
  sessionId: string;
  qrCodeUrl: string;
};

export type RestartUserPayload = OperarPayloadBase;



export type RequestTokenPayload = OperarPayloadBase & {
  name: string;
  numSerie: string;
  tokenType: TokenType;
};

async function post<T>(action: string, body: unknown): Promise<T> {
  const res = await fetch(`/api/operando/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return res.json();
}

export const OperandoAPI = {
  invalidLogin: (payload: OperarPayloadBase) =>
    post("/invalid-login".replace("/", ""), payload),

   requestToken: (payload: RequestTokenPayload) =>
    post("/request-token".replace("/", ""), payload),

  invalidToken: (payload: OperarPayloadBase) =>
    post("/invalid-token".replace("/", ""), payload),

  requestQrCode: (payload: RequestQrCodePayload) =>
    post("request-qrcode", payload),

 updateQrCode: (payload: UpdateQrCodePayload) =>
    post("update-qrcode", payload),

  invalidQrCode: (payload: OperarPayloadBase) =>
    post("/invalid-qrcode".replace("/", ""), payload),

  doneOperation: (payload: OperarPayloadBase) =>
    post("/done-operation".replace("/", ""), payload),
  
  restartUser: (payload: OperarPayloadBase) =>
    post("restart-user", payload),

};
