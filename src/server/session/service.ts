import { prisma } from '@/lib/prisma';
import { Flags, SessionDataPatch } from './domain';
import { getSessionAggregate, upsertSessionData } from './repo';
import { computeDerived, normalizeFlags } from './rules';

const defaultFlags: Flags = {
  isLoginS1Loading: false,
  isLoginS1Error: false,
  isLoginS1Valid: false,
  isTokenS2Loading: false,
  isTokenS2Error: false,
  isTokenS2Valid: false,
  isTokenQrLoading: false,
  isTokenQrError: false,
  isTokenQrDone: false,
  isOnline: false,
};


export async function applyIncomingSessionData(sessionId: string, patch: SessionDataPatch) {
  return prisma.$transaction(async () => {
    const agg = await getSessionAggregate(sessionId);
    const current: Flags = { ...defaultFlags, ...(agg.data ?? {}) };
    const mergedFirstPass: Flags = {
      ...current,
      ...patch,
      ...(Object.hasOwn(patch, 'isOnline')
        ? { isOnline: patch.isOnline! }
        : { isOnline: current.isOnline }),
    };

    const merged = normalizeFlags(mergedFirstPass);

    const hasOperator = Boolean(agg.user?.operatedById);
    const derived = computeDerived(merged, hasOperator);

    const update = {
      ...merged,
      step: derived.step,
      screen: derived.screen,
      status: derived.status,
      lastPing: new Date(),
    };

    const saved = await upsertSessionData(sessionId, update);
    return { saved, derived };
  });
}

export async function setOnline(sessionId: string) {
  return applyIncomingSessionData(sessionId, { isOnline: true });
}
export async function setOffline(sessionId: string) {
  return applyIncomingSessionData(sessionId, { isOnline: false });
}
export async function heartbeat(sessionId: string) {
  return prisma.clientSessionData.update({
    where: { sessionId },
    data: { lastPing: new Date() },
  });

}
