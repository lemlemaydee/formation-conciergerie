import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/reveal";
import { GradientText } from "@/components/landing/gradient-text";

const TESTIMONIALS = [
  {
    name: "Camille R.",
    role: "Conciergerie lancée en 2025",
    quote:
      "La méthode est hyper claire, étape par étape. J'ai signé mon premier propriétaire avant même d'avoir terminé la formation.",
  },
  {
    name: "Yanis B.",
    role: "12 biens en gestion",
    quote:
      "Ce qui change vraiment, c'est la communauté : dès que je bloque sur un sujet, j'ai une réponse en quelques heures.",
  },
  {
    name: "Sarah L.",
    role: "Reconversion professionnelle",
    quote:
      "Les lives du jeudi sont devenus mon rendez-vous préféré de la semaine. On sent que les formateurs sont vraiment sur le terrain.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
            Ils ont lancé <GradientText>leur conciergerie</GradientText>
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <RevealItem key={testimonial.name}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm text-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
