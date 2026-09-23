import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/reveal";
import { GradientText } from "@/components/landing/gradient-text";

// Exemples illustratifs en attendant de vraies success stories élèves — à remplacer.
const STORIES = [
  {
    name: "Thomas M.",
    context: "Ex-commercial en CDI",
    stat: "1er propriétaire en 19 jours",
    detail: "3 biens en gestion 2 mois après le début de la formation",
    description: "A démarché ses 10 premiers propriétaires pendant ses pauses déjeuner, avant de quitter son poste.",
  },
  {
    name: "Nadia B.",
    context: "Maman solo, reconversion",
    stat: "1 240 €/mois",
    detail: "Avec 2 biens, 4 mois après la formation",
    description: "A lancé sa conciergerie en parallèle de la garde de ses enfants, sans expérience en immobilier.",
  },
  {
    name: "Karim & Yasmine",
    context: "Alternance & infirmière",
    stat: "5 biens gérés",
    detail: "7 mois après le début de la formation",
    description: "Karim a quitté son alternance pour reprendre la conciergerie à temps plein ; Yasmine a gardé son poste.",
  },
  {
    name: "Élodie R.",
    context: "Ex-hôtesse de l'air",
    stat: "6 800 €/mois",
    detail: "9 biens gérés, 8 mois après la formation",
    description: "A mis son expérience du service client au service de biens haut de gamme sur la Côte d'Azur.",
  },
  {
    name: "Julien P.",
    context: "Étudiant en école de commerce",
    stat: "1er contrat en 3 semaines",
    detail: "2 biens gérés à la fin du semestre",
    description: "A financé la fin de ses études avec les revenus de sa conciergerie, en parallèle des cours.",
  },
  {
    name: "Sophie D.",
    context: "Ex-comptable, 45 ans",
    stat: "3 900 €/mois",
    detail: "4 biens haut de gamme à Nice, 5 mois après la formation",
    description: "A quitté un poste de comptable après 20 ans pour se consacrer à sa conciergerie premium.",
  },
];

export function SuccessStoriesSection() {
  return (
    <section className="border-t border-border bg-emerald/5">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="outline">Résultats élèves</Badge>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
            Nos <GradientText>success stories</GradientText>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Des profils différents, un même point de départ : zéro. Voici ce que certains de nos élèves ont obtenu
            en appliquant la méthode.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STORIES.map((story) => (
            <RevealItem key={story.name}>
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <p className="font-semibold text-foreground">{story.name}</p>
                <p className="text-xs text-muted-foreground">{story.context}</p>

                <div className="mt-4 flex items-start gap-2 border-t border-border pt-4">
                  <TrendingUp className="mt-0.5 size-4 shrink-0 text-emerald" />
                  <div>
                    <p className="font-semibold text-foreground">{story.stat}</p>
                    <p className="text-xs text-muted-foreground">{story.detail}</p>
                  </div>
                </div>

                <p className="mt-3 flex-1 text-sm text-muted-foreground">{story.description}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">
          Résultats individuels présentés à titre d&apos;exemple. Ils dépendent du marché, du temps investi et de
          l&apos;application de la méthode, et ne constituent pas une promesse de résultat identique.
        </p>
      </div>
    </section>
  );
}
