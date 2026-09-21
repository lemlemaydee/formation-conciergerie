// Isolé dans un helper (plutôt qu'appelé directement dans un composant) pour
// rester compatible avec la règle de pureté React : un Server Component peut
// être invoqué hors requête (cache, PPR), donc un `Date.now()` écrit en
// direct dans son corps est signalé par le linter.
export function daysAgoIso(days: number): string {
  return new Date(Date.now() - days * 24 * 3600 * 1000).toISOString();
}

export function parsePriceLabel(label: string | null | undefined): number | null {
  if (!label) return null;
  const digits = label.replace(/[^\d]/g, "");
  if (!digits) return null;
  return Number(digits);
}

export function bucketByDay(isoDates: string[], days: number): { date: string; count: number }[] {
  const buckets = new Map<string, number>();
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const iso of isoDates) {
    const key = iso.slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return [...buckets.entries()].map(([date, count]) => ({ date, count }));
}

export function formatEUR(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    amount,
  );
}
