"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, TrendingUp } from "lucide-react";

interface Story {
  initials: string;
  name: string;
  designation: string;
  quote: string;
  accent: "primary" | "gold" | "emerald";
}

const ACCENT_CARD: Record<Story["accent"], string> = {
  primary: "bg-gradient-to-br from-primary to-primary-light text-primary-foreground",
  gold: "bg-gradient-to-br from-gold to-gold/70 text-gold-foreground",
  emerald: "bg-gradient-to-br from-emerald to-emerald/70 text-emerald-foreground",
};

// Exemples illustratifs en attendant de vraies success stories élèves — à remplacer.
const STORIES: Story[] = [
  {
    initials: "TM",
    name: "Thomas M.",
    designation: "Ex-commercial en CDI · 3 biens gérés",
    quote:
      "Premier propriétaire signé en 19 jours, pendant mes pauses déjeuner — avant même d'avoir quitté mon poste.",
    accent: "primary",
  },
  {
    initials: "NB",
    name: "Nadia B.",
    designation: "Maman solo, reconversion · 1 240 €/mois",
    quote: "J'ai lancé ma conciergerie en parallèle de la garde de mes enfants, sans aucune expérience en immobilier.",
    accent: "gold",
  },
  {
    initials: "K&Y",
    name: "Karim & Yasmine",
    designation: "Alternance & infirmière · 5 biens gérés",
    quote: "J'ai quitté mon alternance pour reprendre la conciergerie à temps plein pendant que Yasmine gardait son poste.",
    accent: "emerald",
  },
  {
    initials: "ER",
    name: "Élodie R.",
    designation: "Ex-hôtesse de l'air · Côte d'Azur",
    quote: "Mon expérience du service client a fait la différence pour signer des biens haut de gamme dès les premiers mois.",
    accent: "primary",
  },
  {
    initials: "JP",
    name: "Julien P.",
    designation: "Étudiant en école de commerce",
    quote: "Premier contrat signé en 3 semaines, en parallèle des cours. J'ai fini mon semestre avec une vraie activité qui tourne.",
    accent: "gold",
  },
  {
    initials: "SD",
    name: "Sophie D.",
    designation: "Ex-comptable, 45 ans · Nice",
    quote: "Après 20 ans en comptabilité, j'ai tout quitté pour ma conciergerie premium. Cinq mois plus tard, les chiffres parlent d'eux-mêmes.",
    accent: "emerald",
  },
];

// Rotations fixes (plutôt que Math.random() au rendu, qui désynchronise SSR et client).
const CARD_ROTATIONS = ["-6deg", "5deg", "-3deg", "7deg", "-5deg", "4deg"];

function cardRotation(index: number) {
  return CARD_ROTATIONS[index % CARD_ROTATIONS.length];
}

export function SuccessStoriesCarousel() {
  const [active, setActive] = useState(0);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % STORIES.length);
  }, []);

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + STORIES.length) % STORIES.length);
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  const isActive = (index: number) => index === active;

  return (
    <div className="mx-auto grid grid-cols-1 max-w-4xl gap-y-12 md:grid-cols-2 md:items-center md:gap-x-16">
      <div className="flex items-center justify-center">
        <div className="relative h-72 w-full max-w-xs sm:h-80">
          <AnimatePresence>
            {STORIES.map((story, index) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, scale: 0.9, y: 50, rotate: cardRotation(index) }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.5,
                  scale: isActive(index) ? 1 : 0.9,
                  y: isActive(index) ? 0 : 20,
                  zIndex: isActive(index) ? STORIES.length : STORIES.length - Math.abs(index - active),
                  rotate: isActive(index) ? "0deg" : cardRotation(index),
                }}
                exit={{ opacity: 0, scale: 0.9, y: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 origin-bottom"
              >
                <div
                  className={`flex size-full flex-col items-center justify-center gap-3 rounded-3xl shadow-2xl ${ACCENT_CARD[story.accent]}`}
                >
                  {isActive(index) && (
                    <>
                      <span className="text-6xl font-extrabold tracking-tight sm:text-7xl">{story.initials}</span>
                      <TrendingUp className="size-5 opacity-70" />
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col justify-center py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h3 className="text-2xl font-bold text-foreground">{STORIES[active].name}</h3>
            <p className="text-sm text-muted-foreground">{STORIES[active].designation}</p>
            <p className="mt-8 text-pretty text-lg text-foreground">
              &laquo;&nbsp;{STORIES[active].quote}&nbsp;&raquo;
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4 pt-12">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Histoire précédente"
            className="group flex size-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent"
          >
            <ArrowLeft className="size-4 text-foreground transition-transform duration-300 group-hover:-translate-x-1" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Histoire suivante"
            className="group flex size-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent"
          >
            <ArrowRight className="size-4 text-foreground transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
