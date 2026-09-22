-- Fichier généré : concaténation de toutes les migrations dans l'ordre.
-- À coller une seule fois dans Supabase SQL Editor pour un nouveau projet.

-- ============================================================
-- 0001_profiles.sql
-- ============================================================
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

-- ============================================================
-- 0002_contact_messages.sql
-- ============================================================
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

-- ============================================================
-- 0003_profiles_role_guard.sql
-- ============================================================
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

-- ============================================================
-- 0004_bookings.sql
-- ============================================================
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

-- ============================================================
-- 0005_formation_content.sql
-- ============================================================
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

-- ============================================================
-- 0006_offers.sql
-- ============================================================
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

-- ============================================================
-- 0007_storage_buckets.sql
-- ============================================================
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

-- ============================================================
-- 0008_tighten_function_grants.sql
-- ============================================================
-- handle_new_user et prevent_self_role_change ne sont que des fonctions de
-- trigger : personne ne doit pouvoir les appeler directement en RPC.
-- is_admin() reste exécutable par anon/authenticated : c'est nécessaire,
-- les policies RLS l'appellent dans leur contexte à chacune de ces requêtes.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.prevent_self_role_change() from public, anon, authenticated;

-- ============================================================
-- 0009_rls_perf_cleanup.sql
-- ============================================================
-- Nettoyage recommandé par les advisors Supabase (performance) : index
-- manquants sur les FK, policies RLS qui ré-évaluaient auth.uid()/auth.role()
-- par ligne au lieu d'une fois par requête, et policies "admin for all" qui
-- chevauchaient inutilement les policies "anyone can read" sur le SELECT.

create index if not exists idx_lesson_progress_lesson_id on public.lesson_progress(lesson_id);
create index if not exists idx_lesson_resources_lesson_id on public.lesson_resources(lesson_id);
create index if not exists idx_lessons_subcategory_id on public.lessons(subcategory_id);
create index if not exists idx_subcategories_category_id on public.subcategories(category_id);

drop policy if exists "Users read their own profile" on public.profiles;
drop policy if exists "Admins read all profiles" on public.profiles;
create policy "Read profiles" on public.profiles for select
  using ((select auth.uid()) = id or public.is_admin());

drop policy if exists "Users update their own profile" on public.profiles;
drop policy if exists "Admins update all profiles" on public.profiles;
create policy "Update profiles" on public.profiles for update
  using ((select auth.uid()) = id or public.is_admin())
  with check ((select auth.uid()) = id or public.is_admin());

drop policy if exists "Admins write categories" on public.categories;
create policy "Admins insert categories" on public.categories for insert with check (public.is_admin());
create policy "Admins update categories" on public.categories for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete categories" on public.categories for delete using (public.is_admin());

drop policy if exists "Admins write subcategories" on public.subcategories;
create policy "Admins insert subcategories" on public.subcategories for insert with check (public.is_admin());
create policy "Admins update subcategories" on public.subcategories for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete subcategories" on public.subcategories for delete using (public.is_admin());

drop policy if exists "Admins write lessons" on public.lessons;
create policy "Admins insert lessons" on public.lessons for insert with check (public.is_admin());
create policy "Admins update lessons" on public.lessons for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete lessons" on public.lessons for delete using (public.is_admin());

drop policy if exists "Admins write offers" on public.offers;
create policy "Admins insert offers" on public.offers for insert with check (public.is_admin());
create policy "Admins update offers" on public.offers for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete offers" on public.offers for delete using (public.is_admin());

drop policy if exists "Admins write addons" on public.addons;
create policy "Admins insert addons" on public.addons for insert with check (public.is_admin());
create policy "Admins update addons" on public.addons for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete addons" on public.addons for delete using (public.is_admin());

drop policy if exists "Authenticated users read resources" on public.lesson_resources;
create policy "Authenticated users read resources" on public.lesson_resources for select
  using ((select auth.role()) = 'authenticated');

drop policy if exists "Admins write resources" on public.lesson_resources;
create policy "Admins insert resources" on public.lesson_resources for insert with check (public.is_admin());
create policy "Admins update resources" on public.lesson_resources for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete resources" on public.lesson_resources for delete using (public.is_admin());

drop policy if exists "Users manage their own progress" on public.lesson_progress;
create policy "Users manage their own progress" on public.lesson_progress for all
  using ((select auth.uid()) = user_id or public.is_admin())
  with check ((select auth.uid()) = user_id or public.is_admin());

-- ============================================================
-- 0010_page_views.sql
-- ============================================================
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

-- ============================================================
-- 0011_affiliate_tools.sql
-- ============================================================
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

-- ============================================================
-- 0012_video_testimonials.sql
-- ============================================================
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

-- ============================================================
-- 0013_curriculum_v2.sql
-- ============================================================
-- Remplace intégralement le programme (catégories/sous-catégories/leçons)
-- par le curriculum complet en 24 modules fourni par l'utilisateur.
--
-- Toutes les nouvelles leçons sont créées non publiées (is_published = false)
-- car aucune vidéo n'existe encore : publier chaque leçon depuis
-- /admin/contenus une fois la vidéo enregistrée et uploadée.
--
-- Les lignes "Ressource(s) :" / "Livrable :" du texte source ne deviennent
-- pas des leçons (ce sont des documents à joindre, pas des sujets vidéo) --
-- elles sont listées ici en commentaire pour ne pas perdre l'information :

-- Module 1 — Étude de marché & choix de zone : Livrable : fiche marché de sa zone
-- Module 2 — Business model & rentabilité : Ressource : simulateur de rentabilité (tableur décrit colonne par colonne avec formules)
-- Module 3 — Juridique de la conciergerie (le plus important) : Ressources : contrat type, CGV, mentions légales, clause de confidentialité (NDA luxe)
-- Module 5B — Fiscalité des propriétaires clients (argument commercial) : Ressource : tableau comparatif régimes + exemple chiffré sur un bien type
-- Module 7 — Construire son offre & ses prix : Ressource : plaquette commerciale type + grille tarifaire
-- Module 8 — Prospection propriétaires : Ressources : 15+ scripts (appel, SMS, WhatsApp, email, DM), modèle de flyer, template d'estimation
-- Module 9 — Closing client : Ressources : trame de RDV, fiche découverte, bible des objections, email récap post-RDV
-- Module 11 — Shooting photo & vidéo : Ressource : shot list + brief photographe
-- Module 12 — Optimisation de l'annonce Airbnb & multi-plateformes : Ressource : template d'annonce + grille d'audit
-- Module 14 — Relation voyageurs : Ressource : bibliothèque de 30+ messages
-- Module 15 — Check-in / Check-out : Ressources : procédure écrite check-in/out + checklist de sortie
-- Module 16 — Ménage & linge : Ressources : checklist ménage, fiche contrôle qualité, calculateur coût linge
-- Module 17 — Prestataires & équipe : Ressources : fiche de poste, contrat de sous-traitance, annuaire prestataires
-- Module 18 — Maintenance, incidents & gestion de crise : Ressource : manuel des incidents (arbre de décision)
-- Module 19 — Relation propriétaires & fidélisation : Ressource : modèle de rapport mensuel
-- Module 20 — Finances & pilotage : Ressource : dashboard financier décrit colonne par colonne
-- Module 21 — Marketing & marque : Ressource : calendrier éditorial 30 jours

-- Supprime l'ancien programme (cascade sur subcategories/lessons/
-- lesson_resources/lesson_progress via les FK on delete cascade).
delete from public.categories;

-- ============================================================
-- Fondamentaux & stratégie
-- ============================================================
with cat_0 as (
  insert into public.categories (title, order_index)
  values ('Fondamentaux & stratégie', 0)
  returning id
),
subs_0 as (
  insert into public.subcategories (category_id, title, order_index)
  select cat_0.id, v.title, v.order_index
  from cat_0, (values
    ('Module 0 — Bienvenue & plan de bataille', 0),
    ('Module 1 — Étude de marché & choix de zone', 1),
    ('Module 2 — Business model & rentabilité', 2)
  ) as v(title, order_index)
  returning id, title
)
insert into public.lessons (subcategory_id, title, min_tier, is_published, order_index)
select subs_0.id, v.title, 'starter', false, v.order_index
from subs_0
join (values
  ('Module 0 — Bienvenue & plan de bataille', 'Comment utiliser la formation, la communauté et les lives', 0),
  ('Module 0 — Bienvenue & plan de bataille', 'État du marché de la location courte durée en France (tendances, durcissement réglementaire, opportunités qui restent)', 1),
  ('Module 0 — Bienvenue & plan de bataille', 'Les 4 business models : conciergerie clé en main, conciergerie à la carte, sous-location, conciergerie luxe/property management', 2),
  ('Module 0 — Bienvenue & plan de bataille', 'Le plan 30/60/90 jours de l''élève (objectifs chiffrés : 1er client, 5 biens, 10 biens)', 3),
  ('Module 0 — Bienvenue & plan de bataille', 'Mindset réaliste : ce que ça rapporte vraiment, ce que ça coûte en temps, les galères classiques', 4),
  ('Module 1 — Étude de marché & choix de zone', 'Analyser une ville : saisonnalité, prix moyens, taux d''occupation, profil voyageurs', 0),
  ('Module 1 — Étude de marché & choix de zone', 'Outils : AirDNA, Airbtics, PriceLabs Market Dashboard, Rabbu, recherche manuelle sur Airbnb', 1),
  ('Module 1 — Étude de marché & choix de zone', 'Cartographier la concurrence (conciergeries locales, leurs prix, leurs faiblesses via les avis)', 2),
  ('Module 1 — Étude de marché & choix de zone', 'Vérifier la réglementation locale AVANT de se lancer (quotas, changement d''usage, zones tendues)', 3),
  ('Module 1 — Étude de marché & choix de zone', 'Choisir sa zone d''intervention (rayon, temps de trajet, densité de biens)', 4),
  ('Module 2 — Business model & rentabilité', 'Sources de revenus : commission (fourchettes marché % HT du CA), frais de ménage, frais de mise en service/onboarding, services additionnels, upsells voyageurs, commissions partenaires', 0),
  ('Module 2 — Business model & rentabilité', 'Unit economics d''un bien : CA, commission, coût ménage réel, linge, consommables, temps passé, marge nette', 1),
  ('Module 2 — Business model & rentabilité', 'Seuil de rentabilité : combien de biens pour se payer X €/mois', 2),
  ('Module 2 — Business model & rentabilité', 'Compte de résultat prévisionnel sur 12 et 36 mois', 3),
  ('Module 2 — Business model & rentabilité', 'Commission vs forfait vs hybride : avantages / risques', 4)
) as v(sub_title, title, order_index) on v.sub_title = subs_0.title;

-- ============================================================
-- Juridique, réglementation & fiscalité
-- ============================================================
with cat_1 as (
  insert into public.categories (title, order_index)
  values ('Juridique, réglementation & fiscalité', 1)
  returning id
),
subs_1 as (
  insert into public.subcategories (category_id, title, order_index)
  select cat_1.id, v.title, v.order_index
  from cat_1, (values
    ('Module 3 — Juridique de la conciergerie (le plus important)', 0),
    ('Module 4 — Réglementation de la location courte durée', 1),
    ('Module 5A — Fiscalité de la conciergerie', 2),
    ('Module 5B — Fiscalité des propriétaires clients (argument commercial)', 3)
  ) as v(title, order_index)
  returning id, title
)
insert into public.lessons (subcategory_id, title, min_tier, is_published, order_index)
select subs_1.id, v.title, 'starter', false, v.order_index
from subs_1
join (values
  ('Module 3 — Juridique de la conciergerie (le plus important)', 'Choix du statut : micro-entreprise, EI, EURL, SASU, SAS, holding — comparatif complet (charges, protection, crédibilité, revente)', 0),
  ('Module 3 — Juridique de la conciergerie (le plus important)', 'Loi Hoguet : quand la carte professionnelle (gestion immobilière / transaction) est obligatoire, notamment si la conciergerie encaisse des fonds pour le compte du propriétaire, a un mandat de gestion, recherche des locataires ; les montages utilisés pour rester en simple prestation de services et leurs limites ; risques pénaux ; option de travailler adossé à un titulaire de carte (agent commercial, partenariat agence)', 1),
  ('Module 3 — Juridique de la conciergerie (le plus important)', 'Contrat de prestation de services vs mandat de gestion : différences, clauses essentielles', 2),
  ('Module 3 — Juridique de la conciergerie (le plus important)', 'Contrat type conciergerie rédigé en entier : objet, durée, exclusivité, commission, frais, obligations des parties, responsabilité, assurances, accès au bien, gestion des dégâts, préavis, résiliation, pénalités, RGPD, litiges', 3),
  ('Module 3 — Juridique de la conciergerie (le plus important)', 'CGV de la conciergerie', 4),
  ('Module 3 — Juridique de la conciergerie (le plus important)', 'Flux financiers : qui encaisse (plateforme → propriétaire ou → conciergerie), facturation, reversements', 5),
  ('Module 3 — Juridique de la conciergerie (le plus important)', 'Assurances : RC professionnelle, assurance du propriétaire (PNO, habitation adaptée location saisonnière), limites d''AirCover', 6),
  ('Module 3 — Juridique de la conciergerie (le plus important)', 'RGPD : données voyageurs et propriétaires, pièces d''identité, durée de conservation', 7),
  ('Module 3 — Juridique de la conciergerie (le plus important)', 'Fiche de police pour voyageurs étrangers (obligation, conservation)', 8),
  ('Module 3 — Juridique de la conciergerie (le plus important)', 'Responsabilité en cas de dégâts, vol, accident, fête, trouble de voisinage', 9),
  ('Module 4 — Réglementation de la location courte durée', 'Résidence principale vs secondaire vs local commercial : ce qui change', 0),
  ('Module 4 — Réglementation de la location courte durée', 'Plafond de jours pour la résidence principale et possibilité pour les communes de le réduire [À VÉRIFIER]', 1),
  ('Module 4 — Réglementation de la location courte durée', 'Loi Le Meur (nov. 2024) : enregistrement / numéro de déclaration, pouvoirs des maires, quotas, DPE exigé pour les meublés de tourisme, règles en copropriété (modification du règlement), sanctions [À VÉRIFIER — état d''application]', 2),
  ('Module 4 — Réglementation de la location courte durée', 'Changement d''usage (art. L631-7 CCH), compensation, villes concernées', 3),
  ('Module 4 — Réglementation de la location courte durée', 'Règlement de copropriété : clause d''habitation bourgeoise, vérifier avant de signer un bien', 4),
  ('Module 4 — Réglementation de la location courte durée', 'Taxe de séjour : collecte par les plateformes, cas de la réservation directe, déclaration', 5),
  ('Module 4 — Réglementation de la location courte durée', 'Classement meublé de tourisme (étoiles) : démarche, coût, intérêt fiscal et commercial', 6),
  ('Module 4 — Réglementation de la location courte durée', 'Normes de sécurité : détecteurs de fumée, CO, extincteur, piscine (sécurisation obligatoire), balcons', 7),
  ('Module 4 — Réglementation de la location courte durée', 'Checklist de conformité d''un bien avant mise en ligne', 8),
  ('Module 4 — Réglementation de la location courte durée', 'Encadré Monaco : cadre spécifique de la location en Principauté', 9),
  ('Module 5A — Fiscalité de la conciergerie', 'Micro-entreprise vs réel : seuils, abattements, cotisations', 0),
  ('Module 5A — Fiscalité de la conciergerie', 'TVA : franchise en base, seuils, TVA sur commissions, cas des prestations para-hôtelières [À VÉRIFIER seuils en vigueur]', 1),
  ('Module 5A — Fiscalité de la conciergerie', 'CFE, CVAE, TVS', 2),
  ('Module 5A — Fiscalité de la conciergerie', 'Société à l''IS : rémunération vs dividendes, holding, optimisation de la rémunération du dirigeant', 3),
  ('Module 5A — Fiscalité de la conciergerie', 'Frais déductibles, véhicule, local, matériel', 4),
  ('Module 5A — Fiscalité de la conciergerie', 'Compta : outils, expert-comptable ou non, ce qu''il faut suivre chaque mois', 5),
  ('Module 5B — Fiscalité des propriétaires clients (argument commercial)', 'LMNP vs LMP : critères, conséquences', 0),
  ('Module 5B — Fiscalité des propriétaires clients (argument commercial)', 'Micro-BIC : nouveaux abattements et plafonds meublés de tourisme classés / non classés après la loi Le Meur [À VÉRIFIER]', 1),
  ('Module 5B — Fiscalité des propriétaires clients (argument commercial)', 'Régime réel : amortissements, et effet de la réforme sur la réintégration des amortissements dans la plus-value LMNP [À VÉRIFIER]', 2),
  ('Module 5B — Fiscalité des propriétaires clients (argument commercial)', 'Cotisations sociales URSSAF au-delà de certains seuils de recettes', 3),
  ('Module 5B — Fiscalité des propriétaires clients (argument commercial)', 'SCI à l''IS, SARL de famille', 4),
  ('Module 5B — Fiscalité des propriétaires clients (argument commercial)', 'Comment utiliser la fiscalité pour convaincre un proprio (sans faire de conseil fiscal : orienter vers son comptable)', 5)
) as v(sub_title, title, order_index) on v.sub_title = subs_1.title;

-- ============================================================
-- Mise en place & structure commerciale
-- ============================================================
with cat_2 as (
  insert into public.categories (title, order_index)
  values ('Mise en place & structure commerciale', 2)
  returning id
),
subs_2 as (
  insert into public.subcategories (category_id, title, order_index)
  select cat_2.id, v.title, v.order_index
  from cat_2, (values
    ('Module 6 — Créer sa structure & sa stack d''outils', 0),
    ('Module 7 — Construire son offre & ses prix', 1)
  ) as v(title, order_index)
  returning id, title
)
insert into public.lessons (subcategory_id, title, min_tier, is_published, order_index)
select subs_2.id, v.title, 'starter', false, v.order_index
from subs_2
join (values
  ('Module 6 — Créer sa structure & sa stack d''outils', 'Création de la société étape par étape, banque pro, assurance, compta', 0),
  ('Module 6 — Créer sa structure & sa stack d''outils', 'PMS / channel manager : Hostaway, Lodgify, Smoobu, Beds24, Guesty, Hospitable — comparatif selon taille de parc', 1),
  ('Module 6 — Créer sa structure & sa stack d''outils', 'Pricing dynamique : PriceLabs, Beyond, Wheelhouse', 2),
  ('Module 6 — Créer sa structure & sa stack d''outils', 'Accès : serrures connectées (Nuki, Igloohome, etc.), boîtes à clés, digicodes — comparatif', 3),
  ('Module 6 — Créer sa structure & sa stack d''outils', 'Messagerie automatisée, livret d''accueil digital', 4),
  ('Module 6 — Créer sa structure & sa stack d''outils', 'Planning ménage : Turno, Breezeway, ou Notion/Sheets au début', 5),
  ('Module 6 — Créer sa structure & sa stack d''outils', 'CRM prospects et propriétaires', 6),
  ('Module 6 — Créer sa structure & sa stack d''outils', 'Signature électronique, facturation, reporting', 7),
  ('Module 6 — Créer sa structure & sa stack d''outils', 'Automatisations (Zapier/Make) et IA : réponses voyageurs, annonces, reporting', 8),
  ('Module 6 — Créer sa structure & sa stack d''outils', 'Stack recommandée par palier : 0-5 biens, 5-20, 20-100, +100', 9),
  ('Module 7 — Construire son offre & ses prix', 'Offre clé en main vs à la carte vs gestion light', 0),
  ('Module 7 — Construire son offre & ses prix', 'Grille tarifaire par type de bien et de marché', 1),
  ('Module 7 — Construire son offre & ses prix', 'Frais d''onboarding : justifier et facturer la mise en service', 2),
  ('Module 7 — Construire son offre & ses prix', 'Services additionnels et upsells (ménage fin de séjour, linge, courses, transfert, chef, etc.)', 3),
  ('Module 7 — Construire son offre & ses prix', 'Offre premium / luxe', 4),
  ('Module 7 — Construire son offre & ses prix', 'Garanties commerciales (satisfaction, engagement de résultats) : ce qu''on peut promettre ou pas', 5)
) as v(sub_title, title, order_index) on v.sub_title = subs_2.title;

-- ============================================================
-- Acquisition & vente
-- ============================================================
with cat_3 as (
  insert into public.categories (title, order_index)
  values ('Acquisition & vente', 3)
  returning id
),
subs_3 as (
  insert into public.subcategories (category_id, title, order_index)
  select cat_3.id, v.title, v.order_index
  from cat_3, (values
    ('Module 8 — Prospection propriétaires', 0),
    ('Module 9 — Closing client', 1)
  ) as v(title, order_index)
  returning id, title
)
insert into public.lessons (subcategory_id, title, min_tier, is_published, order_index)
select subs_3.id, v.title, 'starter', false, v.order_index
from subs_3
join (values
  ('Module 8 — Prospection propriétaires', 'Où sont les clients : hôtes Airbnb sous-performants, propriétaires de résidences secondaires, investisseurs, expatriés, héritiers, biens vacants, annonces LeBonCoin/PAP/SeLoger, agences immobilières, notaires, syndics, gestionnaires de patrimoine, CGP, artisans, promoteurs', 0),
  ('Module 8 — Prospection propriétaires', 'Prospection des annonces Airbnb existantes : repérer les annonces mal optimisées (mauvaises photos, peu d''avis, calendrier vide), méthodes de contact respectant les CGU des plateformes', 1),
  ('Module 8 — Prospection propriétaires', 'Cold call : script complet + variantes', 2),
  ('Module 8 — Prospection propriétaires', 'Porte-à-porte, flyers, boîtage : quoi écrire, où, quand', 3),
  ('Module 8 — Prospection propriétaires', 'Facebook groupes, LinkedIn, Instagram, TikTok', 4),
  ('Module 8 — Prospection propriétaires', 'Google Business Profile, SEO local, Google Ads, Meta Ads (budgets, ciblage, annonces types)', 5),
  ('Module 8 — Prospection propriétaires', 'Lead magnet : « estimation gratuite de revenus », audit d''annonce offert', 6),
  ('Module 8 — Prospection propriétaires', 'Partenariats et apporteurs d''affaires (commission de parrainage)', 7),
  ('Module 8 — Prospection propriétaires', 'Séquences de relance (J+2, J+7, J+15, J+30) : messages mot pour mot', 8),
  ('Module 8 — Prospection propriétaires', 'Pipeline CRM et KPI de prospection (taux de réponse, RDV, closing)', 9),
  ('Module 9 — Closing client', 'Préparer le rendez-vous : recherche sur le bien et le propriétaire', 0),
  ('Module 9 — Closing client', 'Le rendez-vous découverte : trame complète, questions à poser (motivation, peurs, objectifs, usage perso du bien, budget)', 1),
  ('Module 9 — Closing client', 'Visite et audit du bien : ce qu''on regarde', 2),
  ('Module 9 — Closing client', 'Présenter l''estimation de revenus (réaliste, jamais surpromettre)', 3),
  ('Module 9 — Closing client', 'Pitch de l''offre structuré', 4),
  ('Module 9 — Closing client', 'Traitement des objections — minimum 25 objections avec réponses : « c''est trop cher », « je peux le faire moi-même », « j''ai peur des dégâts », « et si ça ne se loue pas », « mon voisin/copro va râler », « je veux l''utiliser l''été », « une autre conciergerie prend moins », « je dois en parler à ma femme », « je réfléchis », etc.', 5),
  ('Module 9 — Closing client', 'Négocier la commission sans brader', 6),
  ('Module 9 — Closing client', 'Techniques de closing et relance post-RDV', 7),
  ('Module 9 — Closing client', 'Signature, onboarding administratif, collecte des documents', 8),
  ('Module 9 — Closing client', 'Closing spécifique propriétaires de villas / clientèle internationale', 9)
) as v(sub_title, title, order_index) on v.sub_title = subs_3.title;

-- ============================================================
-- Préparation & mise en ligne du bien
-- ============================================================
with cat_4 as (
  insert into public.categories (title, order_index)
  values ('Préparation & mise en ligne du bien', 4)
  returning id
),
subs_4 as (
  insert into public.subcategories (category_id, title, order_index)
  select cat_4.id, v.title, v.order_index
  from cat_4, (values
    ('Module 10 — Onboarding & préparation du bien', 0),
    ('Module 11 — Shooting photo & vidéo', 1),
    ('Module 12 — Optimisation de l''annonce Airbnb & multi-plateformes', 2)
  ) as v(title, order_index)
  returning id, title
)
insert into public.lessons (subcategory_id, title, min_tier, is_published, order_index)
select subs_4.id, v.title, 'starter', false, v.order_index
from subs_4
join (values
  ('Module 10 — Onboarding & préparation du bien', 'État des lieux d''entrée + inventaire photo/vidéo daté', 0),
  ('Module 10 — Onboarding & préparation du bien', 'Kit d''équipement complet pièce par pièce (cuisine, salle de bain, chambres, séjour, extérieur, bébé, télétravail) avec liste et budget', 1),
  ('Module 10 — Onboarding & préparation du bien', 'Home staging location courte durée : déco, cohérence, « effet waouh » photo', 2),
  ('Module 10 — Onboarding & préparation du bien', 'Sécurité et conformité (reprendre la checklist du module 4)', 3),
  ('Module 10 — Onboarding & préparation du bien', 'Wifi, TV, streaming, guides d''utilisation des équipements', 4),
  ('Module 10 — Onboarding & préparation du bien', 'Livret d''accueil digital : structure complète', 5),
  ('Module 10 — Onboarding & préparation du bien', 'Gestion des clés, placard propriétaire fermé, stock de consommables', 6),
  ('Module 10 — Onboarding & préparation du bien', 'Délai de mise en service : rétroplanning J-21 à J0', 7),
  ('Module 11 — Shooting photo & vidéo', 'Pourquoi la photo = 1er levier de conversion', 0),
  ('Module 11 — Shooting photo & vidéo', 'Matériel : smartphone vs reflex/hybride, objectif grand-angle, trépied, flash/éclairage, drone', 1),
  ('Module 11 — Shooting photo & vidéo', 'Préparer la pièce : checklist de mise en scène avant shooting', 2),
  ('Module 11 — Shooting photo & vidéo', 'Lumière et timing (heure selon orientation, extérieurs, golden hour)', 3),
  ('Module 11 — Shooting photo & vidéo', 'Réglages : HDR, bracketing, verticales droites, hauteur de prise de vue', 4),
  ('Module 11 — Shooting photo & vidéo', 'Plan de shooting : liste des photos à faire, ordre de l''annonce, photo de couverture', 5),
  ('Module 11 — Shooting photo & vidéo', 'Photos « lifestyle » et détails', 6),
  ('Module 11 — Shooting photo & vidéo', 'Retouche : Lightroom, presets, limites (ne jamais tromper sur le bien)', 7),
  ('Module 11 — Shooting photo & vidéo', 'Vidéo et Reels pour réseaux sociaux', 8),
  ('Module 11 — Shooting photo & vidéo', 'Drone : réglementation en France (catégories, zones interdites, autorisations) [À VÉRIFIER]', 9),
  ('Module 11 — Shooting photo & vidéo', 'Faire appel à un photographe pro : prix marché, brief type, droits d''utilisation des images', 10),
  ('Module 12 — Optimisation de l''annonce Airbnb & multi-plateformes', 'Comment fonctionne l''algorithme de classement (facteurs connus et observés)', 0),
  ('Module 12 — Optimisation de l''annonce Airbnb & multi-plateformes', 'Titre, description, sections, équipements, légendes photos', 1),
  ('Module 12 — Optimisation de l''annonce Airbnb & multi-plateformes', 'Règlement intérieur, conditions d''annulation, réservation instantanée', 2),
  ('Module 12 — Optimisation de l''annonce Airbnb & multi-plateformes', 'Statut Superhost et « Coup de cœur voyageurs » : critères et stratégie', 3),
  ('Module 12 — Optimisation de l''annonce Airbnb & multi-plateformes', 'Stratégie des premiers avis sur une nouvelle annonce', 4),
  ('Module 12 — Optimisation de l''annonce Airbnb & multi-plateformes', 'Booking.com, Abritel/Vrbo, Google Vacation Rentals, plateformes de luxe', 5),
  ('Module 12 — Optimisation de l''annonce Airbnb & multi-plateformes', 'Réservation directe : site, moteur de réservation, fichier clients, fidélisation', 6),
  ('Module 12 — Optimisation de l''annonce Airbnb & multi-plateformes', 'Audit d''annonce : grille de 40 points', 7)
) as v(sub_title, title, order_index) on v.sub_title = subs_4.title;

-- ============================================================
-- Opérations quotidiennes
-- ============================================================
with cat_5 as (
  insert into public.categories (title, order_index)
  values ('Opérations quotidiennes', 5)
  returning id
),
subs_5 as (
  insert into public.subcategories (category_id, title, order_index)
  select cat_5.id, v.title, v.order_index
  from cat_5, (values
    ('Module 13 — Revenue management', 0),
    ('Module 14 — Relation voyageurs', 1),
    ('Module 15 — Check-in / Check-out', 2),
    ('Module 16 — Ménage & linge', 3),
    ('Module 17 — Prestataires & équipe', 4),
    ('Module 18 — Maintenance, incidents & gestion de crise', 5),
    ('Module 19 — Relation propriétaires & fidélisation', 6)
  ) as v(title, order_index)
  returning id, title
)
insert into public.lessons (subcategory_id, title, min_tier, is_published, order_index)
select subs_5.id, v.title, 'starter', false, v.order_index
from subs_5
join (values
  ('Module 13 — Revenue management', 'KPI : taux d''occupation, ADR, RevPAR, lead time, durée moyenne de séjour', 0),
  ('Module 13 — Revenue management', 'Pricing dynamique : paramétrage PriceLabs pas à pas', 1),
  ('Module 13 — Revenue management', 'Saisonnalité, événements locaux, jours fériés, vacances scolaires', 2),
  ('Module 13 — Revenue management', 'Durée minimale de séjour, jours orphelins, gaps', 3),
  ('Module 13 — Revenue management', 'Remises (semaine, mois, last minute, early bird)', 4),
  ('Module 13 — Revenue management', 'Stratégie frais de ménage (inclus vs séparés)', 5),
  ('Module 13 — Revenue management', 'Reporting mensuel et ajustements', 6),
  ('Module 13 — Revenue management', 'Niveau Pro : pilotage d''un portefeuille, benchmark interne', 7),
  ('Module 14 — Relation voyageurs', 'Parcours voyageur complet de la réservation à l''avis', 0),
  ('Module 14 — Relation voyageurs', 'Messages automatiques : confirmation, J-7, J-1, arrivée, J+1, départ, demande d''avis — rédigés en FR et EN', 1),
  ('Module 14 — Relation voyageurs', 'Filtrage des réservations à risque (fêtes, profils sans avis, séjours locaux 1 nuit)', 2),
  ('Module 14 — Relation voyageurs', 'Vérification d''identité, caution / dépôt de garantie', 3),
  ('Module 14 — Relation voyageurs', 'Gestion des réclamations et des demandes de remboursement', 4),
  ('Module 14 — Relation voyageurs', 'Réponses aux avis négatifs (templates)', 5),
  ('Module 14 — Relation voyageurs', 'Upsells voyageurs : early check-in, late check-out, ménage en cours de séjour, services', 6),
  ('Module 14 — Relation voyageurs', 'Voyageurs VIP / clientèle luxe : standards de service, discrétion', 7),
  ('Module 15 — Check-in / Check-out', 'Check-in physique vs autonome : quand choisir quoi', 0),
  ('Module 15 — Check-in / Check-out', 'Procédure de check-in physique pas à pas (accueil, visite, consignes, photo compteurs)', 1),
  ('Module 15 — Check-in / Check-out', 'Check-in autonome : instructions, vidéo d''accès, plan B', 2),
  ('Module 15 — Check-in / Check-out', 'Gestion des retards, arrivées tardives, clés perdues, serrure bloquée', 3),
  ('Module 15 — Check-in / Check-out', 'Check-out : consignes, contrôle, photos de sortie horodatées', 4),
  ('Module 15 — Check-in / Check-out', 'Constater un dégât : preuves, délais de réclamation AirCover / Booking, procédure', 5),
  ('Module 16 — Ménage & linge', 'Standards hôteliers : checklist pièce par pièce ultra détaillée', 0),
  ('Module 16 — Ménage & linge', 'Temps de ménage selon la surface et le type de bien, tarifs marché', 1),
  ('Module 16 — Ménage & linge', 'Organisation des turnovers (même jour, rotations serrées)', 2),
  ('Module 16 — Ménage & linge', 'Contrôle qualité : photos obligatoires, grille de contrôle, mystery check', 3),
  ('Module 16 — Ménage & linge', 'Produits, matériel, consommables et réassort', 4),
  ('Module 16 — Ménage & linge', 'Linge : en interne vs blanchisserie vs location de linge — comparatif de coûts ; nombre de jeux par lit, stockage, rotation', 5),
  ('Module 16 — Ménage & linge', 'Staging final avant arrivée (la « photo de fin »)', 6),
  ('Module 17 — Prestataires & équipe', 'Recruter des agents de ménage : où trouver, entretien, test', 0),
  ('Module 17 — Prestataires & équipe', 'Statuts : auto-entrepreneur, salarié, CESU, société de nettoyage — risques de requalification et de travail dissimulé, obligation de vigilance (attestation URSSAF selon montant) [À VÉRIFIER seuil]', 1),
  ('Module 17 — Prestataires & équipe', 'Contrat de sous-traitance type', 2),
  ('Module 17 — Prestataires & équipe', 'Rémunération (au forfait vs à l''heure), fidélisation, gestion des absences et du pic estival', 3),
  ('Module 17 — Prestataires & équipe', 'Réseau d''artisans : plombier, électricien, serrurier, piscinier, jardinier, dépannage d''urgence', 4),
  ('Module 17 — Prestataires & équipe', 'Astreinte et gestion des urgences 24/7', 5),
  ('Module 17 — Prestataires & équipe', 'Former l''équipe : SOP, vidéos internes', 6),
  ('Module 17 — Prestataires & équipe', 'Recruter un bras droit / responsable opérations', 7),
  ('Module 18 — Maintenance, incidents & gestion de crise', 'Maintenance préventive (calendrier)', 0),
  ('Module 18 — Maintenance, incidents & gestion de crise', 'Protocoles : fuite, panne, coupure, nuisibles, fête, voisins, voyageur qui refuse de partir, suspicion de squat, vol, accident', 1),
  ('Module 18 — Maintenance, incidents & gestion de crise', 'Déclarer un sinistre (assurance propriétaire, plateforme)', 2),
  ('Module 18 — Maintenance, incidents & gestion de crise', 'Communication de crise avec le propriétaire', 3),
  ('Module 19 — Relation propriétaires & fidélisation', 'Onboarding propriétaire et gestion des attentes', 0),
  ('Module 19 — Relation propriétaires & fidélisation', 'Reporting mensuel : contenu, format, KPI', 1),
  ('Module 19 — Relation propriétaires & fidélisation', 'Reversements, relevés, transparence totale', 2),
  ('Module 19 — Relation propriétaires & fidélisation', 'Gérer un propriétaire difficile', 3),
  ('Module 19 — Relation propriétaires & fidélisation', 'Gérer les périodes creuses et les baisses de revenus', 4),
  ('Module 19 — Relation propriétaires & fidélisation', 'Rétention et prévention des résiliations', 5),
  ('Module 19 — Relation propriétaires & fidélisation', 'Faire du propriétaire un apporteur d''affaires', 6)
) as v(sub_title, title, order_index) on v.sub_title = subs_5.title;

-- ============================================================
-- Piloter, développer & scaler
-- ============================================================
with cat_6 as (
  insert into public.categories (title, order_index)
  values ('Piloter, développer & scaler', 6)
  returning id
),
subs_6 as (
  insert into public.subcategories (category_id, title, order_index)
  select cat_6.id, v.title, v.order_index
  from cat_6, (values
    ('Module 20 — Finances & pilotage', 0),
    ('Module 21 — Marketing & marque', 1),
    ('Module 22 — Scaler (niveau Pro)', 2),
    ('Module 23 — Conciergerie de luxe & villas (niveau Luxe)', 3)
  ) as v(title, order_index)
  returning id, title
)
insert into public.lessons (subcategory_id, title, min_tier, is_published, order_index)
select subs_6.id, v.title, 'starter', false, v.order_index
from subs_6
join (values
  ('Module 20 — Finances & pilotage', 'Flux d''argent et trésorerie (saisonnalité : survivre à l''hiver)', 0),
  ('Module 20 — Finances & pilotage', 'Facturation, rapprochement bancaire, relevés propriétaires', 1),
  ('Module 20 — Finances & pilotage', 'Tableau de bord mensuel : KPI business (CA, marge, biens actifs, churn, coût d''acquisition client)', 2),
  ('Module 20 — Finances & pilotage', 'Prévisionnel et objectifs', 3),
  ('Module 21 — Marketing & marque', 'Nom, identité visuelle, positionnement', 0),
  ('Module 21 — Marketing & marque', 'Site internet (pages indispensables, SEO local)', 1),
  ('Module 21 — Marketing & marque', 'Google Business Profile et récolte d''avis', 2),
  ('Module 21 — Marketing & marque', 'Réseaux sociaux : stratégie de contenu, formats qui marchent (avant/après, coulisses, chiffres)', 3),
  ('Module 21 — Marketing & marque', 'Preuve sociale : études de cas, témoignages propriétaires', 4),
  ('Module 22 — Scaler (niveau Pro)', 'Processus écrits (SOP) pour tout', 0),
  ('Module 22 — Scaler (niveau Pro)', 'Délégation et organigramme type à 20, 50, 100 biens', 1),
  ('Module 22 — Scaler (niveau Pro)', 'Ouvrir une nouvelle ville', 2),
  ('Module 22 — Scaler (niveau Pro)', 'Rachat de portefeuille / de conciergerie existante', 3),
  ('Module 22 — Scaler (niveau Pro)', 'Marque blanche, franchise, licence', 4),
  ('Module 22 — Scaler (niveau Pro)', 'Automatisation et IA pour réduire les coûts opérationnels', 5),
  ('Module 22 — Scaler (niveau Pro)', 'Valoriser et revendre sa conciergerie', 6),
  ('Module 23 — Conciergerie de luxe & villas (niveau Luxe)', 'Spécificités de la clientèle haut de gamme et internationale (UHNW, familles, célébrités, corporate)', 0),
  ('Module 23 — Conciergerie de luxe & villas (niveau Luxe)', 'Discrétion, NDA, sécurité', 1),
  ('Module 23 — Conciergerie de luxe & villas (niveau Luxe)', 'Standards de service 5 étoiles', 2),
  ('Module 23 — Conciergerie de luxe & villas (niveau Luxe)', 'Personnel : gouvernante, butler, chef, chauffeur, sécurité', 3),
  ('Module 23 — Conciergerie de luxe & villas (niveau Luxe)', 'Services lifestyle : location de voiture et de bateau, yacht, jet, réservations restaurants, événements (commission ou marge)', 4),
  ('Module 23 — Conciergerie de luxe & villas (niveau Luxe)', 'Partenariat avec agences immobilières de luxe (répartition des rôles, partage d''honoraires)', 5),
  ('Module 23 — Conciergerie de luxe & villas (niveau Luxe)', 'Gestion des villas : piscine, jardin, domotique, maintenance lourde', 6),
  ('Module 23 — Conciergerie de luxe & villas (niveau Luxe)', 'Illustrer avec le terrain Riviera (Monaco, Cap-Martin, Cap-d''Ail) — chiffres de Mehdi en [À COMPLÉTER]', 7)
) as v(sub_title, title, order_index) on v.sub_title = subs_6.title;


-- ============================================================
-- 0014_site_settings.sql
-- ============================================================
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

