// src/app/api/cloaker/denylist/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
  const app = await prisma.appConfig.findFirst({ select: { id: true }, orderBy: { createdAt: 'asc' } });
  if (!app) return NextResponse.json([]);

  const rows = await prisma.ipBlackList.findMany({
    where: { appConfigId: app.id },
    orderBy: { firstSeen: 'desc' },
    select: { id: true, ipAddress: true, reason: true, firstSeen: true, lastSeen: true },
    take: 200,
  });

  const data = rows.map((r) => ({
    id: r.id,
    ip: r.ipAddress,
    ipAddress: r.ipAddress,
    reason: r.reason,
    createdAt: r.firstSeen.toISOString(),
    firstSeen: r.firstSeen.toISOString(),
    lastSeen: r.lastSeen.toISOString(),
  }));

  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const ip = url.searchParams.get('ip');
    const id = url.searchParams.get('id');

    if (!ip && !id) {
      return NextResponse.json({ ok: false, error: 'informe ip ou id' }, { status: 400 });
    }

    if (id) {
      await prisma.ipBlackList.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    }

    const app = await prisma.appConfig.findFirst({ select: { id: true }, orderBy: { createdAt: 'asc' } });
    if (!app) return NextResponse.json({ ok: true }); 

    await prisma.ipBlackList.deleteMany({
      where: { appConfigId: app.id, ipAddress: ip! },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'erro' }, { status: 400 });
  }
}
