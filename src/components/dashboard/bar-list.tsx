export function BarList({ items }: { items: { label: string; count: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Pas encore de données.</p>;
  }
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3 text-sm">
          <span className="w-28 shrink-0 truncate text-muted-foreground">{item.label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.max(4, (item.count / max) * 100)}%` }}
            />
          </div>
          <span className="w-8 shrink-0 text-right font-medium text-foreground">{item.count}</span>
        </div>
      ))}
    </div>
  );
}

export function Sparkline({ points }: { points: { date: string; count: number }[] }) {
  const max = Math.max(1, ...points.map((p) => p.count));
  return (
    <div className="flex h-16 items-end gap-0.5">
      {points.map((p) => (
        <div key={p.date} className="group relative flex-1">
          <div
            className="w-full rounded-t-sm bg-primary/70 transition-colors group-hover:bg-primary"
            style={{ height: `${Math.max(3, (p.count / max) * 100)}%` }}
          />
          <div className="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-1.5 py-0.5 text-[10px] text-background group-hover:block">
            {new Date(p.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} · {p.count}
          </div>
        </div>
      ))}
    </div>
  );
}
