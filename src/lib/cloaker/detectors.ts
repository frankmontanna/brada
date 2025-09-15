export function isMobile(reqHeaders: Headers): boolean {
  // Client Hint (melhor sinal)
  const ch = reqHeaders.get('sec-ch-ua-mobile');
  if (ch === '?1') return true;

  const ua = (reqHeaders.get('user-agent') || '').toLowerCase();
  // Regex enxuto p/ mobile (evita custo alto)
  return /(iphone|ipod|ipad|android|blackberry|iemobile|opera mini|mobile)/.test(ua);
}

const BOT_UA_RE = new RegExp(
  [
    'bot', 'crawl', 'spider', 'slurp', 'facebookexternalhit', 'embedly', 'quora link preview',
    'pinterest', 'redditbot', 'bitlybot', 'telegrambot', 'discordbot', 'whatsapp', 'skypeuripreview',
    'curl', 'wget', 'python-requests', 'go-http-client', 'httpclient', 'java/', 'headlesschrome',
    'phantomjs', 'puppeteer', 'playwright'
  ].join('|'),
  'i'
);

export function isBot(reqHeaders: Headers): boolean {
  const ua = reqHeaders.get('user-agent') || '';
  if (!ua) return true; // sem UA tende a ser não-humano
  if (BOT_UA_RE.test(ua)) return true;

  // Heurísticas adicionais baratas
  const acceptLang = reqHeaders.get('accept-language');
  const secChUa = reqHeaders.get('sec-ch-ua');
  if (!acceptLang && !secChUa) return true; // clientes “mudos” costumam ser bots

  return false;
}

export function isBrazil(reqHeaders: Headers): boolean | 'unknown' {
  // Se estiver atrás do Cloudflare, use CF-IPCountry
  const cf = reqHeaders.get('cf-ipcountry');
  if (cf) return cf.toUpperCase() === 'BR';

  // Alguns proxies/NGINX podem injetar X-Country-Code
  const xCountry = reqHeaders.get('x-country-code');
  if (xCountry) return xCountry.toUpperCase() === 'BR';

  return 'unknown';
}