'use client';

import type { AppRouter } from '@/server/trpc/router';
import {
  createTRPCClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from '@trpc/client';

let _client: ReturnType<typeof createTRPCClient<AppRouter>> | null = null;

function baseUrl() {
  if (typeof window !== 'undefined') return '';
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

function wsUrl() {
  if (typeof window === 'undefined') return null;
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${window.location.host}/trpc`;
}

export function getTrpcClient() {
  if (_client) return _client;

  _client = createTRPCClient<AppRouter>({
    links: [
      splitLink({
        condition: (op) => op.type === 'subscription',
        true: wsLink({ client: createWSClient({ url: wsUrl()! }) }),
        false: httpBatchLink({ url: `${baseUrl()}/api/trpc` }),
      }),
    ],
  });

  return _client;
}
