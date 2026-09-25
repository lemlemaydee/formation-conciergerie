-- Refonte de la banque d'idées vidéos : on passe d'une liste plate
-- (content_ideas) à un modèle relationnel compte -> vidéos, pour pouvoir
-- trier/filtrer par compte, suivre des statistiques par vidéo et distinguer
-- le brouillon de script (le nôtre) d'un résumé structuré de la vidéo
-- concurrente observée (jamais un transcript mot pour mot — voir content_summary).

create table if not exists public.veille_accounts (
  id uuid primary key default gen_random_uuid(),
  handle text not null unique,
  display_name text,
  category text check (category in ('formateur', 'conciergerie')),
  platform text not null default 'tiktok',
  profile_url text,
  follower_count integer,
  notes text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.veille_accounts enable row level security;

create policy "Admins read veille accounts" on public.veille_accounts for select using (public.is_admin());
create policy "Admins insert veille accounts" on public.veille_accounts for insert with check (public.is_admin());
create policy "Admins update veille accounts" on public.veille_accounts for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete veille accounts" on public.veille_accounts for delete using (public.is_admin());

create table if not exists public.veille_videos (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.veille_accounts(id) on delete set null,
  title text not null,
  hook text not null,
  topic text not null,
  pain_point text,
  comment_themes text,
  format text,
  video_url text,
  posted_at date,
  view_count bigint,
  like_count bigint,
  comment_count bigint,
  share_count bigint,
  stats_captured_at date,
  performance_note text,
  content_summary text,
  script text,
  status text not null default 'idee' check (status in ('idee', 'a_tourner', 'tourne', 'publie')),
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.veille_videos enable row level security;

create policy "Admins read veille videos" on public.veille_videos for select using (public.is_admin());
create policy "Admins insert veille videos" on public.veille_videos for insert with check (public.is_admin());
create policy "Admins update veille videos" on public.veille_videos for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete veille videos" on public.veille_videos for delete using (public.is_admin());

create index if not exists veille_videos_account_id_idx on public.veille_videos(account_id);

-- Comptes déjà catalogués dans le dossier de veille (/admin/veille), repris ici
-- pour pouvoir les relier aux vidéos. Stats du 23/09/2026 (instantané, à
-- rafraîchir manuellement). dryxio_biz ajouté à la demande, pas encore audité.
insert into public.veille_accounts (handle, display_name, category, follower_count, order_index) values
('@yann.gdrey', 'Yann Gendrey — CYGA Academy', 'formateur', 14600, 1),
('@immosousloc', 'Mina — BNB Academy', 'formateur', 6718, 2),
('@sabelfamilly', 'Sam & Abel — Sabel Academy', 'formateur', 730000, 3),
('@ilies_business', 'iliesbusiness', 'formateur', 23700, 4),
('@aicha.lcd', 'Aïcha', 'formateur', 6226, 5),
('@walid.conciergerie', 'walidconciergerie', 'formateur', 2620, 6),
('@lancetaconciergerie', 'Lance ta conciergerie', 'formateur', 1632, 7),
('@victor_chvle', 'Victor Chevalier', 'formateur', 1445, 8),
('@tonimartin.ch', 'LaSousLocationPro.ch', 'formateur', 4793, 9),
('@william_trvn', 'William_trvn', 'formateur', 2493, 10),
('@ezekway', 'Conciergerie Academy', 'formateur', 14300, 11),
('@maisonbleue_', 'MaisonBleue', 'formateur', 51400, 12),
('@blsd.immo', 'Conciergerie en ligne', 'conciergerie', 103400, 13),
('@bnbzen_france', 'BnbZen France', 'conciergerie', 35700, 14),
('@location.service8', 'Location Service France', 'conciergerie', 11900, 15),
('@rrconciergerie', 'rrconciergerie', 'conciergerie', 11500, 16),
('@cm.conciergerie', 'CM Conciergerie', 'conciergerie', 10400, 17),
('@sofian_immobilier', 'Get Host Conciergerie', 'conciergerie', 5506, 18),
('@simply.home.conciergerie', 'Simply Home Conciergerie', 'conciergerie', 1633, 19),
('@conciergerie.paris', 'Conciergerie Paris', 'conciergerie', 2840, 20),
('@keycosyconciergerie', 'Key Cosy', 'conciergerie', 312, 21),
('@stayo.conciergerie', 'Conciergerie Rennes', 'conciergerie', 235, 22),
('@maisondorconciergerie', 'Maisond''Or', 'conciergerie', 257, 23),
('@malcolm.chc', 'Malcolm', 'conciergerie', 547, 24),
('@adam.lkl', null, null, null, 25),
('@pierreptt_', null, null, null, 26),
('@dryxio_biz', null, null, null, 27)
on conflict (handle) do nothing;

-- Reprise des 18 idées existantes, reliées à leur compte quand identifiable.
insert into public.veille_videos (account_id, title, hook, topic, pain_point, format, performance_note, status, order_index)
select
  (select id from public.veille_accounts where handle = v.handle),
  v.title, v.hook, v.topic, v.pain_point, v.format, v.performance_note, 'idee', v.order_index
from (values
  ('@aicha.lcd', 'Pourquoi il ne faut PAS te lancer en conciergerie', 'NE LANCE SURTOUT PAS DE CONCIERGERIE AIRBNB', 'Erreurs de débutant / mise en garde', 'Peur de se lancer sans savoir si c''est fait pour soi', 'Contre-intuitif / pattern interrupt', 'Vidéo épinglée, 36,7K vues', 1),
  ('@aicha.lcd', 'J''ai gagné 1600€ mon premier mois', 'J''ai gagné 1600€ mon premier mois en conciergerie', 'Résultat chiffré / preuve sociale personnelle', 'Doute sur la rentabilité réelle du modèle', 'Résultat chiffré', 'Repéré dans #conciergerie', 2),
  ('@sofian_immobilier', '3 erreurs à ne pas faire en conciergerie', '3 erreurs à ne pas faire', 'Erreurs fréquentes', 'Peur de mal faire / de perdre un propriétaire', 'Liste à numéro', null, 3),
  ('@adam.lkl', 'Le vrai coût d''un appel non décroché', 'Un simple appel à un propriétaire peut rapporter 1500€. La plupart n''osent jamais décrocher le téléphone.', 'Prospection téléphonique', 'Peur de prospecter / de démarcher par téléphone', 'Statistique choc + vérité qui dérange', null, 4),
  ('@ilies_business', 'Les 5 étapes pour te lancer', 'Les 5 étapes pour te lancer dans la sous-location immobilière', 'Méthode étape par étape', 'Ne pas savoir par où commencer', 'Tutoriel structuré', 'Compte le plus actif croisé dans la veille', 5),
  ('@ilies_business', 'Avec combien peut-on commencer ?', 'Avec combien peut-on commencer le business de sous-location immobilière ?', 'Budget de démarrage', 'Croire qu''il faut beaucoup d''argent pour se lancer', 'Question-réponse', null, 6),
  ('@victor_chvle', 'Comment je gère le ménage', 'Voici comment je gère le ménage', 'Opérations quotidiennes / logistique', 'Peur de la charge opérationnelle (ménage, linge, turnover)', 'Coulisses / behind-the-scenes', null, 7),
  (null, 'POV : une journée type', 'POV : une journée type en conciergerie', 'Quotidien du métier', 'Ne pas savoir à quoi ressemble vraiment le métier au quotidien', 'POV / immersion', 'Maison FD — repéré dans #conciergerie', 8),
  ('@ezekway', 'Pharmacien devenu gérant de 15 logements', 'Xavier est passé de pharmacien à plus de 15 logements en gestion en 3 mois', 'Étude de cas / reconversion', 'Croire qu''il faut déjà être du métier pour réussir', 'Témoignage chiffré et daté', 'Cas mis en avant sur leur funnel principal', 9),
  ('@ezekway', '21 ans, garagiste, 4 villas de luxe en 2 mois', 'Amine, 21 ans, travaillait dans un garage → 4 villas de luxe en 2 mois', 'Étude de cas / jeunesse', 'Se sentir trop jeune ou pas assez qualifié', 'Témoignage chiffré et daté', null, 10),
  ('@yann.gdrey', 'Comment savoir si ton marché est rentable', 'Comment savoir si ton marché est rentable avant de te lancer', 'Étude de marché / rentabilité', 'Peur de se lancer dans une ville qui ne marche pas', 'Tutoriel / méthode', null, 11),
  ('@yann.gdrey', 'Comment construire une offre qui donne envie', 'Comment construire une offre qui donne envie aux propriétaires de te confier leur logement', 'Positionnement / offre commerciale', 'Ne pas savoir se différencier des autres conciergeries', 'Tutoriel / méthode', null, 12),
  ('@maisonbleue_', '1er client en 1 appel, 600€ le 1er mois', '1er client en 1 appel, 600€ le 1er mois', 'Résultat rapide / preuve sociale', 'Douter que ça puisse marcher rapidement', 'Témoignage chiffré', 'Dounia, salariée RH', 13),
  ('@maisonbleue_', '1h par jour, sans lâcher ton CDI', '1h par jour, sans lâcher ton CDI', 'Compatibilité avec un emploi salarié', 'Peur de devoir tout quitter pour se lancer', 'Promesse / positionnement', '51,4K abonnés', 14),
  ('@sabelfamilly', 'Comment j''ai construit ma conciergerie en post-partum', 'Comment j''ai construit une conciergerie Airbnb depuis chez moi, même en post-partum', 'Compatibilité vie de famille', 'Culpabilité de vouloir un revenu sans sacrifier sa présence familiale', 'Storytelling personnel', '730K abonnés', 15),
  ('@ezekway', 'Le guide complet conciergerie Airbnb', 'GUIDE COMPLET conciergerie Airbnb', 'Contenu pilier / vue d''ensemble', 'Ne pas savoir par où commencer à se former', 'Guide / pilier de contenu', null, 16),
  (null, 'Ce que personne ne te dit sur la conciergerie', 'Personne ne te parle de...', 'Réalités cachées du métier', 'Sentiment d''être mal informé avant de se lancer', 'Contre-intuitif / révélation', 'Repéré dans #conciergerie', 17),
  ('@pierreptt_', 'Anecdote client 18/100', 'Anecdote 18/100 pour...', 'Storytelling / anecdotes clients', 'Manque de contenu "vécu", trop de contenu théorique', 'Série d''anecdotes numérotées', null, 18)
) as v(handle, title, hook, topic, pain_point, format, performance_note, order_index);

drop table if exists public.content_ideas cascade;
