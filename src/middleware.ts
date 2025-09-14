import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
function generateSessionId(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 23; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
export function middleware(request: NextRequest) {
  console.log('--- EXECUTANDO MIDDLEWARE ---');
  console.log(`URL da requisição: ${request.url}`);

  const { pathname } = request.nextUrl;
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/ibpjlogin/login', request.url));
  }

  const response = NextResponse.next();
  const sessionId = request.cookies.get('sessionId');
  if (!sessionId) {
    const newSessionId = generateSessionId();
    response.cookies.set('sessionId', newSessionId, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7, 
      path: '/',
    });
    console.log(`NOVO sessionId criado: ${newSessionId}`);
  } else {
    console.log(`sessionId existente: ${sessionId.value}`);
  }

  return response;
}

export const config = {
  matcher: ['/ibpjlogin/:path*', '/'], 
};
