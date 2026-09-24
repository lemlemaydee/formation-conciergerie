-- Le formulaire d'inscription demande maintenant aussi le nom (en plus du
-- prénom, email et téléphone déjà présents).
alter table public.masterclass_registrations
  add column if not exists last_name text;
