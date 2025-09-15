import type { NextRequest } from 'next/server';

export function getClientIp(req: NextRequest): string {
  // Prioriza X-Forwarded-For (proxy/nginx/cloudflare)
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  // NextRequest.ip pode vir vazio em VPS sem Proxy
  // Em último caso, usa remoteAddr do URL (não ideal)
  return (req as any).ip || req.nextUrl.hostname || '0.0.0.0';
}