import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RevealGroup, RevealItem } from "@/components/landing/reveal";
import { GradientText } from "@/components/landing/gradient-text";

export function FinalCta() {
  return (
    <section
      className="relative overflow-hidden border-t border-border"
      style={{
        background:
          "radial-gradient(ellipse 420px 220px at 8% 65%, color-mix(in oklch, var(--gold) 28%, transparent), transparent 65%), " +
          "radial-gradient(ellipse 420px 220px at 92% 65%, color-mix(in oklch, var(--primary) 28%, transparent), transparent 65%), " +
          "linear-gradient(to bottom, transparent, transparent 80%, var(--muted) 130%)",
      }}
    >
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
