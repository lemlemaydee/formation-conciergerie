"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/reveal";

const FOUNDERS = [
  {
    initials: "MH",
    name: "Mehdi",
    role: "Cofondateur",
    bio: "Depuis deux ans dans l'immobilier de luxe autour de Monaco : gestion de villas, clientèle UHNW, expérience client premium et conciergerie Airbnb.",
    accent: "primary" as const,
  },
  {
    initials: "JQ",
    name: "Jacques",
    role: "Cofondateur",
    bio: "À la tête de la conciergerie Airbnb Côte d'Azur : du studio à la villa, l'opérationnel au quotidien.",
    accent: "gold" as const,
  },
];

function AnimatedCount() {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1000;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(120 * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(tick);
    }
    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  return <span ref={ref}>{value}+</span>;
}

export function TeamSection() {
  return (
    <section id="equipe" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            Qui sommes-nous
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Deux opérateurs actifs, pas des formateurs qui ont arrêté de
            pratiquer.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2">
          {FOUNDERS.map((founder) => (
            <RevealItem key={founder.name}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8">
                <div
                  className={`flex size-14 items-center justify-center rounded-full text-lg font-bold transition-transform duration-300 group-hover:scale-105 ${
                    founder.accent === "primary"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gold text-gold-foreground"
                  }`}
                >
                  {founder.initials}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {founder.name}
                </h3>
                <p className="text-sm text-muted-foreground">{founder.role}</p>
                <p className="mt-4 text-sm text-foreground">{founder.bio}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.15} className="mt-8">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-muted/40 px-6 py-8 text-center sm:flex-row sm:justify-center sm:gap-8 sm:text-left">
            <p className="text-4xl font-bold text-primary sm:text-5xl">
              <AnimatedCount />
            </p>
            <div>
              <p className="text-sm font-semibold text-foreground">
                biens gérés ensemble aujourd&apos;hui
              </p>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <MapPin className="size-3.5" />
                Monaco &amp; Côte d&apos;Azur — du studio à la villa
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-6 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Envie d&apos;en discuter directement ? Réservez un appel
            <ArrowRight className="size-3.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
