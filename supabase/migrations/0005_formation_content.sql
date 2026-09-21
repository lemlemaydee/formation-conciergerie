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
