import { Reveal, RevealGroup, RevealItem } from "@/components/landing/reveal";

const STEPS = [
  {
    number: "01",
    title: "Choisissez votre palier",
    description: "Selon le nombre de biens que vous gérez déjà, de 0 à plus de 100.",
  },
  {
    number: "02",
    title: "Accédez à votre dashboard",
    description: "Votre compte est créé automatiquement dès l'achat.",
  },
  {
    number: "03",
    title: "Suivez les vidéos et les lives",
    description: "À votre rythme, avec des sessions hebdomadaires en direct.",
  },
  {
    number: "04",
    title: "Rejoignez la communauté",
    description: "Échangez, trouvez des réponses et avancez plus vite.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            Comment ça marche
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step, index) => (
            <RevealItem key={step.number} className="relative">
              <div className="flex items-center gap-3 lg:block">
                <span className="text-3xl font-bold text-primary/25 sm:text-4xl">
                  {step.number}
                </span>
                <h3 className="text-base font-semibold text-foreground lg:mt-3">
                  {step.title}
                </h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-4 right-0 hidden h-px w-6 -translate-y-1/2 translate-x-full bg-border lg:block"
                />
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
