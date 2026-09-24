"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/profile";

function parseStorageUrl(url: string): { bucket: string; path: string } | null {
  const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (!match) return null;
  return { bucket: match[1], path: decodeURIComponent(match[2]) };
}

function refresh() {
  revalidatePath("/admin/parametres");
  revalidatePath("/");
}

export async function setHeroVideoUrl(videoUrl: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: existing } = await supabase.from("site_settings").select("id, hero_video_url").limit(1).single();
  if (!existing) throw new Error("Réglages introuvables.");

  const { error } = await supabase
    .from("site_settings")
    .update({ hero_video_url: videoUrl, updated_at: new Date().toISOString() })
    .eq("id", existing.id);
  if (error) throw new Error(error.message);

  if (existing.hero_video_url && existing.hero_video_url !== videoUrl) {
    const old = parseStorageUrl(existing.hero_video_url);
    if (old) await supabase.storage.from(old.bucket).remove([old.path]);
  }
  refresh();
}

export async function setHeroPosterUrl(posterUrl: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id, hero_video_poster_url")
    .limit(1)
    .single();
  if (!existing) throw new Error("Réglages introuvables.");

  const { error } = await supabase
    .from("site_settings")
    .update({ hero_video_poster_url: posterUrl, updated_at: new Date().toISOString() })
    .eq("id", existing.id);
  if (error) throw new Error(error.message);

  if (existing.hero_video_poster_url && existing.hero_video_poster_url !== posterUrl) {
    const old = parseStorageUrl(existing.hero_video_poster_url);
    if (old) await supabase.storage.from(old.bucket).remove([old.path]);
  }
  refresh();
}

export async function removeHeroVideo() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id, hero_video_url, hero_video_poster_url")
    .limit(1)
    .single();
  if (!existing) return;

  await supabase
    .from("site_settings")
    .update({ hero_video_url: null, hero_video_poster_url: null, updated_at: new Date().toISOString() })
    .eq("id", existing.id);

  for (const url of [existing.hero_video_url, existing.hero_video_poster_url]) {
    if (!url) continue;
    const parsed = parseStorageUrl(url);
    if (parsed) await supabase.storage.from(parsed.bucket).remove([parsed.path]);
  }
  refresh();
}

export async function setMasterclassVideoUrl(videoUrl: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: existing } = await supabase.from("site_settings").select("id, masterclass_video_url").limit(1).single();
  if (!existing) throw new Error("Réglages introuvables.");

  const { error } = await supabase
    .from("site_settings")
    .update({ masterclass_video_url: videoUrl, updated_at: new Date().toISOString() })
    .eq("id", existing.id);
  if (error) throw new Error(error.message);

  if (existing.masterclass_video_url && existing.masterclass_video_url !== videoUrl) {
    const old = parseStorageUrl(existing.masterclass_video_url);
    if (old) await supabase.storage.from(old.bucket).remove([old.path]);
  }
  revalidatePath("/masterclass");
  refresh();
}

export async function setMasterclassPosterUrl(posterUrl: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id, masterclass_video_poster_url")
    .limit(1)
    .single();
  if (!existing) throw new Error("Réglages introuvables.");

  const { error } = await supabase
    .from("site_settings")
    .update({ masterclass_video_poster_url: posterUrl, updated_at: new Date().toISOString() })
    .eq("id", existing.id);
  if (error) throw new Error(error.message);

  if (existing.masterclass_video_poster_url && existing.masterclass_video_poster_url !== posterUrl) {
    const old = parseStorageUrl(existing.masterclass_video_poster_url);
    if (old) await supabase.storage.from(old.bucket).remove([old.path]);
  }
  revalidatePath("/masterclass");
  refresh();
}

export async function removeMasterclassVideo() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id, masterclass_video_url, masterclass_video_poster_url")
    .limit(1)
    .single();
  if (!existing) return;

  await supabase
    .from("site_settings")
    .update({ masterclass_video_url: null, masterclass_video_poster_url: null, updated_at: new Date().toISOString() })
    .eq("id", existing.id);

  for (const url of [existing.masterclass_video_url, existing.masterclass_video_poster_url]) {
    if (!url) continue;
    const parsed = parseStorageUrl(url);
    if (parsed) await supabase.storage.from(parsed.bucket).remove([parsed.path]);
  }
  revalidatePath("/masterclass");
  refresh();
}
