import { Clock, Compass, Users } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/reveal";
import { GradientText } from "@/components/landing/gradient-text";

const PAIN_POINTS = [
  {
    icon: Clock,
    title: "Ça prend un temps fou",
    description:
      "Messages voyageurs, ménages, tarifs à ajuster : sans méthode, la conciergerie dévore vos journées au lieu de vous libérer.",
    accent: "bg-primary/10 text-primary",
  },
  {
    icon: Compass,
    title: "Aucune méthode claire",
    description:
      "Trouver des propriétaires, fixer ses prix, structurer son offre : on apprend à ses dépens, en perdant des mois.",
    accent: "bg-gold/15 text-gold",
  },
  {
    icon: Users,
    title: "On avance seul",
    description:
      "Pas de communauté, pas de retours d'expérience : chaque problème devient plus long à résoudre.",
    accent: "bg-emerald/10 text-emerald",
  },
];

export function ProblemSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
            Gérer seul sa conciergerie, <GradientText>ça plafonne vite</GradientText>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            La plupart des conciergeries Airbnb stagnent pour les mêmes
            raisons.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PAIN_POINTS.map((point) => (
            <RevealItem key={point.title}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div
                  className={`flex size-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105 ${point.accent}`}
                >
                  <point.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {point.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
