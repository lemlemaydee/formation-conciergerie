import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RevealGroup, RevealItem } from "@/components/landing/reveal";
import { GradientText } from "@/components/landing/gradient-text";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-72 bg-gradient-to-t from-primary/20 via-gold/10 to-transparent blur-3xl"
      />

      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
        <RevealGroup className="flex flex-col items-center gap-6 text-center sm:gap-8">
          <RevealItem>
            <Badge variant="outline">Accès immédiat après paiement</Badge>
          </RevealItem>

          <RevealItem>
            <h2 className="text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-5xl">
              Prêt à lancer votre <GradientText>conciergerie Airbnb</GradientText> ?
            </h2>
          </RevealItem>

          <RevealItem>
            <p className="max-w-xl text-lg text-pretty text-muted-foreground">
              Choisissez votre palier et accédez immédiatement à votre dashboard.
            </p>
          </RevealItem>

          <RevealItem className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Button render={<Link href="/formation" />} nativeButton={false} size="lg" className="w-full sm:w-auto">
              Voir les formules
            </Button>
            <Button
              render={<Link href="/contact" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Réserver un appel
            </Button>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
