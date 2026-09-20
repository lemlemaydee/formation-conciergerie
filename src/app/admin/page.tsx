import { Users, TrendingUp, GraduationCap, Radio } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/stat-card";

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const { count: clientCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "student");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Vue d&apos;ensemble</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Les chiffres marqués d&apos;un * sont des exemples, en attente des paiements Stripe.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Clients inscrits" value={String(clientCount ?? 0)} hint="Donnée réelle" />
        <StatCard icon={TrendingUp} label="CA du mois*" value="0 €" hint="Stripe non connecté" />
        <StatCard icon={GraduationCap} label="Taux de complétion*" value="—" hint="Aucun contenu chargé" />
        <StatCard icon={Radio} label="Prochain live" value="Jeudi 18h" hint="Exemple" />
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground">
        Ce tableau de bord se remplira automatiquement au fur et à mesure que les paiements, le contenu et les
        lives seront connectés.
      </div>
    </div>
  );
}
