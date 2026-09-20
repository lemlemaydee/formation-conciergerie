import { MessageCircle, Radio, Users } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";

export function CommunityPreview() {
  return (
    <section id="communaute" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Users className="size-3.5" />
              Communauté
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
              Une communauté active, pas un forum qui dort
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Des espaces d&apos;échange par thématique (acquisition,
              opérations, sous-location...) et un live hebdomadaire avec les
              formateurs, en visio avec partage d&apos;écran.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Incluse à vie dès le palier Croissance, ou en abonnement à part.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
            <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-primary/15 via-gold/10 to-transparent blur-2xl" />

            <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-xl">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MessageCircle className="size-4" />
                </span>
                <p className="text-sm font-semibold text-foreground">
                  # acquisition-clients
                </p>
              </div>

              {[
                {
                  name: "Inès",
                  message: "Quelqu'un a un modèle de message pour démarcher les propriétaires ?",
                },
                {
                  name: "Marc",
                  message: "Oui ! Je te l'envoie, ça m'a bien aidé au démarrage 👍",
                },
              ].map((msg) => (
                <div key={msg.name} className="flex gap-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                    {msg.name.charAt(0)}
                  </span>
                  <div className="rounded-xl bg-muted/60 px-3 py-2 text-sm text-foreground">
                    {msg.message}
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-primary-foreground">
                <Radio className="size-4 animate-pulse" />
                <p className="text-xs font-medium">
                  Live en cours — Q&amp;A Acquisition clients
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
