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
