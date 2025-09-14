import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  const body = await req.json() as {
    sessionId: string
    patch: Partial<{
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
    }>
  }
  await prisma.clientSessionData.update({
    where: { sessionId: body.sessionId },
    data: { ...body.patch, lastPing: new Date() },
  })
  const updated = await prisma.clientSessionData.findUnique({
    where: { sessionId: body.sessionId },
    select: {
      step: true, screen: true, status: true,
      isLoginS1Loading: true, isLoginS1Error: true, isLoginS1Valid: true,
      isTokenS2Loading: true, isTokenS2Error: true, isTokenS2Valid: true,
      isTokenQrLoading: true, isTokenQrError: true, isTokenQrDone: true,
      isOnline: true,
      lastPing: true,
    },
  })
  return NextResponse.json({ ok: true, state: updated })
}
