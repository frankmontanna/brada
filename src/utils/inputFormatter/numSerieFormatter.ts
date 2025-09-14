
export function extractDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 4);
}

export function formatSerieFromDigits(digits: string): string {
  const d = extractDigits(digits);
  if (!d) return "";
  if (d.length <= 3) return `XXXXXX${d}`;
  return `XXXXXX${d.slice(0, 3)}-${d[3]}`;
}

export function getDigitsFromSerie(maskedOrRaw: string): string {
  return extractDigits(maskedOrRaw);
}

export function isValidSerie(maskedOrRaw: string): boolean {
  return getDigitsFromSerie(maskedOrRaw).length === 4;
}
