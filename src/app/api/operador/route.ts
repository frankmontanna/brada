import { operadorService } from '@/services/operadorLib/operadorService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const op = searchParams.get('op');

    if (op === 'getAllSectionResumed') {
      const data = await operadorService.getAllSectionResumed();
      return NextResponse.json({ ok: true, data });
    }

    if (op === 'getAllEvents') {
      const data = await operadorService.getAllEvents();
      return NextResponse.json({ ok: true, data });
    }

    return NextResponse.json(
      { ok: false, error: 'op inválido. Use ?op=getAllSectionResumed ou ?op=getAllEvents' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'Erro interno' }, { status: 500 });
  }
}
