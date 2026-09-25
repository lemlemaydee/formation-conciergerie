"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/profile";
import type { IdeaStatus } from "@/app/admin/veille/idees/constants";

export interface SimpleState {
  error: string | null;
  success: boolean;
}

function refresh() {
  revalidatePath("/admin/veille/idees");
}

function numberOrNull(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return null;
  const n = Number(raw.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n) : null;
}

function textOrNull(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim() || null;
}

function readVideoFields(formData: FormData) {
  const accountId = textOrNull(formData, "account_id");
  return {
    account_id: accountId === "none" ? null : accountId,
    title: String(formData.get("title") ?? "").trim(),
    hook: String(formData.get("hook") ?? "").trim(),
    topic: String(formData.get("topic") ?? "").trim(),
    pain_point: textOrNull(formData, "pain_point"),
    comment_themes: textOrNull(formData, "comment_themes"),
    format: textOrNull(formData, "format"),
    video_url: textOrNull(formData, "video_url"),
    posted_at: textOrNull(formData, "posted_at"),
    view_count: numberOrNull(formData, "view_count"),
    like_count: numberOrNull(formData, "like_count"),
    comment_count: numberOrNull(formData, "comment_count"),
    share_count: numberOrNull(formData, "share_count"),
    stats_captured_at: textOrNull(formData, "stats_captured_at"),
    performance_note: textOrNull(formData, "performance_note"),
    content_summary: textOrNull(formData, "content_summary"),
    script: textOrNull(formData, "script"),
  };
}

export async function createVideo(_prevState: SimpleState, formData: FormData): Promise<SimpleState> {
  await requireAdmin();
  const fields = readVideoFields(formData);
  if (!fields.title || !fields.hook || !fields.topic) {
    return { error: "Titre, accroche et sujet sont obligatoires.", success: false };
  }

  const supabase = await createClient();
  const { count } = await supabase.from("veille_videos").select("*", { count: "exact", head: true });
  const { error } = await supabase.from("veille_videos").insert({ ...fields, order_index: count ?? 0 });
  if (error) return { error: error.message, success: false };
  refresh();
  return { error: null, success: true };
}

export async function updateVideo(id: string, _prevState: SimpleState, formData: FormData): Promise<SimpleState> {
  await requireAdmin();
  const fields = readVideoFields(formData);
  if (!fields.title || !fields.hook || !fields.topic) {
    return { error: "Titre, accroche et sujet sont obligatoires.", success: false };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("veille_videos").update(fields).eq("id", id);
  if (error) return { error: error.message, success: false };
  refresh();
  return { error: null, success: true };
}

export async function deleteVideo(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("veille_videos").delete().eq("id", id);
  refresh();
}

export async function updateVideoStatus(id: string, status: IdeaStatus) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("veille_videos").update({ status }).eq("id", id);
  refresh();
}

function readAccountFields(formData: FormData) {
  return {
    handle: String(formData.get("handle") ?? "").trim(),
    display_name: textOrNull(formData, "display_name"),
    category: textOrNull(formData, "category"),
    platform: String(formData.get("platform") ?? "").trim() || "tiktok",
    profile_url: textOrNull(formData, "profile_url"),
    follower_count: numberOrNull(formData, "follower_count"),
    notes: textOrNull(formData, "notes"),
  };
}

export async function createAccount(_prevState: SimpleState, formData: FormData): Promise<SimpleState> {
  await requireAdmin();
  const fields = readAccountFields(formData);
  if (!fields.handle) {
    return { error: "Le compte (@handle) est obligatoire.", success: false };
  }

  const supabase = await createClient();
  const { count } = await supabase.from("veille_accounts").select("*", { count: "exact", head: true });
  const { error } = await supabase.from("veille_accounts").insert({ ...fields, order_index: count ?? 0 });
  if (error) return { error: error.message, success: false };
  refresh();
  return { error: null, success: true };
}

export async function updateAccount(id: string, _prevState: SimpleState, formData: FormData): Promise<SimpleState> {
  await requireAdmin();
  const fields = readAccountFields(formData);
  if (!fields.handle) {
    return { error: "Le compte (@handle) est obligatoire.", success: false };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("veille_accounts").update(fields).eq("id", id);
  if (error) return { error: error.message, success: false };
  refresh();
  return { error: null, success: true };
}

export async function deleteAccount(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("veille_accounts").delete().eq("id", id);
  refresh();
}
