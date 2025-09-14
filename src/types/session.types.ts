export type SessionId = string;
export type UserId = string;

export type BaseRequest = {
  sessionId: SessionId;
  operatedById?: UserId; 
};

export type RequestTokenInput = BaseRequest & {
  name: string;
  numSerie: string;
};

export type UseCaseResponse<T = unknown> = {
  ok: true;
  data: T;
} | {
  ok: false;
  error: string;
};