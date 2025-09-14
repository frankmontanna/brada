export function getClientIp(headers: Headers): string {
  const xfwd = headers.get("x-forwarded-for");
  if (xfwd) {
    const ip = xfwd.split(",")[0]?.trim();
    if (ip) return ip;
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;
  return "0.0.0.0";
}
