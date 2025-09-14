// src/server/events/notify.ts
import { logger } from '@/server/logger';
import { getBoundBaseUrl } from '@/server/runtime';

export async function notifySessionsUpdateHttp() {
  // monta automaticamente a URL baseado no server atual
  const base = getBoundBaseUrl();        // ex: http://127.0.0.1:3000
  const url = new URL('/notify', base).toString(); // ajuste o path se for /api/notify

  const controller = new AbortController();
  const TIMEOUT_MS = 3000;
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'sessions.update' }),
      keepalive: true,
      signal: controller.signal,
    });

    if (!res.ok) {
      // não explode; só registra status e um pedacinho do body
      let body = '';
      try { body = (await res.text()).slice(0, 200); } catch {}
      logger.warn({ url, status: res.status, body }, 'notify http non-2xx');
    } else {
      logger.debug({ url }, 'notify ok');
    }
  } catch (err: any) {
    // ECONNREFUSED/AbortError/etc.
    logger.warn({ url, err: String(err?.code ?? err?.name ?? err) }, 'notify failed');
  } finally {
    clearTimeout(timer);
  }
}
