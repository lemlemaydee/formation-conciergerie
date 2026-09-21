import Link from "next/link";
import {
  BookOpen,
  Users2,
  SprayCan,
  Workflow,
  TrendingUp,
  KeyRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/landing/reveal";
import { GradientText } from "@/components/landing/gradient-text";

const ACCENT_STYLES = {
  primary: "bg-primary/10 text-primary",
  gold: "bg-gold/15 text-gold",
  emerald: "bg-emerald/10 text-emerald",
};

const DOT_STYLES = {
  primary: "bg-primary",
  gold: "bg-gold",
  emerald: "bg-emerald",
};

const MODULES = [
  {
    icon: BookOpen,
    title: "Fondamentaux",
    description: "Poser des bases solides avant de prendre votre premier bien.",
    accent: "primary" as const,
    lessons: [
      "Choisir son statut juridique et se lancer sereinement",
      "Structurer une offre de conciergerie claire et crédible",
      "Comprendre les bases de la fiscalité de la location courte durée",
      "Poser les fondations d'une activité qui dure",
    ],
  },
  {
    icon: Users2,
    title: "Acquisition de propriétaires",
    description: "Trouver et convaincre vos premiers propriétaires, du studio à la villa.",
    accent: "gold" as const,
    lessons: [
      "Identifier et démarcher ses premiers propriétaires",
      "Le script de démarchage qui fonctionne vraiment",
      "Convaincre sur le prix sans brader son offre",
      "Construire une réputation qui génère du bouche-à-oreille",
    ],
  },
  {
    icon: SprayCan,
    title: "Opérations & ménage",
    description: "Organiser le quotidien sans y passer vos journées.",
    accent: "emerald" as const,
    lessons: [
      "Organiser le ménage et la blanchisserie",
      "Check-in / check-out fluide pour les voyageurs",
      "Gérer la maintenance et les imprévus",
      "Mettre en place des standards de qualité reproductibles",
    ],
  },
  {
    icon: Workflow,
    title: "Outils & automatisation",
    description: "Les outils qu'on utilise vraiment, au quotidien.",
    accent: "primary" as const,
    lessons: [
      "Choisir son channel manager (Airbnb, Booking, Abritel)",
      "Automatiser la messagerie voyageurs",
      "Mettre en place la tarification dynamique",
      "Centraliser son reporting propriétaire",
    ],
  },
  {
    icon: TrendingUp,
    title: "Scaling & équipe",
    description: "Passer de quelques biens à une vraie structure.",
    accent: "gold" as const,
    lessons: [
      "Passer de quelques biens à une vraie structure",
      "Recruter et déléguer sans perdre en qualité",
      "Structurer ses process pour scaler sereinement",
      "Piloter son activité avec les bons indicateurs",
    ],
  },
  {
    icon: KeyRound,
    title: "Sous-location",
    description: "Module complémentaire, disponible en option.",
    accent: "emerald" as const,
    optional: true,
    lessons: [
      "Comprendre le cadre légal de la sous-location",
      "Construire une stratégie de sous-location rentable",
      "Éviter les pièges juridiques et les risques",
      "Gérer la relation avec le propriétaire principal",
    ],
  },
];

export function ProgrammeSection() {
  return (
    <section id="programme" className="scroll-mt-20 border-t border-border bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
            <GradientText>Le programme</GradientText>, en détail
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Une méthode structurée par étapes, directement issue de notre propre activité de
            conciergerie. Ouvrez chaque module pour voir exactement ce que vous allez apprendre.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion className="mt-12 w-full space-y-3">
            {MODULES.map((module) => (
              <AccordionItem
                key={module.title}
                value={module.title}
                className="rounded-2xl border border-border bg-card px-5 shadow-sm not-last:border-b"
              >
                <AccordionTrigger className="py-5 hover:no-underline">
                  <div className="flex flex-1 items-center gap-4 text-left">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${ACCENT_STYLES[module.accent]}`}
                    >
                      <module.icon className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-foreground">
                          {module.title}
                        </span>
                        {module.optional && (
                          <Badge variant="secondary" className="text-xs">
                            +299&nbsp;€ en option
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="ml-14 space-y-2.5 pb-2">
                    {module.lessons.map((lesson) => (
                      <li key={lesson} className="flex items-start gap-2.5 text-sm text-foreground">
                        <span
                          className={`mt-1.5 size-1.5 shrink-0 rounded-full ${DOT_STYLES[module.accent]}`}
                        />
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={0.15} className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Une question sur un module en particulier ?{" "}
            <Link
              href="/contact"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Réservez un appel
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
