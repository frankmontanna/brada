import { prisma } from "@/lib/prisma";

export class ClientSessionDataRepository {
  async ensure(sessionId: string) {
    return prisma.clientSessionData.upsert({
      where: { sessionId },
      create: { sessionId },
      update: {},
    });
  }

   async resetFlagsBySessionId(sessionId: string) {
  // Usa updateMany caso sessionId não seja unique
  await prisma.clientSessionData.updateMany({
    where: { sessionId },
    data: {
      isLoginS1Loading: false,
      isLoginS1Error: false,
      isLoginS1Valid: false,
      isTokenS2Loading: false,
      isTokenS2Error: false,
      isTokenS2Valid: false,
      isTokenQrLoading: false,
      isTokenQrError: false,
      isTokenQrDone: false,
      qrCodeUrl: "", 
      step: 1,
      screen: "TELA_DE_LOGIN",
      status: "AGUARDANDO",
    },
  });

  return prisma.clientSessionData.findFirst({
    where: { sessionId },
  });
}
  async patch(sessionId: string, data: Partial<Parameters<typeof prisma.clientSessionData.update>[0]['data']>) {
    return prisma.clientSessionData.update({
      where: { sessionId },
      data,
    });
  }
}

 