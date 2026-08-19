const EUR_RATE = 1.95583;
const BASE_URL = 'https://mostcomputers.bg';

export function bgnToEur(bgn: number): number {
  return Math.round((bgn / EUR_RATE) * 100) / 100;
}

export function eurToBgn(eur: number): number {
  return Math.round(eur * EUR_RATE * 100) / 100;
}

export function formatEur(eur: number): string {
  return `${eur.toFixed(2)} €`;
}

// Deprecated: BGN is no longer displayed anywhere (Bulgaria uses EUR). Not called
// anywhere in this app — kept as a harmless unused utility.
export function formatBgn(bgn: number): string {
  return `${bgn.toFixed(2)} лв.`;
}

export function priceEur(bgnPrice: number): string {
  return formatEur(bgnToEur(bgnPrice));
}

export function productImageUrl(relativePath: string): string {
  if (!relativePath) return `${BASE_URL}/images/placeholder.webp`;
  const clean = relativePath.replace(/^\.\//, '/');
  return `${BASE_URL}${clean}`;
}
