import { getCurrentProfile } from "@/lib/supabase/profile";
import { AccountForms } from "./account-forms";

export default async function MonComptePage() {
  const profile = await getCurrentProfile();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mon compte</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gérez vos informations personnelles.</p>
      </div>

      <AccountForms email={profile?.email ?? ""} fullName={profile?.full_name ?? ""} />
    </div>
  );
}
