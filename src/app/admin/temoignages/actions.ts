"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/profile";
import type { SimpleState } from "@/app/admin/contenus/actions";

function refresh() {
  revalidatePath("/admin/temoignages");
  revalidatePath("/");
}

function parseStorageUrl(url: string): { bucket: string; path: string } | null {
  const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (!match) return null;
  return { bucket: match[1], path: decodeURIComponent(match[2]) };
}

export async function createTestimonial(
  _prevState: SimpleState,
  formData: FormData,
): Promise<SimpleState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  if (!name) return { error: "Le nom est obligatoire.", success: false };

  const supabase = await createClient();
  const { count } = await supabase.from("video_testimonials").select("*", { count: "exact", head: true });
  const { error } = await supabase.from("video_testimonials").insert({
    name,
    role: role || null,
    video_url: "",
    is_active: false,
    order_index: count ?? 0,
  });
  if (error) return { error: error.message, success: false };
  refresh();
  return { error: null, success: true };
}

export async function updateTestimonial(
  id: string,
  _prevState: SimpleState,
  formData: FormData,
): Promise<SimpleState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  if (!name) return { error: "Le nom est obligatoire.", success: false };

  const supabase = await createClient();
  const { error } = await supabase
    .from("video_testimonials")
    .update({ name, role: role || null })
    .eq("id", id);
  if (error) return { error: error.message, success: false };
  refresh();
  return { error: null, success: true };
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: row } = await supabase
    .from("video_testimonials")
    .select("video_url, poster_url")
    .eq("id", id)
    .single();
  await supabase.from("video_testimonials").delete().eq("id", id);

  const urls = [row?.video_url, row?.poster_url].filter((u): u is string => Boolean(u));
  for (const url of urls) {
    const parsed = parseStorageUrl(url);
    if (parsed) await supabase.storage.from(parsed.bucket).remove([parsed.path]);
  }
  refresh();
}

export async function toggleTestimonialActive(id: string, isActive: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: row } = await supabase.from("video_testimonials").select("video_url").eq("id", id).single();
  if (isActive && !row?.video_url) {
    throw new Error("Ajoute d'abord une vidéo avant de l'activer.");
  }
  await supabase.from("video_testimonials").update({ is_active: isActive }).eq("id", id);
  refresh();
}

export async function setTestimonialVideoUrl(id: string, videoUrl: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: existing } = await supabase.from("video_testimonials").select("video_url").eq("id", id).single();

  const { error } = await supabase.from("video_testimonials").update({ video_url: videoUrl }).eq("id", id);
  if (error) throw new Error(error.message);

  if (existing?.video_url && existing.video_url !== videoUrl) {
    const old = parseStorageUrl(existing.video_url);
    if (old) await supabase.storage.from(old.bucket).remove([old.path]);
  }
  refresh();
}

export async function setTestimonialPosterUrl(id: string, posterUrl: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: existing } = await supabase.from("video_testimonials").select("poster_url").eq("id", id).single();

  const { error } = await supabase.from("video_testimonials").update({ poster_url: posterUrl }).eq("id", id);
  if (error) throw new Error(error.message);

  if (existing?.poster_url && existing.poster_url !== posterUrl) {
    const old = parseStorageUrl(existing.poster_url);
    if (old) await supabase.storage.from(old.bucket).remove([old.path]);
  }
  refresh();
}
