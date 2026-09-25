-- Calendrier d'idées perso : des idées de vidéos ORIGINALES pour Formation
-- Conciergerie, synthétisées à partir des patterns observés dans veille_videos
-- (formats qui marchent, pain points récurrents) — jamais une reprise du
-- contenu d'un concurrent, toujours une angle propre à adapter avec nos
-- vrais chiffres et notre vraie histoire.

create table if not exists public.content_calendar_ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  angle text not null,
  format_inspiration text,
  pain_point text,
  inspired_by text,
  suggested_hook text,
  script text,
  status text not null default 'idee' check (status in ('idee', 'a_tourner', 'tourne', 'publie')),
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.content_calendar_ideas enable row level security;

create policy "Admins read calendar ideas" on public.content_calendar_ideas for select using (public.is_admin());
create policy "Admins insert calendar ideas" on public.content_calendar_ideas for insert with check (public.is_admin());
create policy "Admins update calendar ideas" on public.content_calendar_ideas for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete calendar ideas" on public.content_calendar_ideas for delete using (public.is_admin());

insert into public.content_calendar_ideas (title, angle, format_inspiration, pain_point, inspired_by, suggested_hook, order_index) values
(
  'C''est quoi exactement une conciergerie Airbnb ?',
  'Explication directe et concrète du métier en s''appuyant sur un exemple réel parmi vos 120+ biens gérés — ce que vous faites au quotidien pour un propriétaire, du studio à la villa de luxe.',
  'Explication directe caméra',
  'Confusion totale sur le concept, même après avoir vu plusieurs vidéos du secteur',
  'Question la plus répétée dans les commentaires chez @maisonbleue_ (des dizaines de "c''est quoi ?" sur leur vidéo à 3071 commentaires) et @ezekway',
  'On me demande tous les jours ce qu''est vraiment une conciergerie Airbnb — voici la vraie réponse',
  1
),
(
  'Combien faut-il vraiment pour démarrer ?',
  'Réponse chiffrée et honnête, sans promesse de revenu passif magique — ce qui est réellement nécessaire pour se lancer, basé sur votre propre expérience.',
  'Réponse directe / Q&A',
  'Doute sur le capital de départ nécessaire, méfiance envers les promesses de revenu passif',
  'Questions récurrentes "avec combien on commence" chez @ezekway, et commentaires sceptiques chez @maisonbleue_ sur les promesses de revenu facile',
  'Non, vous n''avez pas besoin de dizaines de milliers d''euros pour commencer — voici la vraie somme',
  2
),
(
  'Le marché n''est pas saturé sur le haut de gamme — voici pourquoi',
  'Répond directement à l''objection "c''est déjà saturé" en s''appuyant sur votre vrai positionnement Monaco / Côte d''Azur, un segment que peu de conciergeries adressent réellement.',
  'Réponse à objection',
  'Peur que le marché soit déjà trop concurrentiel',
  'Objection saturation vue en commentaire chez @maisonbleue_ ; différenciateur haut de gamme déjà identifié dans notre propre étude de la concurrence',
  'On me dit tout le temps que la conciergerie est saturée — sur le haut de gamme, c''est l''inverse',
  3
),
(
  '5 questions qu''un propriétaire vous pose toujours en premier rendez-vous',
  'Liste concrète des questions récurrentes des propriétaires (tirée de votre expérience réelle avec vos 120+ biens) et comment y répondre pour rassurer.',
  'Liste numérotée',
  'Ne pas savoir comment se préparer à un premier rendez-vous avec un propriétaire',
  'Format liste numérotée qui performe bien chez @yann.gdrey ("10 idées d''attentions")',
  null,
  4
),
(
  'Une anecdote vécue en gérant un de nos biens',
  'Une vraie mésaventure ou situation marquante vécue par Mehdi ou Jacques sur un bien géré — à remplir avec une histoire réelle, jamais inventée.',
  'Storytelling anecdote',
  'Ne pas savoir à quoi ressemble vraiment le quotidien du métier',
  'Format anecdote choc qui a très bien marché chez @yann.gdrey (ratio commentaires/likes très élevé)',
  null,
  5
),
(
  'Ce que je change dans l''onboarding d''un nouveau propriétaire',
  'Partage concret d''un process réel de Formation Conciergerie — ce qui rassure un propriétaire dès les 48 premières heures.',
  'Coulisses / behind-the-scenes',
  'Peur de la charge opérationnelle et du manque de suivi après la signature',
  'Reprend un des sujets déjà identifiés dans la banque d''idées initiale (repéré chez @victor_chvle et Conciergerie Academy)',
  null,
  6
);
