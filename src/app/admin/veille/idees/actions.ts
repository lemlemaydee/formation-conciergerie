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

function readIdeaFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    hook: String(formData.get("hook") ?? "").trim(),
    topic: String(formData.get("topic") ?? "").trim(),
    pain_point: String(formData.get("pain_point") ?? "").trim() || null,
    format: String(formData.get("format") ?? "").trim() || null,
    source_label: String(formData.get("source_label") ?? "").trim() || null,
    source_url: String(formData.get("source_url") ?? "").trim() || null,
    performance_note: String(formData.get("performance_note") ?? "").trim() || null,
    script: String(formData.get("script") ?? "").trim() || null,
  };
}

export async function createIdea(_prevState: SimpleState, formData: FormData): Promise<SimpleState> {
  await requireAdmin();
  const fields = readIdeaFields(formData);
  if (!fields.title || !fields.hook || !fields.topic) {
    return { error: "Titre, accroche et sujet sont obligatoires.", success: false };
  }

  const supabase = await createClient();
  const { count } = await supabase.from("content_ideas").select("*", { count: "exact", head: true });
  const { error } = await supabase.from("content_ideas").insert({ ...fields, order_index: count ?? 0 });
  if (error) return { error: error.message, success: false };
  refresh();
  return { error: null, success: true };
}

export async function updateIdea(id: string, _prevState: SimpleState, formData: FormData): Promise<SimpleState> {
  await requireAdmin();
  const fields = readIdeaFields(formData);
  if (!fields.title || !fields.hook || !fields.topic) {
    return { error: "Titre, accroche et sujet sont obligatoires.", success: false };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("content_ideas").update(fields).eq("id", id);
  if (error) return { error: error.message, success: false };
  refresh();
  return { error: null, success: true };
}

export async function deleteIdea(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("content_ideas").delete().eq("id", id);
  refresh();
}

export async function updateIdeaStatus(id: string, status: IdeaStatus) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("content_ideas").update({ status }).eq("id", id);
  refresh();
}
