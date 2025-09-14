import { NextRequest, NextResponse } from 'next/server'
import { generateBase62Id } from './utils'
export function withSession(req: NextRequest, res: NextResponse) {
  const { pathname } = req.nextUrl
  console.log('Middleware executando para:', pathname)
  if (pathname === '/ibpjlogin/login') {
    const existing = req.cookies.get('sessionid')?.value
    console.log('Cookie existente:', existing)
    if (!existing) {
      const sessionId = generateBase62Id(23)
      console.log('Gerando novo sessionId:', sessionId)
      res.cookies.set('sessionid', sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, 
        path: '/',
      })
    }
  }
  return res
}
