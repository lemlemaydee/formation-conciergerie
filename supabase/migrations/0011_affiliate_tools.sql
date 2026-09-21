-- Outils recommandés / liens affiliés, proposés aux élèves dans leur espace
-- et gérés par l'admin.

create table if not exists public.affiliate_tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  url text not null,
  logo_url text,
  category text,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.affiliate_tools enable row level security;

create policy "Authenticated users read active tools" on public.affiliate_tools for select
  using ((select auth.role()) = 'authenticated' and (is_active or public.is_admin()));

create policy "Admins insert tools" on public.affiliate_tools for insert with check (public.is_admin());
create policy "Admins update tools" on public.affiliate_tools for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete tools" on public.affiliate_tools for delete using (public.is_admin());
