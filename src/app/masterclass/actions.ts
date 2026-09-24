"use server";

import { createClient } from "@/lib/supabase/server";

export interface RegisterState {
  error: string | null;
  success: boolean;
}

export async function registerForMasterclass(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!firstName || !email) {
    return { error: "Merci de renseigner votre prénom et votre email.", success: false };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("masterclass_registrations").insert({ first_name: firstName, email });

  if (error) {
    return { error: "Impossible de valider l'inscription pour le moment. Réessayez dans un instant.", success: false };
  }

  return { error: null, success: true };
}
