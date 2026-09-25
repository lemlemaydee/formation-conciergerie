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
  revalidatePath("/admin/veille/idees/calendrier");
}

function textOrNull(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim() || null;
}

function readIdeaFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    angle: String(formData.get("angle") ?? "").trim(),
    category: textOrNull(formData, "category"),
    funnel_stage: textOrNull(formData, "funnel_stage"),
    format_inspiration: textOrNull(formData, "format_inspiration"),
    pain_point: textOrNull(formData, "pain_point"),
    inspired_by: textOrNull(formData, "inspired_by"),
    suggested_hook: textOrNull(formData, "suggested_hook"),
    script: textOrNull(formData, "script"),
  };
}

export async function createCalendarIdea(_prevState: SimpleState, formData: FormData): Promise<SimpleState> {
  await requireAdmin();
  const fields = readIdeaFields(formData);
  if (!fields.title || !fields.angle) {
    return { error: "Titre et angle sont obligatoires.", success: false };
  }

  const supabase = await createClient();
  const { count } = await supabase.from("content_calendar_ideas").select("*", { count: "exact", head: true });
  const { error } = await supabase.from("content_calendar_ideas").insert({ ...fields, order_index: count ?? 0 });
  if (error) return { error: error.message, success: false };
  refresh();
  return { error: null, success: true };
}

export async function updateCalendarIdea(id: string, _prevState: SimpleState, formData: FormData): Promise<SimpleState> {
  await requireAdmin();
  const fields = readIdeaFields(formData);
  if (!fields.title || !fields.angle) {
    return { error: "Titre et angle sont obligatoires.", success: false };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("content_calendar_ideas").update(fields).eq("id", id);
  if (error) return { error: error.message, success: false };
  refresh();
  return { error: null, success: true };
}

export async function deleteCalendarIdea(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("content_calendar_ideas").delete().eq("id", id);
  refresh();
}

export async function updateCalendarIdeaStatus(id: string, status: IdeaStatus) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("content_calendar_ideas").update({ status }).eq("id", id);
  refresh();
}
