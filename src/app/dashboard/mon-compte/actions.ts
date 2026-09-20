"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { translateAuthError } from "@/lib/auth-errors";

export interface AccountState {
  error: string | null;
  success: string | null;
}

const idle: AccountState = { error: null, success: null };

export async function updateFullName(_prevState: AccountState, formData: FormData): Promise<AccountState> {
  const fullName = String(formData.get("fullName") ?? "");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ...idle, error: "Session expirée, merci de vous reconnecter." };

  const { error: authError } = await supabase.auth.updateUser({ data: { full_name: fullName } });
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id);

  if (authError || profileError) {
    return { ...idle, error: translateAuthError((authError ?? profileError)!.message) };
  }

  revalidatePath("/dashboard/mon-compte");
  return { error: null, success: "Nom mis à jour." };
}

export async function updatePassword(_prevState: AccountState, formData: FormData): Promise<AccountState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password !== confirmPassword) {
    return { ...idle, error: "Les mots de passe ne correspondent pas." };
  }
  if (password.length < 6) {
    return { ...idle, error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { ...idle, error: translateAuthError(error.message) };
  }

  return { error: null, success: "Mot de passe mis à jour." };
}
