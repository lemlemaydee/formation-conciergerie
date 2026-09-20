import { Tag } from "lucide-react";
import { PlaceholderSection } from "@/components/dashboard/placeholder-section";

const TIERS = [
  { name: "Starter", range: "0 à 20 biens", price: "699 €" },
  { name: "Croissance", range: "20 à 100 biens", price: "1 499 €" },
  { name: "Sur-mesure", range: "100+ biens / villa de luxe", price: "Sur devis" },
];

export default function AdminOffresPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Offres</h1>
        <p className="mt-1 text-sm text-muted-foreground">Paliers, prix et codes promo.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {TIERS.map((tier) => (
          <div key={tier.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold text-foreground">{tier.name}</p>
            <p className="text-xs text-muted-foreground">{tier.range}</p>
            <p className="mt-3 text-xl font-bold text-primary">{tier.price}</p>
          </div>
        ))}
      </div>

      <PlaceholderSection
        icon={Tag}
        title="Édition des prix à venir"
        description="La modification des tarifs et la création de codes promo seront connectées à Stripe dans une prochaine étape."
      />
    </div>
  );
}
