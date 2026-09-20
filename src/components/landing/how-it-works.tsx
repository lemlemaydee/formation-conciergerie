import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HowItWorksCards, type HowItWorksStep } from "@/components/ui/how-it-works-cards";
import { Reveal } from "@/components/landing/reveal";

const COLORS = {
  primary: { bg: "bg-primary/8", text: "text-primary", border: "border-primary/20" },
  gold: { bg: "bg-gold/10", text: "text-gold", border: "border-gold/25" },
  emerald: { bg: "bg-emerald/10", text: "text-emerald", border: "border-emerald/25" },
};

const STEPS: HowItWorksStep[] = [
  {
    title: "Choisissez votre palier",
    description:
      "0 à 20 biens, 20 à 100, ou sur-mesure au-delà : le contenu s'adapte à l'échelle de votre activité.",
    colors: COLORS.primary,
  },
  {
    title: "Votre compte est créé",
    description:
      "Dès le paiement validé, l'accès à votre dashboard est activé automatiquement — aucune attente.",
    colors: COLORS.gold,
  },
  {
    title: "Vous suivez les vidéos",
    description:
      "Toutes les leçons sont classées par catégorie, avec une coche de progression à chaque étape.",
    colors: COLORS.emerald,
  },
  {
    title: "Vous rejoignez les lives",
    description:
      "Chaque semaine, un appel en direct avec les formateurs pour poser vos questions et débloquer les points durs.",
    colors: COLORS.primary,
  },
  {
    title: "Vous suivez votre évolution",
    description:
      "Une barre de progression claire sur tout le programme, pour rester motivé jusqu'au bout.",
    colors: COLORS.gold,
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                Le parcours
              </span>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
                Comment ça marche
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                De l&apos;achat de votre formule à votre premier propriétaire, chaque étape est
                pensée pour vous faire gagner du temps.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Pas d&apos;attente administrative, pas de contenu générique : un parcours concret,
                que vous pouvez commencer dans la minute qui suit votre paiement.
              </p>
              <Button
                render={<Link href="/formation" />}
                nativeButton={false}
                size="lg"
                className="mt-8"
              >
                Voir les formules
                <ArrowRight className="size-4" />
              </Button>
            </Reveal>
          </div>

          <HowItWorksCards steps={STEPS} />
        </div>
      </div>
    </section>
  );
}
