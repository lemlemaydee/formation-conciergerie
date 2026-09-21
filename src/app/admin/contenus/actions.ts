"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/profile";

function refresh() {
  revalidatePath("/admin/contenus");
  revalidatePath("/dashboard/formation");
  revalidatePath("/dashboard");
  revalidatePath("/admin");
}

export interface SimpleState {
  error: string | null;
  success: boolean;
}

export async function createCategory(_prevState: SimpleState, formData: FormData): Promise<SimpleState> {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Le titre est obligatoire.", success: false };
  const description = String(formData.get("description") ?? "").trim();

  const supabase = await createClient();
  const { count } = await supabase.from("categories").select("*", { count: "exact", head: true });
  const { error } = await supabase.from("categories").insert({
    title,
    description: description || null,
    order_index: count ?? 0,
  });
  if (error) return { error: error.message, success: false };
  refresh();
  return { error: null, success: true };
}

export async function updateCategory(
  id: string,
  _prevState: SimpleState,
  formData: FormData,
): Promise<SimpleState> {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Le titre est obligatoire.", success: false };
  const description = String(formData.get("description") ?? "").trim();

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ title, description: description || null })
    .eq("id", id);
  if (error) return { error: error.message, success: false };
  refresh();
  return { error: null, success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  refresh();
}

export async function createSubcategory(
  categoryId: string,
  _prevState: SimpleState,
  formData: FormData,
): Promise<SimpleState> {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Le titre est obligatoire.", success: false };

  const supabase = await createClient();
  const { count } = await supabase
    .from("subcategories")
    .select("*", { count: "exact", head: true })
    .eq("category_id", categoryId);
  const { error } = await supabase.from("subcategories").insert({
    category_id: categoryId,
    title,
    order_index: count ?? 0,
  });
  if (error) return { error: error.message, success: false };
  refresh();
  return { error: null, success: true };
}

export async function updateSubcategory(
  id: string,
  _prevState: SimpleState,
  formData: FormData,
): Promise<SimpleState> {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Le titre est obligatoire.", success: false };

  const supabase = await createClient();
  const { error } = await supabase.from("subcategories").update({ title }).eq("id", id);
  if (error) return { error: error.message, success: false };
  refresh();
  return { error: null, success: true };
}

export async function deleteSubcategory(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("subcategories").delete().eq("id", id);
  refresh();
}

export interface LessonFormState {
  error: string | null;
  success: boolean;
  lessonId?: string;
}

async function upsertLesson(
  subcategoryId: string,
  formData: FormData,
  lessonId?: string,
): Promise<LessonFormState> {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Le titre est obligatoire.", success: false };
  const description = String(formData.get("description") ?? "").trim();
  const minTier = String(formData.get("min_tier") ?? "starter");
  const durationMinutes = Number(formData.get("duration_minutes") ?? 0);
  const isPublished = formData.get("is_published") === "on";

  const supabase = await createClient();

  if (lessonId) {
    const { error } = await supabase
      .from("lessons")
      .update({
        title,
        description: description || null,
        min_tier: minTier,
        duration_seconds: durationMinutes > 0 ? Math.round(durationMinutes * 60) : null,
        is_published: isPublished,
      })
      .eq("id", lessonId);
    if (error) return { error: error.message, success: false };
    refresh();
    return { error: null, success: true, lessonId };
  }

  const { count } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })
    .eq("subcategory_id", subcategoryId);
  const { data, error } = await supabase
    .from("lessons")
    .insert({
      subcategory_id: subcategoryId,
      title,
      description: description || null,
      min_tier: minTier,
      duration_seconds: durationMinutes > 0 ? Math.round(durationMinutes * 60) : null,
      is_published: isPublished,
      order_index: count ?? 0,
    })
    .select("id")
    .single();
  if (error) return { error: error.message, success: false };

  refresh();
  return { error: null, success: true, lessonId: data.id };
}

export async function createLesson(
  subcategoryId: string,
  _prevState: LessonFormState,
  formData: FormData,
): Promise<LessonFormState> {
  await requireAdmin();
  return upsertLesson(subcategoryId, formData);
}

export async function updateLesson(
  lessonId: string,
  _prevState: LessonFormState,
  formData: FormData,
): Promise<LessonFormState> {
  await requireAdmin();
  return upsertLesson("", formData, lessonId);
}

export async function deleteLesson(id: string) {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: lesson }, { data: resources }] = await Promise.all([
    supabase.from("lessons").select("video_url").eq("id", id).single(),
    supabase.from("lesson_resources").select("file_url").eq("lesson_id", id),
  ]);

  await supabase.from("lessons").delete().eq("id", id);

  const urls = [lesson?.video_url, ...(resources ?? []).map((r) => r.file_url)].filter(
    (u): u is string => Boolean(u),
  );
  for (const url of urls) {
    const parsed = parseStorageUrl(url);
    if (parsed) await supabase.storage.from(parsed.bucket).remove([parsed.path]);
  }

  refresh();
}

// Les URLs publiques Supabase Storage ont la forme
// .../storage/v1/object/public/<bucket>/<path>. On en extrait bucket+path
// pour pouvoir supprimer le fichier quand on remplace ou détache une
// ressource, et éviter d'accumuler des fichiers orphelins.
function parseStorageUrl(url: string): { bucket: string; path: string } | null {
  const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (!match) return null;
  return { bucket: match[1], path: decodeURIComponent(match[2]) };
}

// L'upload du fichier lui-même se fait côté navigateur, direct vers
// Supabase Storage (les Server Actions sont plafonnées à 1 Mo par défaut,
// bien trop peu pour une vidéo — voir next.config.js). Cette action ne fait
// que persister l'URL publique obtenue après upload.
export async function setLessonVideoUrl(lessonId: string, videoUrl: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: existing } = await supabase.from("lessons").select("video_url").eq("id", lessonId).single();

  const { error } = await supabase.from("lessons").update({ video_url: videoUrl }).eq("id", lessonId);
  if (error) throw new Error(error.message);

  if (existing?.video_url && existing.video_url !== videoUrl) {
    const old = parseStorageUrl(existing.video_url);
    if (old) await supabase.storage.from(old.bucket).remove([old.path]);
  }

  refresh();
}

export async function addLessonResource(lessonId: string, title: string, fileUrl: string) {
  await requireAdmin();
  if (!title.trim()) throw new Error("Le titre du document est obligatoire.");
  const supabase = await createClient();
  const { error } = await supabase
    .from("lesson_resources")
    .insert({ lesson_id: lessonId, title: title.trim(), file_url: fileUrl });
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteLessonResource(id: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: resource } = await supabase.from("lesson_resources").select("file_url").eq("id", id).single();
  await supabase.from("lesson_resources").delete().eq("id", id);

  if (resource?.file_url) {
    const parsed = parseStorageUrl(resource.file_url);
    if (parsed) await supabase.storage.from(parsed.bucket).remove([parsed.path]);
  }

  refresh();
}
