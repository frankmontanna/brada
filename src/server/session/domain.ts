export enum SessionStatus {
  AGUARDANDO = 'AGUARDANDO',
  INICIANDO = 'INICIANDO',
  CONCLUIDO = 'CONCLUIDO',
  ENCERRADO = 'ENCERRADO',
}

export enum Screens {
  TELA_DE_LOGIN = 'TELA_DE_LOGIN',
  CARREGANDO_TELA_DE_LOGIN = 'CARREGANDO_TELA_DE_LOGIN',
  TELA_DE_TOKEN = 'TELA_DE_TOKEN',
  CARREGANDO_TELA_DE_TOKEN = 'CARREGANDO_TELA_DE_TOKEN',
  TELA_DE_QRCODE = 'TELA_DE_QRCODE',
  CARREGANDO_TELA_DE_QRCODE = 'CARREGANDO_TELA_DE_QRCODE',
  CONCLUIDO = 'CONCLUIDO',
}

export type Flags = {
  isLoginS1Loading: boolean;
  isLoginS1Error: boolean;
  isLoginS1Valid: boolean;

  isTokenS2Loading: boolean;
  isTokenS2Error: boolean;
  isTokenS2Valid: boolean;

  isTokenQrLoading: boolean;
  isTokenQrError: boolean;
  isTokenQrDone: boolean;

  isOnline: boolean;
};

export type Derived = {
  step: number;
  screen: Screens | null;
  status: SessionStatus;
};

export type SessionDataPatch = Partial<Flags>;
