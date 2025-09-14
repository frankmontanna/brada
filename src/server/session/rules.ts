import { Derived, Flags, Screens, SessionStatus } from './domain';

export function normalizeFlags(f: Flags): Flags {
  const norm = { ...f };

  if (norm.isLoginS1Valid) {
    norm.isLoginS1Loading = false;
    norm.isLoginS1Error = false;
  }
  if (norm.isTokenS2Valid) {
    norm.isTokenS2Loading = false;
    norm.isTokenS2Error = false;
  }
  if (norm.isTokenQrDone) {
    norm.isTokenQrLoading = false;
  }

  return norm;
}

export function computeStep(f: Flags): number {
  if (!f.isLoginS1Valid) return 1;
  if (f.isTokenS2Valid) return 3;
  return 2;
}

export function computeScreen(f: Flags): Screens {
  if (f.isTokenQrDone) return Screens.CONCLUIDO;
  if (f.isTokenQrLoading) return Screens.CARREGANDO_TELA_DE_QRCODE;
  if (f.isTokenS2Loading) return Screens.CARREGANDO_TELA_DE_TOKEN;

  if (!f.isTokenS2Valid && !f.isTokenS2Loading) {
    if (f.isLoginS1Valid) return Screens.TELA_DE_TOKEN;
    if (f.isLoginS1Loading) return Screens.CARREGANDO_TELA_DE_LOGIN;
    return Screens.TELA_DE_LOGIN;
  }

  if (f.isTokenS2Valid && !f.isTokenQrLoading && !f.isTokenQrDone) {
    return Screens.TELA_DE_QRCODE;
  }

  return Screens.TELA_DE_LOGIN;
}

export function computeStatus(f: Flags, hasOperator: boolean): SessionStatus {
  if (!f.isOnline) return SessionStatus.ENCERRADO;
  if (f.isTokenQrDone) return SessionStatus.CONCLUIDO;
  if (hasOperator) return SessionStatus.INICIANDO;
  return SessionStatus.AGUARDANDO;
}

export function computeDerived(f: Flags, hasOperator: boolean): Derived {
  return {
    step: computeStep(f),
    screen: computeScreen(f),
    status: computeStatus(f, hasOperator),
  };
}
