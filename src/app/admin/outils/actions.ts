"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/profile";
import type { SimpleState } from "@/app/admin/contenus/actions";

function refresh() {
  revalidatePath("/admin/outils");
  revalidatePath("/dashboard/outils");
}

function readToolFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    url: String(formData.get("url") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim() || null,
  };
}

export async function createTool(_prevState: SimpleState, formData: FormData): Promise<SimpleState> {
  await requireAdmin();
  const { name, description, url, category } = readToolFields(formData);
  if (!name || !url) return { error: "Nom et lien sont obligatoires.", success: false };

  const supabase = await createClient();
  const { count } = await supabase.from("affiliate_tools").select("*", { count: "exact", head: true });
  const { error } = await supabase.from("affiliate_tools").insert({
    name,
    description,
    url,
    category,
    order_index: count ?? 0,
  });
  if (error) return { error: error.message, success: false };
  refresh();
  return { error: null, success: true };
}

export async function updateTool(
  id: string,
  _prevState: SimpleState,
  formData: FormData,
): Promise<SimpleState> {
  await requireAdmin();
  const { name, description, url, category } = readToolFields(formData);
  if (!name || !url) return { error: "Nom et lien sont obligatoires.", success: false };

  const supabase = await createClient();
  const { error } = await supabase
    .from("affiliate_tools")
    .update({ name, description, url, category })
    .eq("id", id);
  if (error) return { error: error.message, success: false };
  refresh();
  return { error: null, success: true };
}

export async function deleteTool(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("affiliate_tools").delete().eq("id", id);
  refresh();
}

export async function toggleToolActive(id: string, isActive: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("affiliate_tools").update({ is_active: isActive }).eq("id", id);
  refresh();
}
