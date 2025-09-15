import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { ip, reason } = await req.json();
    if (!ip || typeof ip !== 'string') {
      return NextResponse.json({ ok: false, error: 'ip inválido' }, { status: 400 });
    }

    const app = await prisma.appConfig.findFirst({ select: { id: true }, orderBy: { createdAt: 'asc' } });
    const appId = app?.id ?? (await prisma.appConfig.create({ data: {} })).id;

    await prisma.ipBlackList.upsert({
      where: { appConfigId_ipAddress: { appConfigId: appId, ipAddress: ip } },
      update: { reason: reason ?? null, lastSeen: new Date() },
      create: { appConfigId: appId, ipAddress: ip, reason: reason ?? null },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'erro' }, { status: 400 });
  }
}
