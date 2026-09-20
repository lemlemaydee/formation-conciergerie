import Link from "next/link";
import { ArrowRight, GraduationCap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const OFFERS = [
  {
    icon: GraduationCap,
    title: "Formation",
    description:
      "Apprenez à lancer et scaler votre propre conciergerie Airbnb : méthode complète, communauté et lives hebdomadaires avec les formateurs.",
    bullets: [
      "Vidéos par catégories, à votre rythme",
      "Communauté d'entraide intégrée",
      "Sessions live chaque semaine",
    ],
    cta: "Voir les formules",
    href: "/formation",
    featured: true,
  },
  {
    icon: Sparkles,
    title: "Conciergerie déléguée",
    description:
      "Vous préférez ne rien gérer vous-même ? Notre équipe s'occupe de tout, de l'annonce jusqu'au ménage — y compris pour les villas de luxe.",
    bullets: [
      "Gestion complète multi-plateformes",
      "Communication voyageurs 24/7",
      "Conciergerie villa de luxe sur demande",
    ],
    cta: "Découvrir nos services",
    href: "/services",
    featured: false,
  },
];

export function SolutionSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            Deux façons d&apos;avancer
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Apprenez à le faire vous-même, ou confiez-nous la gestion.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {OFFERS.map((offer) => (
            <div
              key={offer.title}
              className={`flex flex-col rounded-2xl border p-6 sm:p-8 ${
                offer.featured
                  ? "border-primary/20 bg-primary text-primary-foreground shadow-lg"
                  : "border-border bg-card shadow-sm"
              }`}
            >
              <div
                className={`flex size-11 items-center justify-center rounded-lg ${
                  offer.featured
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <offer.icon className="size-5" />
              </div>

              <h3 className="mt-5 text-xl font-semibold">{offer.title}</h3>
              <p
                className={`mt-3 text-sm ${
                  offer.featured ? "text-primary-foreground/85" : "text-muted-foreground"
                }`}
              >
                {offer.description}
              </p>

              <ul className="mt-6 space-y-2.5">
                {offer.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className={`flex items-start gap-2 text-sm ${
                      offer.featured ? "text-primary-foreground/90" : "text-foreground"
                    }`}
                  >
                    <span
                      className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                        offer.featured ? "bg-primary-foreground" : "bg-primary"
                      }`}
                    />
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  render={<Link href={offer.href} />}
                  nativeButton={false}
                  size="lg"
                  variant={offer.featured ? "secondary" : "default"}
                  className="w-full sm:w-auto"
                >
                  {offer.cta}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
