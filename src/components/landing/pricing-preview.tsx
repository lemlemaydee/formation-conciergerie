import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/reveal";
import { GradientText } from "@/components/landing/gradient-text";
import { createClient } from "@/lib/supabase/server";

interface Tier {
  slug: string;
  name: string;
  range: string;
  price: string;
  period: string;
  features: string[];
  featured: boolean;
}

const FALLBACK_TIERS: Tier[] = [
  {
    slug: "starter",
    name: "Starter",
    range: "0 à 20 biens",
    price: "699 €",
    period: "paiement unique",
    features: ["Formation complète", "Accès au dashboard", "Ressources téléchargeables"],
    featured: false,
  },
  {
    slug: "croissance",
    name: "Croissance",
    range: "20 à 100 biens",
    price: "1 499 €",
    period: "paiement unique",
    features: ["Tout Starter", "Communauté offerte à vie", "Accès aux lives hebdomadaires"],
    featured: true,
  },
  {
    slug: "sur-mesure",
    name: "Sur-mesure",
    range: "100+ biens ou villa de luxe",
    price: "Sur demande",
    period: "accompagnement personnalisé",
    features: ["Audit personnalisé", "Accompagnement dédié", "Tout inclus"],
    featured: false,
  },
];

async function getTiers(): Promise<Tier[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("offers").select("*").order("order_index");

  if (error || !data || data.length === 0) return FALLBACK_TIERS;

  return data.map((offer) => ({
    slug: offer.slug,
    name: offer.name,
    range: offer.properties_range,
    price: offer.price_label,
    period: offer.price_period,
    features: offer.features ?? [],
    featured: offer.is_featured,
  }));
}

export async function PricingPreview() {
  const tiers = await getTiers();

  return (
    <section id="tarifs" className="scroll-mt-20 border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
            Un palier pour <GradientText>chaque étape</GradientText>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Le prix dépend du nombre de biens que vous gérez déjà.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => {
            const href = tier.slug === "sur-mesure" ? "/contact" : "/formation";
            return (
              <RevealItem key={tier.slug} className="h-full">
                <div
                  className={`relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 sm:p-8 ${
                    tier.featured
                      ? "border-primary bg-card shadow-lg ring-1 ring-primary hover:shadow-xl"
                      : "border-border bg-card shadow-sm hover:shadow-lg"
                  }`}
                >
                  {tier.featured && <Badge className="absolute -top-3 left-6">Le plus choisi</Badge>}
                  <h3 className="text-base font-semibold text-foreground">{tier.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{tier.range}</p>

                  <div className="mt-5">
                    <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{tier.period}</p>

                  <ul className="mt-6 flex-1 space-y-2.5">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-emerald" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    render={<Link href={href} />}
                    nativeButton={false}
                    size="lg"
                    variant={tier.featured ? "default" : "outline"}
                    className="mt-8 w-full"
                  >
                    {tier.slug === "sur-mesure" ? "Réserver un appel" : "Choisir ce palier"}
                  </Button>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {/* [À VALIDER] Durée et conditions à confirmer avec Mehdi/Jacques avant mise en ligne (impact CGV/remboursement). */}
        <Reveal className="mx-auto mt-10 flex max-w-md flex-col items-center gap-1.5 rounded-2xl border border-emerald/20 bg-emerald/5 px-6 py-4 text-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald">
            <ShieldCheck className="size-4" />
            Garantie 14 jours, satisfait ou remboursé
          </div>
          <p className="text-xs text-muted-foreground">
            Si la formation ne vous convient pas, écrivez-nous dans les 14 jours suivant votre achat.
          </p>
        </Reveal>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Module complémentaire &laquo;&nbsp;Sous-location&nbsp;&raquo; disponible en option (+299&nbsp;€) ·{" "}
          <Link href="/formation" className="font-medium text-primary underline-offset-4 hover:underline">
            Voir le détail complet
          </Link>
        </p>
      </div>
    </section>
  );
}
