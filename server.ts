// server.ts
import http from 'http';
import next from 'next';
import { initSocketServer } from './src/realtime/socketServer';
import { errInfo, logHTTPListening, logStartHTTP, withComp } from './src/server/logger';
import { setBoundAddress } from './src/server/runtime';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

async function start() {
  try {
    await app.prepare();
  } catch (e) {
    withComp('next').fatal(errInfo(e), 'Next prepare failed');
    process.exit(1);
  }

  const server = http.createServer(async (req, res) => {
    const t0 = Date.now();
    try {
      // health
      if (req.url === '/healthz') {
        res.writeHead(200, { 'content-type': 'text/plain' }); res.end('ok'); return;
      }
      await handle(req, res);
      withComp('next').debug({ method: req.method, url: req.url, ms: Date.now() - t0 }, 'next handled');
    } catch (e) {
      withComp('next').error({ ...errInfo(e), method: req.method, url: req.url }, 'next handler error');
      try { res.writeHead(500).end('internal'); } catch {}
    }
  });

  const io = initSocketServer(server);

  const host = process.env.HOST || '0.0.0.0';
  const port = Number(process.env.PORT) || 3000;

  server.on('listening', () => {
    setBoundAddress(host, port);
    logStartHTTP(port, host);
    const addr = server.address();
    const printable = typeof addr === 'string' ? addr : `${addr?.address}:${addr?.port}`;
    logHTTPListening(printable);

    // informa porta do WS (Socket.IO usa a mesma)
    withComp('ws', { ws_port: port }).info('WS attached to HTTP server');
  });

  server.on('error', (e) => {
    withComp('http').error(errInfo(e), 'HTTP server error');
  });

  process.on('unhandledRejection', (e: any) => withComp('app').error(errInfo(e), 'unhandledRejection'));
  process.on('uncaughtException', (e) => { withComp('app').fatal(errInfo(e), 'uncaughtException'); process.exit(1); });

  server.listen(port, host);
}
start();
