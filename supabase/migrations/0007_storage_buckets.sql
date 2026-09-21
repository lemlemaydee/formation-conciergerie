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
