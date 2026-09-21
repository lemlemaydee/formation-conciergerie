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
