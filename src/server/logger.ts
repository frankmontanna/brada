// src/server/logger.ts
import pino from 'pino';

const dev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || (dev ? 'debug' : 'info'),
  transport: dev ? { target: 'pino-pretty', options: { translateTime: 'SYS:standard', ignore: 'pid,hostname' } } : undefined,
  base: { service: 'app' },
});

export function withComp(comp: 'http'|'next'|'ws'|'notify'|'prisma'|'app', extra?: object) {
  return logger.child({ comp, ...extra });
}

export function errInfo(e: any) {
  const obj: any = {
    err_name: e?.name,
    err_code: e?.code ?? e?.errno ?? e?.status ?? e?.statusCode,
    err_message: e?.message ?? String(e),
  };
  if (dev && e?.stack) obj.err_stack = e.stack;
  return obj;
}

export function logStartHTTP(port: number, host: string) {
  withComp('http').info({ port, host, env: process.env.NODE_ENV }, 'HTTP server ready');
}
export function logHTTPListening(addr: string) {
  withComp('http').debug({ addr }, 'HTTP listening');
}
