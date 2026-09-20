"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "500+", label: "élèves accompagnés" },
  { value: "10 000+", label: "biens gérés par la communauté" },
  { value: "4,8/5", label: "note moyenne" },
];

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none"
    >
      <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-2xl" />

      <div className="rounded-2xl border border-border bg-card p-5 shadow-xl sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Ma progression</p>
          <span className="text-sm font-semibold text-primary">68 %</span>
        </div>
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "68%" }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="h-full rounded-full bg-primary"
          />
        </div>

        <ul className="mb-6 space-y-3">
          {[
            "Fondamentaux de la conciergerie",
            "Acquisition de propriétaires",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-foreground">
              <CheckCircle2 className="size-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
          <li className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-4 shrink-0 rounded-full border-2 border-muted-foreground/40" />
            Outils & automatisation
          </li>
        </ul>

        <div className="rounded-xl bg-muted/60 p-3">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Prochain live
          </p>
          <p className="text-sm font-semibold text-foreground">
            Q&amp;A acquisition clients — Jeudi 18h
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="absolute -bottom-5 -left-5 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-lg sm:-left-8"
      >
        <div className="flex text-primary">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-3.5 fill-current" />
          ))}
        </div>
        <span className="text-xs font-medium text-foreground">4,8/5</span>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-8 lg:py-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            Formation & conciergerie Airbnb
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            Lancez et scalez votre conciergerie Airbnb, pas à pas
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted-foreground lg:mx-0">
            La méthode, les outils et la communauté pour transformer la
            gestion locative courte durée en activité rentable — que vous
            gériez 0 ou 100 biens.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button
              render={<Link href="/formation" />}
              nativeButton={false}
              size="lg"
              className="w-full sm:w-auto"
            >
              Voir les formules
            </Button>
            <Button
              render={<Link href="/services" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Découvrir la conciergerie déléguée
            </Button>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-xl font-bold text-foreground sm:text-2xl">
                  {stat.value}
                </dd>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </motion.div>

        <HeroVisual />
      </div>
    </section>
  );
}
