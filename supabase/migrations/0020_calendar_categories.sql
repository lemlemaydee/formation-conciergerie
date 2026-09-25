-- Organise le calendrier d'idées par pilier de contenu (catégorie) et par
-- étape de tunnel de vente (général / concret / CTA), sur le modèle
-- classique du marketing réseaux sociaux (haut / milieu / bas de tunnel)
-- appliqué à Reels et TikTok.

alter table public.content_calendar_ideas
  add column if not exists category text check (category in ('conciergerie', 'mindset', 'motivation', 'personal_branding')),
  add column if not exists funnel_stage text check (funnel_stage in ('general', 'concret', 'cta'));

-- Classement des 6 idées déjà en place
update public.content_calendar_ideas set category = 'conciergerie', funnel_stage = 'general'
  where title = 'C''est quoi exactement une conciergerie Airbnb ?';
update public.content_calendar_ideas set category = 'conciergerie', funnel_stage = 'concret'
  where title = 'Combien faut-il vraiment pour démarrer ?';
update public.content_calendar_ideas set category = 'conciergerie', funnel_stage = 'concret'
  where title = 'Le marché n''est pas saturé sur le haut de gamme — voici pourquoi';
update public.content_calendar_ideas set category = 'conciergerie', funnel_stage = 'concret'
  where title = '5 questions qu''un propriétaire vous pose toujours en premier rendez-vous';
update public.content_calendar_ideas set category = 'conciergerie', funnel_stage = 'general'
  where title = 'Une anecdote vécue en gérant un de nos biens';
update public.content_calendar_ideas set category = 'conciergerie', funnel_stage = 'concret'
  where title = 'Ce que je change dans l''onboarding d''un nouveau propriétaire';

-- Nouvelles idées pour couvrir les 3 autres piliers (mindset, motivation,
-- personal branding) et compléter chaque pilier avec les 3 étapes de tunnel :
-- général (large audience, pas d'engagement demandé) -> concret (valeur
-- pratique, construit la confiance) -> CTA (pousse vers la vidéo gratuite).
insert into public.content_calendar_ideas (title, angle, format_inspiration, pain_point, inspired_by, suggested_hook, category, funnel_stage, order_index) values
(
  'Prêt à vous lancer ? Voici comment accéder à la méthode complète',
  'Vidéo de clôture qui récapitule la promesse et renvoie directement vers la formation gratuite.',
  'Appel à l''action direct',
  null,
  'Étape de conversion classique en fin de tunnel réseaux sociaux',
  'Vous avez vu la méthode, maintenant voici comment aller plus loin, gratuitement',
  'conciergerie', 'cta', 7
),
(
  'Pourquoi la majorité abandonne avant même d''avoir signé un propriétaire',
  'Vidéo mindset sur la persévérance dans les premières semaines, sans dramatiser ni promettre un raccourci.',
  'Constat / mise en garde',
  'Peur de se décourager avant d''avoir de premiers résultats',
  'Format contre-intuitif observé chez plusieurs comptes de la niche',
  'La plupart abandonnent au moment exact où ça allait commencer à marcher',
  'mindset', 'general', 8
),
(
  'Le syndrome de l''imposteur quand on démarre sans expérience',
  'Aborde directement la peur de ne pas être légitime face à un propriétaire, avec un conseil concret pour la dépasser.',
  'Conseil pratique / mindset',
  'Se sentir illégitime ou pas assez qualifié pour démarcher un propriétaire',
  'Pain point récurrent identifié dans plusieurs commentaires concurrents ("trop jeune", "pas assez qualifié")',
  null,
  'mindset', 'concret', 9
),
(
  'Si vous hésitez encore à vous lancer, regardez ça avant de laisser tomber',
  'Vidéo courte qui s''adresse directement à l''hésitation et renvoie vers la formation gratuite pour lever les doutes.',
  'Appel à l''action direct',
  'Hésitation à passer à l''action',
  'Étape de conversion classique en fin de tunnel réseaux sociaux',
  null,
  'mindset', 'cta', 10
),
(
  'Pourquoi on a choisi Monaco et la Côte d''Azur plutôt qu''ailleurs',
  'Raconte le vrai raisonnement business derrière le choix du haut de gamme, pour inspirer un positionnement réfléchi plutôt qu''un démarrage au hasard.',
  'Storytelling positionnement',
  null,
  'Différenciateur haut de gamme déjà identifié dans notre étude concurrentielle',
  null,
  'motivation', 'concret', 11
),
(
  'Ce qui nous a donné envie de lancer Formation Conciergerie',
  'L''histoire d''origine de Mehdi et Jacques — à remplir avec le vrai déclic qui a mené à la création de l''entreprise.',
  'Storytelling origine',
  null,
  'Format origin story, très utilisé en haut de tunnel sur Reels/TikTok pour créer de l''attache',
  null,
  'motivation', 'general', 12
),
(
  'Ce que vous allez découvrir dans notre formation gratuite',
  'Teaser concret du contenu de la formation gratuite pour donner envie de s''inscrire.',
  'Appel à l''action direct',
  null,
  'Étape de conversion classique en fin de tunnel réseaux sociaux',
  null,
  'motivation', 'cta', 13
),
(
  'Qui sommes-nous, et pourquoi nous écouter plutôt qu''un autre',
  'Vidéo de présentation directe de Mehdi et Jacques, avec la preuve concrète (120+ biens gérés) plutôt qu''une promesse abstraite.',
  'Présentation directe caméra',
  'Ne pas savoir à qui on a affaire ni pourquoi leur faire confiance',
  'Vidéo de confiance fondatrice, standard en haut de tunnel pour un compte de formateur',
  'On gère plus de 120 biens entre Monaco et la Côte d''Azur — voici qui on est',
  'personal_branding', 'general', 14
),
(
  'Une journée dans notre quotidien de conciergerie haut de gamme',
  'Format vlog behind-the-scenes qui montre concrètement le métier au jour le jour, sur un vrai bien géré.',
  'Vlog / behind-the-scenes',
  'Ne pas savoir à quoi ressemble vraiment le métier au quotidien',
  'Format immersif qui humanise la marque, très utilisé en milieu de tunnel',
  null,
  'personal_branding', 'concret', 15
),
(
  'On répond à toutes vos questions dans une vidéo gratuite',
  'Vidéo de clôture qui positionne la formation gratuite comme le prolongement naturel de la relation de confiance construite.',
  'Appel à l''action direct',
  null,
  'Étape de conversion classique en fin de tunnel réseaux sociaux',
  null,
  'personal_branding', 'cta', 16
);
