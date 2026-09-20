import {
  BookOpen,
  Users2,
  SprayCan,
  Workflow,
  TrendingUp,
  KeyRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/reveal";

const MODULES = [
  {
    icon: BookOpen,
    title: "Fondamentaux",
    description:
      "Statut juridique, positionnement, structurer une offre de conciergerie qui tient la route dès le premier bien.",
    accent: "primary" as const,
  },
  {
    icon: Users2,
    title: "Acquisition de propriétaires",
    description:
      "Trouver et convaincre vos premiers propriétaires, du studio à la villa haut de gamme.",
    accent: "gold" as const,
  },
  {
    icon: SprayCan,
    title: "Opérations & ménage",
    description:
      "Organiser le ménage, la maintenance et les check-in/check-out sans y passer vos journées.",
    accent: "emerald" as const,
  },
  {
    icon: Workflow,
    title: "Outils & automatisation",
    description:
      "Channel manager, messagerie automatisée, tarification dynamique : les outils qu'on utilise vraiment.",
    accent: "primary" as const,
  },
  {
    icon: TrendingUp,
    title: "Scaling & équipe",
    description:
      "Passer de quelques biens à une vraie structure : déléguer, recruter, garder la qualité de service.",
    accent: "gold" as const,
  },
  {
    icon: KeyRound,
    title: "Sous-location",
    description:
      "Module complémentaire : la stratégie de sous-location, ses risques et son cadre légal.",
    accent: "emerald" as const,
    optional: true,
  },
];

const ACCENT_STYLES = {
  primary: "bg-primary/10 text-primary",
  gold: "bg-gold/15 text-gold-foreground",
  emerald: "bg-emerald/10 text-emerald",
};

export function ProgrammeSection() {
  return (
    <section id="programme" className="scroll-mt-20 border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            Le programme
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Une méthode structurée par étapes, directement issue de notre
            propre activité de conciergerie.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((module) => (
            <RevealItem key={module.title}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div
                    className={`flex size-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105 ${ACCENT_STYLES[module.accent]}`}
                  >
                    <module.icon className="size-5" />
                  </div>
                  {module.optional && (
                    <Badge variant="secondary" className="text-xs">
                      +299&nbsp;€ en option
                    </Badge>
                  )}
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {module.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
