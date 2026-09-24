-- Page masterclass : vidéo de présentation dédiée (distincte de la vidéo
-- hero de la page d'accueil) + inscriptions publiques.

alter table public.site_settings
  add column if not exists masterclass_video_url text,
  add column if not exists masterclass_video_poster_url text;

create table if not exists public.masterclass_registrations (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  email text not null,
  phone text,
  created_at timestamptz not null default now()
);

alter table public.masterclass_registrations enable row level security;

create policy "Anyone can register for the masterclass"
  on public.masterclass_registrations for insert
  with check (true);

create policy "Admins read all masterclass registrations"
  on public.masterclass_registrations for select
  using (public.is_admin());
