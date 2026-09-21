import { Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { PlaceholderSection } from "@/components/dashboard/placeholder-section";

export default async function AdminOffresPage() {
  const supabase = await createClient();
  const [{ data: offers }, { data: addons }] = await Promise.all([
    supabase.from("offers").select("*").order("order_index"),
    supabase.from("addons").select("*"),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Offres</h1>
        <p className="mt-1 text-sm text-muted-foreground">Paliers, prix et modules complémentaires.</p>
      </div>

      {!offers || offers.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
          Aucune offre pour le moment — exécute la migration 0006_offers.sql.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {offers.map((offer) => (
            <div key={offer.id} className="relative rounded-2xl border border-border bg-card p-5 shadow-sm">
              {offer.is_featured && <Badge className="absolute -top-2.5 left-5">Mis en avant</Badge>}
              <p className="text-sm font-semibold text-foreground">{offer.name}</p>
              <p className="text-xs text-muted-foreground">{offer.properties_range}</p>
              <p className="mt-3 text-xl font-bold text-primary">{offer.price_label}</p>
              <p className="text-xs text-muted-foreground">{offer.price_period}</p>
              <ul className="mt-3 space-y-1">
                {offer.features.map((f: string) => (
                  <li key={f} className="text-xs text-muted-foreground">
                    · {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {addons && addons.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-foreground">Modules complémentaires</p>
          {addons.map((addon) => (
            <div key={addon.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{addon.name}</span>
              <span className="font-medium text-primary">{addon.price_label}</span>
            </div>
          ))}
        </div>
      )}

      <PlaceholderSection
        icon={Tag}
        title="Édition en ligne à venir"
        description="Les prix ci-dessus viennent de la table Supabase `offers` — les modifier directement dans Supabase les met à jour partout (site + admin). Un formulaire d'édition ici arrivera avec la connexion Stripe."
      />
    </div>
  );
}
