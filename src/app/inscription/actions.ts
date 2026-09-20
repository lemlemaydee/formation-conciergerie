"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { translateAuthError } from "@/lib/auth-errors";

export interface SignupState {
  error: string | null;
  emailSent: boolean;
}

export async function signup(_prevState: SignupState, formData: FormData): Promise<SignupState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return { error: translateAuthError(error.message), emailSent: false };
  }

  if (!data.session) {
    // Confirmation email required before a session is issued.
    return { error: null, emailSent: true };
  }

  redirect("/dashboard");
}
