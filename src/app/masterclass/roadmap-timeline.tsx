"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step {
  title: string;
  description: string;
  action: string;
}

// Adapté de notre vrai programme (7 catégories), condensé à 5 étapes pour
// une lecture rapide en page de vente.
const STEPS: Step[] = [
  {
    title: "Choisis ton marché et ton positionnement",
    description:
      "Avant de démarcher qui que ce soit, sache exactement quel type de bien et quel propriétaire tu veux servir.",
    action:
      "Identifie 3 zones où la demande Airbnb est déjà forte, et définis le profil de propriétaire que tu veux convaincre en premier.",
  },
  {
    title: "Sécurise le cadre légal et fiscal",
    description: "Un propriétaire ne te confie pas son bien si le cadre n'est pas clair — statut, contrat, déclaration.",
    action: "Prépare ton contrat de mandat et vérifie la réglementation de ta commune avant ton premier rendez-vous.",
  },
  {
    title: "Construis une offre qui rassure",
    description: "Un tarif clair, et des services qui vont au-delà de la simple gestion d'annonce.",
    action: "Rédige ton offre sur une page : ce que tu gères, ce que ça coûte, ce que le propriétaire n'a plus à faire.",
  },
  {
    title: "Signe ton premier propriétaire",
    description: "La partie que tout le monde redoute — et qui devient simple avec la bonne méthode.",
    action: "Vise toujours l'appel ou le rendez-vous en personne : un message seul ne convainc presque jamais un propriétaire.",
  },
  {
    title: "Livre une expérience qui se recommande",
    description:
      "Un voyageur satisfait laisse un bon avis, un propriétaire satisfait te recommande — chaque bien géré devient ton meilleur commercial.",
    action: "Mets en place tes process de ménage et de suivi avant de chercher un deuxième bien, pas après.",
  },
];

const GLOW = { boxShadow: "0 0 24px color-mix(in oklch, var(--primary) 55%, transparent)" };

export function RoadmapTimeline() {
  return (
    <div className="mx-auto max-w-3xl">
      {STEPS.map((step, i) => (
        <div key={step.title} className="relative flex gap-5 sm:gap-6">
          <div className="relative flex w-11 shrink-0 flex-col items-center">
            <motion.div
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground"
              style={GLOW}
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-80px 0px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {i + 1}
            </motion.div>
            <div className="relative mt-1 w-0.5 flex-1 bg-border">
              <motion.div
                className="absolute inset-x-0 top-0 origin-top bg-primary"
                style={{ height: "100%" }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-80px 0px" }}
                transition={{ duration: 0.7, ease: "easeInOut", delay: 0.15 }}
              />
            </div>
          </div>
          <motion.div
            className="flex-1 pb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px 0px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-bold text-foreground sm:text-xl">{step.title}</h3>
            <p className="mt-2 text-muted-foreground">{step.description}</p>
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
              <span className="font-semibold text-primary">Ton action : </span>
              <span className="text-foreground">{step.action}</span>
            </div>
          </motion.div>
        </div>
      ))}

      <div className="relative flex gap-5 sm:gap-6">
        <div className="flex w-11 shrink-0 justify-center">
          <motion.div
            className="size-3 rounded-full bg-primary"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-80px 0px" }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <motion.p
          className="flex-1 font-mono text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.4 }}
        >
          Arrivée : votre première conciergerie qui tourne, et un propriétaire qui vous recommande déjà.
        </motion.p>
      </div>

      <div className="mt-10 text-center">
        <Button
          render={<a href="#inscription" />}
          nativeButton={false}
          size="lg"
          className="h-14 px-8 text-base font-semibold"
          style={{ boxShadow: "0 10px 36px -6px color-mix(in oklch, var(--primary) 55%, transparent)" }}
        >
          Accéder à la formation gratuite
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
