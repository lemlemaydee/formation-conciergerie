"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/profile";

export async function updateClientTier(clientId: string, tier: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ tier: tier || null })
    .eq("id", clientId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/clients");
  revalidatePath("/admin");
}
