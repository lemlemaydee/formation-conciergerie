import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Prêt à lancer votre conciergerie Airbnb ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
            Choisissez votre palier et accédez immédiatement à votre dashboard.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              render={<Link href="/formation" />}
              nativeButton={false}
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Voir les formules
            </Button>
            <Button
              render={<Link href="/contact" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
            >
              Parler à un conseiller
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
