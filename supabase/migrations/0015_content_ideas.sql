-- Banque d'idées vidéos (veille concurrentielle TikTok) : accroches, sujets,
-- pain points et exemples observés chez les concurrents, à transformer plus
-- tard en scripts. Usage interne admin uniquement, jamais exposé au public.

create table if not exists public.content_ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  hook text not null,
  topic text not null,
  pain_point text,
  format text,
  source_label text,
  source_url text,
  performance_note text,
  status text not null default 'idee' check (status in ('idee', 'a_tourner', 'tourne', 'publie')),
  script text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.content_ideas enable row level security;

create policy "Admins read content ideas" on public.content_ideas for select using (public.is_admin());
create policy "Admins insert content ideas" on public.content_ideas for insert with check (public.is_admin());
create policy "Admins update content ideas" on public.content_ideas for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete content ideas" on public.content_ideas for delete using (public.is_admin());

-- Amorçage avec des idées réelles repérées pendant la veille TikTok du 23/09/2026
-- (hooks et sujets observés chez la concurrence), pas des exemples inventés.
insert into public.content_ideas (title, hook, topic, pain_point, format, source_label, performance_note, order_index) values
('Pourquoi il ne faut PAS te lancer en conciergerie', 'NE LANCE SURTOUT PAS DE CONCIERGERIE AIRBNB', 'Erreurs de débutant / mise en garde', 'Peur de se lancer sans savoir si c''est fait pour soi', 'Contre-intuitif / pattern interrupt', '@aicha.lcd — Conciergerie Airbnb (6,2K abonnés)', 'Vidéo épinglée, 36,7K vues', 1),
('J''ai gagné 1600€ mon premier mois', 'J''ai gagné 1600€ mon premier mois en conciergerie', 'Résultat chiffré / preuve sociale personnelle', 'Doute sur la rentabilité réelle du modèle', 'Résultat chiffré', '@aicha.lcd', 'Repéré dans #conciergerie', 2),
('3 erreurs à ne pas faire en conciergerie', '3 erreurs à ne pas faire', 'Erreurs fréquentes', 'Peur de mal faire / de perdre un propriétaire', 'Liste à numéro', '@sofian_immobilier — Get Host Conciergerie (5,5K abonnés)', null, 3),
('Le vrai coût d''un appel non décroché', 'Un simple appel à un propriétaire peut rapporter 1500€. La plupart n''osent jamais décrocher le téléphone.', 'Prospection téléphonique', 'Peur de prospecter / de démarcher par téléphone', 'Statistique choc + vérité qui dérange', '@adam.lkl — repéré via #souslocation', null, 4),
('Les 5 étapes pour te lancer', 'Les 5 étapes pour te lancer dans la sous-location immobilière', 'Méthode étape par étape', 'Ne pas savoir par où commencer', 'Tutoriel structuré', '@ilies_business (23,7K abonnés, 1M likes cumulés)', 'Compte le plus actif croisé dans la veille', 5),
('Avec combien peut-on commencer ?', 'Avec combien peut-on commencer le business de sous-location immobilière ?', 'Budget de démarrage', 'Croire qu''il faut beaucoup d''argent pour se lancer', 'Question-réponse', '@ilies_business', null, 6),
('Comment je gère le ménage', 'Voici comment je gère le ménage', 'Opérations quotidiennes / logistique', 'Peur de la charge opérationnelle (ménage, linge, turnover)', 'Coulisses / behind-the-scenes', '@victor_chvle — Conciergerie & Sous-Location', null, 7),
('POV : une journée type', 'POV : une journée type en conciergerie', 'Quotidien du métier', 'Ne pas savoir à quoi ressemble vraiment le métier au quotidien', 'POV / immersion', 'Maison FD — repéré dans #conciergerie', null, 8),
('Pharmacien devenu gérant de 15 logements', 'Xavier est passé de pharmacien à plus de 15 logements en gestion en 3 mois', 'Étude de cas / reconversion', 'Croire qu''il faut déjà être du métier pour réussir', 'Témoignage chiffré et daté', 'Conciergerie Academy (@ezekway) — page de capture', 'Cas mis en avant sur leur funnel principal', 9),
('21 ans, garagiste, 4 villas de luxe en 2 mois', 'Amine, 21 ans, travaillait dans un garage → 4 villas de luxe en 2 mois', 'Étude de cas / jeunesse', 'Se sentir trop jeune ou pas assez qualifié', 'Témoignage chiffré et daté', 'Conciergerie Academy (@ezekway)', null, 10),
('Comment savoir si ton marché est rentable', 'Comment savoir si ton marché est rentable avant de te lancer', 'Étude de marché / rentabilité', 'Peur de se lancer dans une ville qui ne marche pas', 'Tutoriel / méthode', 'CYGA Academy (@yann.gdrey) — masterclass', null, 11),
('Comment construire une offre qui donne envie', 'Comment construire une offre qui donne envie aux propriétaires de te confier leur logement', 'Positionnement / offre commerciale', 'Ne pas savoir se différencier des autres conciergeries', 'Tutoriel / méthode', 'CYGA Academy (@yann.gdrey)', null, 12),
('1er client en 1 appel, 600€ le 1er mois', '1er client en 1 appel, 600€ le 1er mois', 'Résultat rapide / preuve sociale', 'Douter que ça puisse marcher rapidement', 'Témoignage chiffré', 'Maison Bleue (@maisonbleue_) — Dounia, salariée RH', null, 13),
('1h par jour, sans lâcher ton CDI', '1h par jour, sans lâcher ton CDI', 'Compatibilité avec un emploi salarié', 'Peur de devoir tout quitter pour se lancer', 'Promesse / positionnement', 'Maison Bleue (@maisonbleue_)', '51,4K abonnés', 14),
('Comment j''ai construit ma conciergerie en post-partum', 'Comment j''ai construit une conciergerie Airbnb depuis chez moi, même en post-partum', 'Compatibilité vie de famille', 'Culpabilité de vouloir un revenu sans sacrifier sa présence familiale', 'Storytelling personnel', 'Sabel Academy (@sabelfamilly)', '730K abonnés', 15),
('Le guide complet conciergerie Airbnb', 'GUIDE COMPLET conciergerie Airbnb', 'Contenu pilier / vue d''ensemble', 'Ne pas savoir par où commencer à se former', 'Guide / pilier de contenu', '@ezekway — Conciergerie Academy', null, 16),
('Ce que personne ne te dit sur la conciergerie', 'Personne ne te parle de...', 'Réalités cachées du métier', 'Sentiment d''être mal informé avant de se lancer', 'Contre-intuitif / révélation', 'Repéré dans #conciergerie', null, 17),
('Anecdote client 18/100', 'Anecdote 18/100 pour...', 'Storytelling / anecdotes clients', 'Manque de contenu "vécu", trop de contenu théorique', 'Série d''anecdotes numérotées', '@pierreptt_', null, 18);
