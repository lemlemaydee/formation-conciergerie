import { CreditCard } from "lucide-react";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { PlaceholderSection } from "@/components/dashboard/placeholder-section";

const TIER_LABELS: Record<string, string> = {
  starter: "Starter (0 à 20 biens)",
  croissance: "Croissance (20 à 100 biens)",
  "sur-mesure": "Sur-mesure",
};

export default async function AbonnementPage() {
  const profile = await getCurrentProfile();
  const tierLabel = profile?.tier ? TIER_LABELS[profile.tier] : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Abonnement</h1>
        <p className="mt-1 text-sm text-muted-foreground">Votre palier et vos moyens de paiement.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-semibold text-foreground">Palier actuel</p>
        <p className="mt-2 text-lg font-bold text-primary">{tierLabel ?? "Aucun palier assigné"}</p>
        {!tierLabel && (
          <p className="mt-1 text-xs text-muted-foreground">
            Attribué automatiquement après votre achat, ou manuellement par l&apos;équipe.
          </p>
        )}
      </div>

      <PlaceholderSection
        icon={CreditCard}
        title="Facturation bientôt disponible"
        description="Une fois les paiements Stripe connectés, vous retrouverez ici vos factures et la gestion de votre moyen de paiement."
      />
    </div>
  );
}
