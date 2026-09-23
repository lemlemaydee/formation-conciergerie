import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/landing/reveal";
import { GradientText } from "@/components/landing/gradient-text";
import { SuccessStoriesCarousel } from "@/components/landing/success-stories-carousel";

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

        <Reveal delay={0.1} className="mt-4">
          <SuccessStoriesCarousel />
        </Reveal>

        <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-muted-foreground">
          Résultats individuels présentés à titre d&apos;exemple. Ils dépendent du marché, du temps investi et de
          l&apos;application de la méthode, et ne constituent pas une promesse de résultat identique.
        </p>
      </div>
    </section>
  );
}
