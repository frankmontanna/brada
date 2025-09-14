import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { EVT } from "../identificacao/AnalyticsService";
import { ClientEventRepo } from "../identificacao/ClientEventRepo";
import { SessionRepo } from "../identificacao/SessionRepo";

const BodySchema = z.object({
  eventType: z.string(),
  eventData: z.any().optional(),
}).strict();

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
    if (!sessionId) return NextResponse.json({}, { status: 200 });

    const raw = await req.json().catch(() => ({}));
    const body = BodySchema.parse(raw);

    const repo = new ClientEventRepo();
    await repo.create({
      sessionId,
      eventType: body.eventType,
      eventData: body.eventData === undefined ? null : JSON.stringify(body.eventData),
    });
    if (
      body.eventType === EVT.PAGE_LEAVE ||
      body.eventType === "VISIBILITY_HIDDEN" ||
      body.eventType === "TAB_HIDE"
    ) {
      const sessions = new SessionRepo();
      await sessions.markOffline(sessionId);
    }

    return NextResponse.json({}, { status: 200 });
  } catch {
    return NextResponse.json({}, { status: 200 });
  }
}


