import { RevealGroup, RevealItem } from "@/components/landing/reveal";

interface Story {
  initials: string;
  name: string;
  context: string;
  result: string;
  description: string;
  accent: "primary" | "gold" | "emerald";
}

const ACCENT_BG: Record<Story["accent"], string> = {
  primary: "bg-primary text-primary-foreground",
  gold: "bg-gold text-gold-foreground",
  emerald: "bg-emerald text-emerald-foreground",
};

// Exemples illustratifs en attendant de vraies success stories élèves — à remplacer.
const STORIES: Story[] = [
  {
    initials: "M",
    name: "Marion",
    context: "Ex-assistante RH",
    result: "+12 logements en gestion en 4 mois",
    description: "Elle a démarché ses premiers propriétaires en parallèle de son poste, avant de se mettre à son compte à temps plein.",
    accent: "primary",
  },
  {
    initials: "K",
    name: "Kevin",
    context: "24 ans, apprenti électricien",
    result: "3 villas haut de gamme en 5 mois",
    description: "Un gros travail de prospection locale, puis le bouche-à-oreille lui a apporté ses clients suivants.",
    accent: "gold",
  },
  {
    initials: "I",
    name: "Inès",
    context: "Étudiante en BTS Tourisme",
    result: "5 biens signés en 4 mois",
    description: "Sans aucune expérience en immobilier, grâce à une présence en ligne travaillée dès le premier mois.",
    accent: "emerald",
  },
  {
    initials: "B",
    name: "Baptiste",
    context: "Ex-commercial en CDI",
    result: "2 Airbnb le 1er mois, 4 de plus le suivant",
    description: "Il a ensuite recruté une équipe de ménage dédiée et gère aujourd'hui des biens jusqu'à 8 chambres.",
    accent: "primary",
  },
];

export function SuccessGrid() {
  return (
    <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {STORIES.map((story) => (
        <RevealItem key={story.name}>
          <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center gap-3">
              <span
                className={`flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold ${ACCENT_BG[story.accent]}`}
              >
                {story.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">{story.name}</p>
                <p className="truncate text-xs text-muted-foreground">{story.context}</p>
              </div>
            </div>
            <p className="mt-4 text-lg font-bold text-balance text-primary">{story.result}</p>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{story.description}</p>
          </article>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
