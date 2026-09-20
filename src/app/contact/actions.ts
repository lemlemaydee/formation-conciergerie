"use server";

import { createClient } from "@/lib/supabase/server";

export interface ContactState {
  error: string | null;
  sent: boolean;
}

export async function sendContactMessage(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const reason = String(formData.get("reason") ?? "contact");

  if (!name || !email || !message) {
    return { error: "Merci de remplir les champs obligatoires.", sent: false };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .insert({ name, email, phone: phone || null, message, reason });

  if (error) {
    return {
      error: "Impossible d'envoyer le message pour le moment. Réessayez plus tard.",
      sent: false,
    };
  }

  return { error: null, sent: true };
}
