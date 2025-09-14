import type { Screens, SessionStatus } from '@prisma/client';

export type ClientSessionMiniItem = {
  sessionId: string;
  clientUser: {
    usuario: string | null;
    senha: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  data: {
    step: number | null;
    screen: Screens | null;
    status: SessionStatus;
    isOnline: boolean;
    startedAt: string;
    lastPing: string;
    qrCodeUrl: string;
  } | null;
};

export type ClientSessionMiniPayload = ClientSessionMiniItem[];

export type ClientSessionByIdPayload = {
  sessionId: string;
  clientUser: any | null;
  data: any | null;
  events: any[];
  [k: string]: any;
} | null;
