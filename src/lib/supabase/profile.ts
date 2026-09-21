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

// Chaque Server Action admin doit ré-vérifier le rôle elle-même : un
// redirect au niveau de la page (admin/layout.tsx) ne protège pas les
// actions, qui restent appelables directement (voir doc Next.js sur la
// sécurité des Server Actions). RLS bloque aussi côté base en dernier
// recours, mais on veut un message clair avant d'y arriver.
export async function requireAdmin(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    throw new Error("Accès refusé : réservé aux administrateurs.");
  }
  return profile;
}
