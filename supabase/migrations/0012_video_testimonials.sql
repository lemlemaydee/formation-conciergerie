-- Témoignages vidéo (format 9:16), affichés en carrousel horizontal sous
-- la section avis de la landing page.

create table if not exists public.video_testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  video_url text not null,
  poster_url text,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.video_testimonials enable row level security;

create policy "Anyone can read active video testimonials" on public.video_testimonials for select
  using (is_active or public.is_admin());

create policy "Admins insert video testimonials" on public.video_testimonials for insert with check (public.is_admin());
create policy "Admins update video testimonials" on public.video_testimonials for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete video testimonials" on public.video_testimonials for delete using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('testimonial-videos', 'testimonial-videos', true)
on conflict (id) do nothing;

create policy "Public read testimonial videos"
  on storage.objects for select
  using (bucket_id = 'testimonial-videos');

create policy "Admins write testimonial videos"
  on storage.objects for all
  using (bucket_id = 'testimonial-videos' and public.is_admin())
  with check (bucket_id = 'testimonial-videos' and public.is_admin());
