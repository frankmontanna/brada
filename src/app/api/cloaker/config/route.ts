import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

function toDTO(cfg: any) {
  return {
    cloakerState: cfg?.cloakerState ?? false,
    blockStranger: cfg?.blockStranger ?? false,
    blockMobile: cfg?.blockMobile ?? false,
    blockBot: cfg?.blockBot ?? true,
    updatedAt: cfg?.updatedAt?.toISOString?.() ?? new Date().toISOString(),
  };
}

export async function GET() {
  const cfg = await prisma.appConfig.findFirst({
    select: {
      cloakerState: true,
      blockStranger: true,
      blockMobile: true,
      blockBot: true,
      updatedAt: true,
      id: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(toDTO(cfg), {
    headers: {
      'Cache-Control': 'public, max-age=60',
      ETag: cfg?.updatedAt ? `"cfg-${cfg.updatedAt.getTime()}"` : `"cfg-none"`,
    },
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const payload = {
      cloakerState: Boolean(body?.cloakerState),
      blockStranger: Boolean(body?.blockStranger),
      blockMobile: Boolean(body?.blockMobile),
      blockBot: Boolean(body?.blockBot),
    };

    let cfg = await prisma.appConfig.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!cfg) {
      cfg = await prisma.appConfig.create({ data: payload });
    } else {
      cfg = await prisma.appConfig.update({
        where: { id: cfg.id },
        data: payload,
      });
    }

    return NextResponse.json(toDTO(cfg), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Erro ao salvar config' },
      { status: 400 }
    );
  }
}
