import { operadorService } from '@/services/operadorLib/operadorService';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: { sessionId: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await operadorService.getSessionById(params.sessionId);
    if (!session) {
      return NextResponse.json({ ok: false, error: 'Sessão não encontrada' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: session });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await operadorService.deleteSessionCascade(params.sessionId);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'Erro ao deletar' }, { status: 500 });
  }
}
