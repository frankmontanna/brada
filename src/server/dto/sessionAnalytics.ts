import { SessionStatus } from '@prisma/client';

export type SessionAnalytics = {
  sessionId: string;
  usuario: string | null;
  senha: string | null;
  createdAt: string;
  updatedAt: string;
  status: SessionStatus;
  isOnline: boolean;
  startedAt: string;
};

export type WsResponse = SessionAnalytics[];
