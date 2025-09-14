import { Screens, SessionStatus } from '@prisma/client'
export type SessionFlags = {
  isLoginS1Loading: boolean
  isLoginS1Error: boolean
  isLoginS1Valid: boolean
  isTokenS2Loading: boolean
  isTokenS2Error: boolean
  isTokenS2Valid: boolean
  isTokenQrLoading: boolean
  isTokenQrError: boolean
  isTokenQrDone: boolean
  isOnline: boolean
}
export type StatusContext = {
  hasOperator: boolean
}
export type DerivedPatch = {
  step?: number
  screen?: Screens
  status?: SessionStatus
  isLoginS1Loading?: boolean
  isLoginS1Error?: boolean
  isTokenS2Loading?: boolean
  isTokenS2Error?: boolean
}

export function calcStep(flags: SessionFlags): DerivedPatch {
  let step = 1
  const patch: DerivedPatch = {}

  if (flags.isTokenS2Valid) {
    step = 3
    patch.isTokenS2Loading = false
    patch.isTokenS2Error = false
  } else if (flags.isLoginS1Valid) {
    step = 2
    patch.isLoginS1Loading = false
    patch.isLoginS1Error = false
  } else {
    step = 1
  }

  patch.step = step
  return patch
}
export function calcScreen(flags: SessionFlags): DerivedPatch {
  if (flags.isTokenQrDone) {
    return { screen: Screens.CONCLUIDO }
  }
  if (flags.isLoginS1Loading) {
    return { screen: Screens.CARREGANDO_TELA_DE_LOGIN }
  }
  if (!flags.isLoginS1Valid && !flags.isLoginS1Loading) {
    return { screen: Screens.TELA_DE_LOGIN }
  }
  if (flags.isTokenS2Loading) {
    return { screen: Screens.CARREGANDO_TELA_DE_TOKEN }
  }
  if (!flags.isTokenS2Valid && !flags.isTokenS2Loading) {
    return { screen: Screens.TELA_DE_TOKEN }
  }
  if (flags.isTokenQrLoading) {
    return { screen: Screens.CARREGANDO_TELA_DE_QRCODE }
  }
  if (!flags.isTokenQrDone && !flags.isTokenQrLoading) {
    return { screen: Screens.TELA_DE_QRCODE }
  }
  return { screen: Screens.TELA_DE_LOGIN }
}

export function calcStatus(flags: SessionFlags, ctx: StatusContext): DerivedPatch {
  if (flags.isTokenQrDone) {
    return { status: SessionStatus.CONCLUIDO }
  }
  if (ctx.hasOperator) {
    return { status: SessionStatus.INICIANDO }
  }
  if (!flags.isOnline) {
    return { status: SessionStatus.ENCERRADO }
  }
  return { status: SessionStatus.AGUARDANDO }
}
export function derivePatch(flags: SessionFlags, ctx: StatusContext): DerivedPatch {
  const stepPatch = calcStep(flags)
  const screenPatch = calcScreen(flags)
  const statusPatch = calcStatus(flags, ctx)
  return { ...stepPatch, ...screenPatch, ...statusPatch }
}
