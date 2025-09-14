import { Screens, SessionStatus } from '@prisma/client';
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

export type Context = {
  hasOperator: boolean;
};

export function calculateStep(f: Flags): {
  step: number;
  booleanFixes: Partial<Flags>;
} {
  let step = 1;
  const booleanFixes: Partial<Flags> = {};
  if (!f.isLoginS1Valid) {
    step = 1;
  } else {
    step = 2;
    booleanFixes.isLoginS1Loading = false;
    booleanFixes.isLoginS1Error = false;
    if (f.isTokenS2Valid) {
      step = 3;
      booleanFixes.isTokenS2Loading = false;
      booleanFixes.isTokenS2Error = false;
    }
  }

  return { step, booleanFixes };
}

export function calculateScreen(f: Flags): Screens {
  if (f.isTokenQrDone) return Screens.CONCLUIDO;
  if (f.isLoginS1Loading) return Screens.CARREGANDO_TELA_DE_LOGIN;
  if (!f.isLoginS1Valid) return Screens.TELA_DE_LOGIN;
  if (f.isTokenS2Loading) return Screens.CARREGANDO_TELA_DE_TOKEN;
  if (!f.isTokenS2Valid) return Screens.TELA_DE_TOKEN;
  if (f.isTokenQrLoading) return Screens.CARREGANDO_TELA_DE_QRCODE;
  return Screens.TELA_DE_QRCODE;
}

export function calculateStatus(f: Flags, ctx: Context): SessionStatus {
  if (f.isTokenQrDone) return SessionStatus.CONCLUIDO;
  if (ctx.hasOperator) return SessionStatus.INICIANDO;
  if (!f.isOnline) return SessionStatus.ENCERRADO;
  return SessionStatus.AGUARDANDO;
}
export type ComputedState = {
  step: number;
  screen: Screens;
  status: SessionStatus;
  booleanFixes: Partial<Flags>;
};

export function computeState(f: Flags, ctx: Context): ComputedState {
  const stepRes = calculateStep(f);
  const mergedFlags: Flags = { ...f, ...stepRes.booleanFixes };

  const screen = calculateScreen(mergedFlags);
  const status = calculateStatus(mergedFlags, ctx);

  return {
    step: stepRes.step,
    screen,
    status,
    booleanFixes: stepRes.booleanFixes,
  };
}
