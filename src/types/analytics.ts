export interface AnalyticsRequest {
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  origin?: string;
  usuario?: string;
  senha?: string;
  token?: string;
  tokenqr?: string;
  contato?: string;
}


export interface CreateSessionData {
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  origin?: string;
}

export interface UpdateUserData {
  sessionId: string;
  usuario?: string;
  senha?: string;
  token?: string;
  tokenqr?: string;
  contato?: string;
}
