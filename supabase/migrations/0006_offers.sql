-- Paliers tarifaires, éditables depuis l'admin (remplace les valeurs codées
-- en dur dans le front). À exécuter après 0001-0005.

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug in ('starter', 'croissance', 'sur-mesure')),
  name text not null,
  properties_range text not null,
  price_label text not null,
  price_period text not null,
  features text[] not null default '{}',
  is_featured boolean not null default false,
  order_index integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.offers enable row level security;

create policy "Anyone can read offers" on public.offers for select using (true);
create policy "Admins write offers" on public.offers for all using (public.is_admin()) with check (public.is_admin());

insert into public.offers (slug, name, properties_range, price_label, price_period, features, is_featured, order_index)
values
  ('starter', 'Starter', '0 à 20 biens', '699 €', 'paiement unique',
   array['Formation complète', 'Accès au dashboard', 'Ressources téléchargeables'], false, 0),
  ('croissance', 'Croissance', '20 à 100 biens', '1 499 €', 'paiement unique',
   array['Tout Starter', 'Communauté offerte à vie', 'Accès aux lives hebdomadaires'], true, 1),
  ('sur-mesure', 'Sur-mesure', '100+ biens ou villa de luxe', 'Sur demande', 'accompagnement personnalisé',
   array['Audit personnalisé', 'Accompagnement dédié', 'Tout inclus'], false, 2)
on conflict (slug) do nothing;

-- Module complémentaire (vendu en option, pas un palier).
create table if not exists public.addons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price_label text not null,
  description text,
  is_active boolean not null default true
);

alter table public.addons enable row level security;
create policy "Anyone can read addons" on public.addons for select using (true);
create policy "Admins write addons" on public.addons for all using (public.is_admin()) with check (public.is_admin());

insert into public.addons (slug, name, price_label, description)
values ('sous-location', 'Sous-location', '+299 €', 'Module complémentaire : stratégie et cadre légal de la sous-location.')
on conflict (slug) do nothing;
