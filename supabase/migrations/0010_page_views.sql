-- Analytics visiteurs maison (pays + type d'appareil), sans dépendance
-- externe. Alimentée par une route handler côté serveur (jamais directement
-- par le client), qui dérive le pays de l'en-tête géo Vercel et l'appareil
-- du user-agent : voir src/app/api/track/route.ts.
-- Aucune IP ni donnée personnelle n'est stockée.

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  country text,
  device text not null default 'desktop' check (device in ('mobile', 'tablet', 'desktop')),
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists idx_page_views_created_at on public.page_views(created_at);

alter table public.page_views enable row level security;

-- Écriture ouverte (comme tout beacon d'analytics côté client) : la table ne
-- contient aucune donnée sensible, seulement path/pays/appareil.
create policy "Anyone can log a page view" on public.page_views for insert with check (true);
create policy "Admins read page views" on public.page_views for select using (public.is_admin());
