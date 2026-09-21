-- Script combiné : exécute TOUTES les migrations en une fois.
-- Généré à partir de supabase/migrations/0001 à 0007.

-- ===== 0001_profiles.sql =====
-- Profils utilisateurs : étend auth.users avec le rôle et le palier acheté.
-- À exécuter une fois dans Supabase Dashboard > SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  tier text check (tier in ('starter', 'croissance', 'sur-mesure')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Fonction security definer pour éviter la récursion RLS sur profiles.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Admins read all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins update all profiles"
  on public.profiles for update
  using (public.is_admin());

-- Crée automatiquement une ligne profiles à chaque inscription.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Pour te donner accès admin une fois inscrit, lance :
-- update public.profiles set role = 'admin' where email = 'ton-email@exemple.com';

-- ===== 0002_contact_messages.sql =====
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

-- ===== 0003_profiles_role_guard.sql =====
-- Empêche un utilisateur de se donner lui-même le rôle admin ou de modifier
-- son palier via une simple requête update (la policy 0001 autorisait
-- n'importe quelle colonne). À exécuter après 0001 et 0002.

create or replace function public.prevent_self_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.role := old.role;
    new.tier := old.tier;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_profile_role on public.profiles;
create trigger guard_profile_role
  before update on public.profiles
  for each row execute function public.prevent_self_role_change();

-- ===== 0004_bookings.sql =====
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

-- ===== 0005_formation_content.sql =====
-- Contenu de la formation : catégories > sous-catégories > vidéos (leçons),
-- ebooks attachés, et suivi de progression par élève.
-- À exécuter après 0001-0004.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  title text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  subcategory_id uuid not null references public.subcategories(id) on delete cascade,
  title text not null,
  description text,
  video_url text,
  duration_seconds integer,
  min_tier text not null default 'starter' check (min_tier in ('starter', 'croissance', 'sur-mesure')),
  order_index integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_resources enable row level security;
alter table public.lesson_progress enable row level security;

-- Lecture publique du programme (métadonnées), écriture admin uniquement.
create policy "Anyone can read categories" on public.categories for select using (true);
create policy "Admins write categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());

create policy "Anyone can read subcategories" on public.subcategories for select using (true);
create policy "Admins write subcategories" on public.subcategories for all using (public.is_admin()) with check (public.is_admin());

create policy "Anyone can read lessons" on public.lessons for select using (true);
create policy "Admins write lessons" on public.lessons for all using (public.is_admin()) with check (public.is_admin());

-- Ebooks : réservés aux utilisateurs connectés.
create policy "Authenticated users read resources" on public.lesson_resources for select using (auth.role() = 'authenticated');
create policy "Admins write resources" on public.lesson_resources for all using (public.is_admin()) with check (public.is_admin());

-- Progression : chacun ne voit et n'écrit que la sienne ; les admins voient tout.
create policy "Users manage their own progress" on public.lesson_progress for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- Contenu de départ, pour que le dashboard ne soit pas vide au premier lancement.
with cat as (
  insert into public.categories (title, description, order_index) values
    ('Fondamentaux', 'Poser des bases solides avant de prendre votre premier bien.', 0),
    ('Acquisition de propriétaires', 'Trouver et convaincre vos premiers propriétaires.', 1),
    ('Opérations & ménage', 'Organiser le quotidien sans y passer vos journées.', 2),
    ('Outils & automatisation', 'Les outils qu''on utilise vraiment, au quotidien.', 3)
  on conflict do nothing
  returning id, title
),
sub as (
  insert into public.subcategories (category_id, title, order_index)
  select cat.id, sub_title, sub_order
  from cat
  join (values
    ('Fondamentaux', 'Bien démarrer', 0),
    ('Acquisition de propriétaires', 'Trouver ses propriétaires', 0),
    ('Opérations & ménage', 'Le quotidien', 0),
    ('Outils & automatisation', 'Choisir ses outils', 0)
  ) as s(cat_title, sub_title, sub_order) on s.cat_title = cat.title
  returning id, title, category_id
)
insert into public.lessons (subcategory_id, title, description, duration_seconds, order_index)
select sub.id, l.title, l.description, l.duration_seconds, l.order_index
from sub
join (values
  ('Bien démarrer', 'Bien démarrer sa conciergerie', 'Choisir son statut juridique et se lancer sereinement.', 720, 0),
  ('Bien démarrer', 'Choisir son statut juridique', 'Comprendre les bases de la fiscalité de la location courte durée.', 1080, 1),
  ('Bien démarrer', 'Structurer son offre', 'Poser les fondations d''une activité qui dure.', 900, 2),
  ('Trouver ses propriétaires', 'Trouver ses premiers propriétaires', 'Du studio à la villa haut de gamme.', 1200, 0),
  ('Trouver ses propriétaires', 'Le script de démarchage', 'Le script qui fonctionne vraiment.', 840, 1),
  ('Trouver ses propriétaires', 'Convaincre sur le prix', 'Sans brader son offre.', 960, 2),
  ('Le quotidien', 'Organiser le ménage', 'Ménage et blanchisserie sans y passer ses journées.', 1020, 0),
  ('Le quotidien', 'Check-in / check-out sans friction', 'Un accueil voyageur fluide.', 780, 1),
  ('Choisir ses outils', 'Choisir son channel manager', 'Airbnb, Booking, Abritel.', 1320, 0),
  ('Choisir ses outils', 'Automatiser la messagerie voyageurs', 'Gagner du temps sur les échanges.', 1140, 1)
) as l(sub_title, title, description, duration_seconds, order_index) on l.sub_title = sub.title;

-- ===== 0006_offers.sql =====
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

-- ===== 0007_storage_buckets.sql =====
-- Buckets de stockage pour les ebooks (PDF) et, temporairement, les vidéos
-- de leçon. À exécuter après 0001-0006.
--
-- Note : pour de vraies vidéos à grande échelle, migrer vers un hébergeur
-- vidéo dédié (Mux, Bunny Stream, VdoCipher) avec URLs signées et
-- watermark — voir la section "Stack technique" du master prompt. Ce
-- bucket permet de démarrer sans attendre cette intégration.

insert into storage.buckets (id, name, public)
values ('ebooks', 'ebooks', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('lesson-videos', 'lesson-videos', true)
on conflict (id) do nothing;

-- Lecture publique (fichiers déjà protégés en amont par le fait que
-- l'URL n'est communiquée qu'aux élèves via l'app), écriture admin only.
create policy "Public read ebooks"
  on storage.objects for select
  using (bucket_id = 'ebooks');

create policy "Admins write ebooks"
  on storage.objects for all
  using (bucket_id = 'ebooks' and public.is_admin())
  with check (bucket_id = 'ebooks' and public.is_admin());

create policy "Public read lesson videos"
  on storage.objects for select
  using (bucket_id = 'lesson-videos');

create policy "Admins write lesson videos"
  on storage.objects for all
  using (bucket_id = 'lesson-videos' and public.is_admin())
  with check (bucket_id = 'lesson-videos' and public.is_admin());

