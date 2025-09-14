export type OperadorListItem = {
  sessionId: string;
  ipAddress: string;
  device: string;
  country: string | null;
  state: string | null;
  city: string | null;
  clientUser: {
    usuario: string | null;
    senha: string | null;
    contato: string | null;
    createdAt: string; 
    updatedAt: string;
    operatedBy: { id: string; username: string } | null;
  } | null;
  data: {
    step: number | null;
    screen: string | null;
    status: string;
    lastPing: string;
  } | null;
};

export type ClientEvent = {
  id: string;
  sessionId: string;
  eventType: string;
  eventData: string | null;
  createdAt: string;
};

export type FullSession = {
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  browser: string;
  device: string;
  os: string;
  origin: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  createdAt: string;
  updatedAt: string;
  clientUser: {
    id: string;
    usuario: string | null;
    name: string | null;
    senha: string | null;
    token1: string | null;
    tokenqr: string | null;
    numSerie: string | null;
    contato: string | null;
    createdAt: string;
    updatedAt: string;
    operatedBy?: { id: string; username: string; role: 'ADMIN' | 'USER' } | null;
  } | null;
  data: {
    tokenType: 'CELULAR' | 'TOKEN' | null;
    isLoginS1Loading: boolean;
    isLoginS1Error: boolean;
    isLoginS1Valid: boolean;
    isTokenS2Loading: boolean;
    isTokenS2Error: boolean;
    isTokenS2Valid: boolean;
    isTokenQrLoading: boolean;
    isTokenQrError: boolean;
    isTokenQrDone: boolean;
    qrCodeUrl: string | null;
    step: number | null;
    screen: string | null;
    status: 'AGUARDANDO' | 'INICIANDO' | 'CONCLUIDO' | 'ENCERRADO';
    isOnline: boolean;
    startedAt: string;
    endedAt: string | null;
    lastPing: string;
  } | null;
  events: ClientEvent[];
};
