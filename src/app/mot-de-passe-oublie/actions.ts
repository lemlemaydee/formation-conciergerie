"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { translateAuthError } from "@/lib/auth-errors";

export interface ResetState {
  error: string | null;
  sent: boolean;
}

export async function requestPasswordReset(
  _prevState: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const email = String(formData.get("email") ?? "");
  const origin = (await headers()).get("origin");

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/dashboard/mon-compte`,
  });

  if (error) {
    return { error: translateAuthError(error.message), sent: false };
  }

  return { error: null, sent: true };
}
