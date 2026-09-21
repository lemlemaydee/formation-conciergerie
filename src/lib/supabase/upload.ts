import { createClient } from "@/lib/supabase/client";

// Upload direct navigateur -> Supabase Storage. Volontairement pas via une
// Server Action : leur corps de requête est plafonné à 1 Mo par défaut chez
// Next.js, bien trop peu pour une vidéo de leçon.
export async function uploadToStorage(bucket: string, folder: string, file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
  const path = `${folder}/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
