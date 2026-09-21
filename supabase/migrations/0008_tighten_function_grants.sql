-- handle_new_user et prevent_self_role_change ne sont que des fonctions de
-- trigger : personne ne doit pouvoir les appeler directement en RPC.
-- is_admin() reste exécutable par anon/authenticated : c'est nécessaire,
-- les policies RLS l'appellent dans leur contexte à chacune de ces requêtes.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.prevent_self_role_change() from public, anon, authenticated;
