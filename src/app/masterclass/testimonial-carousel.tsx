import { Quote } from "lucide-react";

interface Testimonial {
  initials: string;
  name: string;
  context: string;
  quote: string;
}

// Exemples illustratifs en attendant de vrais témoignages élèves — à remplacer.
const TESTIMONIALS: Testimonial[] = [
  {
    initials: "S",
    name: "Sofia",
    context: "Ex-agent immobilier",
    quote: "J'ai enfin une méthode claire pour approcher un propriétaire, au lieu d'improviser à chaque rendez-vous.",
  },
  {
    initials: "T",
    name: "Thomas",
    context: "Salarié, reconversion en cours",
    quote: "La partie sur le cadre légal m'a évité de me lancer avec un contrat bancal dès le premier bien.",
  },
  {
    initials: "L",
    name: "Léa",
    context: "Ancienne hôtesse d'accueil",
    quote: "Ce qui m'a débloquée, c'est de voir comment structurer une offre qui rassure un propriétaire exigeant.",
  },
  {
    initials: "R",
    name: "Rayan",
    context: "Étudiant en école de commerce",
    quote: "Je pensais qu'il fallait déjà avoir de l'expérience — la méthode m'a montré par où commencer concrètement.",
  },
];

export function TestimonialCarousel() {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {TESTIMONIALS.map((t) => (
        <article
          key={t.name}
          className="w-[260px] shrink-0 snap-start rounded-2xl border border-border bg-card p-6 shadow-sm sm:w-[280px]"
        >
          <Quote className="size-6 text-primary/70" />
          <p className="mt-3 text-sm text-foreground/90">&laquo; {t.quote} &raquo;</p>
          <div className="mt-5 flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {t.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
              <p className="truncate text-xs text-muted-foreground">{t.context}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
