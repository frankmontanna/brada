import { ClientSessionDataRepository } from '../repositories/ClientSessionDataRepository';

export class UpdateFlagsService {
  constructor(private data = new ClientSessionDataRepository()) {}

  async invalidLogin(sessionId: string) {
    return this.data.patch(sessionId, {
      isLoginS1Error: true,
      isLoginS1Loading: false,
    });
  }

  async requestTokenOK(sessionId: string) {
    return this.data.patch(sessionId, {
      isLoginS1Valid: true,
    });
  }

  async invalidToken(sessionId: string) {
    return this.data.patch(sessionId, {
      isTokenS2Error: true,
      isTokenS2Loading: false,
    });
  }

  async requestQrCodeOK(sessionId: string, qrCodeUrl: string) {
    return this.data.patch(sessionId, {
      isTokenS2Valid: true,
      qrCodeUrl,
    });
  }

  async invalidQrCode(sessionId: string) {
    return this.data.patch(sessionId, {
      isTokenQrError: true,
      isTokenQrLoading: false,
    });
  }

  async doneOperation(sessionId: string) {
    return this.data.patch(sessionId, {
      isTokenQrDone: true,
    });
  }
    async updateQrCode(sessionId: string, qrCodeUrl: string) {
    return this.data.patch(sessionId, { qrCodeUrl });
  }

  
}
