-- Messages du formulaire de contact / demande de rendez-vous.
-- À exécuter après 0001_profiles.sql dans Supabase Dashboard > SQL Editor.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  reason text not null default 'contact' check (reason in ('contact', 'rdv', 'sur-mesure')),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Le formulaire public peut insérer, mais jamais relire les messages des autres.
create policy "Anyone can submit a contact message"
  on public.contact_messages for insert
  with check (true);

create policy "Admins read all contact messages"
  on public.contact_messages for select
  using (public.is_admin());
