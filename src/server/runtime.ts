let boundHost: string | undefined;
let boundPort: number | undefined;

export function setBoundAddress(host: string, port: number) {
  boundHost = host;
  boundPort = port;
}

export function getBoundBaseUrl(): string {
  const host = !boundHost || boundHost === '0.0.0.0' ? '127.0.0.1' : boundHost;
  const port = boundPort ?? (Number(process.env.PORT) || 3000); // fallback seguro
  return `http://${host}:${port}`;
}
