-- Réservations d'appels de 30 min (10h-20h, tous les jours).
-- À exécuter après les migrations précédentes.

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  slot_date date not null,
  slot_time time not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  comment text,
  created_at timestamptz not null default now(),
  unique (slot_date, slot_time)
);

alter table public.bookings enable row level security;

create policy "Anyone can book a call"
  on public.bookings for insert
  with check (true);

create policy "Admins read all bookings"
  on public.bookings for select
  using (public.is_admin());

-- Fonction publique : renvoie uniquement les horaires déjà pris pour une
-- date donnée (jamais les infos personnelles), pour griser les créneaux
-- indisponibles côté formulaire public.
create or replace function public.get_taken_slots(p_date date)
returns table (slot_time time)
language sql
security definer
stable
set search_path = public
as $$
  select slot_time from public.bookings where slot_date = p_date;
$$;

grant execute on function public.get_taken_slots(date) to anon, authenticated;
