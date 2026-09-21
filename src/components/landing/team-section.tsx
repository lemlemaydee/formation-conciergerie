"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import { ArrowRight, Camera, MapPin } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { GradientText } from "@/components/landing/gradient-text";

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
    <section id="equipe" className="scroll-mt-20 overflow-hidden border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative">
            <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/15 via-gold/10 to-transparent blur-2xl" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-muted to-gold/10 shadow-sm sm:aspect-[5/4] lg:aspect-[4/5]">
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-background/80 text-muted-foreground shadow-sm">
                  <Camera className="size-6" />
                </span>
                <p className="text-sm font-medium text-muted-foreground">
                  Photo de Mehdi &amp; Jacques à venir
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                Qui sommes-nous
              </span>
              <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
                <GradientText>Deux opérateurs</GradientText>, pas deux formateurs
              </h2>
              <p className="mt-4 text-base text-foreground">
                Derrière cette formation, deux parcours qui se rejoignent sur le terrain :
                plusieurs années dans l&apos;immobilier de luxe et la conciergerie Airbnb, entre
                Monaco et la Côte d&apos;Azur. Gestion de villas d&apos;exception, clientèle UHNW,
                expérience client premium, opérations du quotidien — nous avons appris en gérant
                nous-mêmes, bien avant d&apos;enseigner.
              </p>
              <p className="mt-4 text-base text-foreground">
                Aujourd&apos;hui, nous gérons ensemble plus de 120 biens, du studio à la villa la
                plus exigeante, et nous transmettons exactement la méthode que nous appliquons
                chaque jour.
              </p>
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                Mehdi &amp; Jacques, fondateurs
              </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center gap-6 border-t border-border pt-6">
              <div>
                <p className="text-3xl font-bold text-primary">
                  <AnimatedCount />
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  biens gérés · Monaco &amp; Côte d&apos;Azur
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Réservez un appel avec nous
                <ArrowRight className="size-3.5" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
