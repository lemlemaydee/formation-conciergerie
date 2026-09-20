import { createClient } from "@/lib/supabase/server";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: "student" | "admin";
  tier: "starter" | "croissance" | "sur-mesure" | null;
  created_at: string;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return (data as Profile) ?? null;
}
