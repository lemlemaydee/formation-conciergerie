-- Réglages globaux du site (une seule ligne) : pour l'instant, la vidéo de
-- présentation affichée dans le hero de la landing page.

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  hero_video_url text,
  hero_video_poster_url text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings default values;

alter table public.site_settings enable row level security;

create policy "Anyone can read site settings" on public.site_settings for select using (true);
create policy "Admins update site settings" on public.site_settings for update using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

create policy "Public read site media"
  on storage.objects for select
  using (bucket_id = 'site-media');

create policy "Admins write site media"
  on storage.objects for all
  using (bucket_id = 'site-media' and public.is_admin())
  with check (bucket_id = 'site-media' and public.is_admin());
