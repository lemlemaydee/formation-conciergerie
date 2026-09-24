import {
  Video,
  PlayCircle,
  BookOpen,
  Users,
  Scale,
  Flame,
  Timer,
  Gift,
  ShieldCheck,
  Tag,
  Lightbulb,
  ClipboardList,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

const LEVERS: { icon: typeof Flame; titre: string; principe: string; applique: string }[] = [
  {
    icon: Flame,
    titre: "Rareté",
    principe: "Limiter la quantité disponible (places, stock, créneaux) pour rendre le « oui » plus urgent que le « je réfléchis ».",
    applique: "Un nombre de places limité par cohorte pour le palier Croissance (accompagnement + lives), pas sur Starter qui reste toujours ouvert.",
  },
  {
    icon: Timer,
    titre: "Urgence",
    principe: "Une date qui bouge réellement quelque chose (prix, bonus, accès) — jamais un compte à rebours qui recommence de lui-même.",
    applique: "Un bonus ou un tarif de lancement valable jusqu'à une date de cohorte réelle, pas une urgence permanente réinitialisée chaque semaine.",
  },
  {
    icon: Gift,
    titre: "Bonus",
    principe: "Empiler des éléments à forte valeur perçue et faible coût de production, présentés et chiffrés un par un plutôt que noyés dans l'offre.",
    applique: "Pack de scripts de prospection propriétaires, modèles de messages, checklist de mise en ligne — déjà présents dans le programme, mais jamais présentés comme des bonus autonomes avec leur propre valeur affichée.",
  },
  {
    icon: ShieldCheck,
    titre: "Garantie",
    principe: "Remplacer « satisfait ou remboursé » par une garantie de résultat conditionnée à une action précise — elle rassure le client hésitant avant l'achat, pas juste le client déçu après.",
    applique: "Notre garantie 14 jours (déjà en ligne) protège l'achat. Une deuxième garantie de résultat (« si vous suivez le programme et contactez X propriétaires sans signer, on vous accompagne gratuitement 1 mois de plus ») protégerait le résultat — à valider avec Jacques avant publication.",
  },
  {
    icon: Tag,
    titre: "Nom de l'offre",
    principe: "Un nom qui décrit la transformation, pas juste le produit — « Starter » dit ce que c'est, un nom orienté résultat dit ce que ça change.",
    applique: "Nos paliers portent des noms de gamme (Starter, Croissance, Sur-mesure). Nommer l'offre elle-même autour du résultat (ex. quelque chose autour de « premier propriétaire signé » plutôt que du volume de biens) la rendrait plus mémorable.",
  },
];

export default function AlexHormoziPage() {
  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Fondateur d&apos;Acquisition.com et co-fondateur de Skool.com, auteur de <em>$100M Offers</em> et{" "}
        <em>$100M Leads</em>. Sa chaîne ne parle presque jamais de conciergerie ni même de contenu — elle parle de
        comment construire une offre à laquelle personne ne peut dire non. C&apos;est exactement ce qu&apos;on est
        venu chercher ici. Instantané du 24 septembre 2026, chaîne YouTube publique.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Video} label="Abonnés YouTube" value="4,51M" hint="@AlexHormozi — 5 600 vidéos" />
        <StatCard icon={PlayCircle} label="Format phare" value="Scale or Fail" hint="Construit de vraies entreprises en direct, à l'écran" />
        <StatCard icon={BookOpen} label="Livre de référence" value="$100M Offers" hint="16 chapitres, Value Equation au centre" />
        <StatCard icon={Users} label="Société" value="Acquisition.com" hint="Portefeuille d'entreprises accompagnées" />
      </div>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Scale className="size-4 text-primary" />
          La Value Equation — son idée centrale
        </h2>
        <p className="text-sm text-muted-foreground">
          Toute son approche des offres part d&apos;une seule équation : la valeur perçue d&apos;une offre augmente
          avec le résultat promis et la confiance qu&apos;on l&apos;atteindra, et diminue avec le temps et l&apos;effort
          qu&apos;il faut y mettre.
        </p>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-lg font-semibold text-foreground">
              Valeur = <span className="text-primary">Résultat rêvé × Probabilité perçue de réussite</span>
            </p>
            <div className="h-px w-full max-w-md bg-border" />
            <p className="text-lg font-semibold text-foreground">
              <span className="text-gold-foreground">Délai avant résultat × Effort &amp; sacrifice demandés</span>
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-emerald/10 p-4">
              <p className="text-xs font-semibold tracking-wide text-emerald uppercase">Deux leviers à augmenter</p>
              <p className="mt-1 text-sm text-foreground">
                Rendre le résultat plus désirable, et rendre sa réussite plus crédible (preuve, garantie, autorité).
              </p>
            </div>
            <div className="rounded-xl bg-gold/10 p-4">
              <p className="text-xs font-semibold tracking-wide text-gold-foreground uppercase">Deux leviers à réduire</p>
              <p className="mt-1 text-sm text-foreground">
                Raccourcir le temps avant le premier résultat, et retirer autant d&apos;effort et de friction que
                possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Lightbulb className="size-4 text-primary" />
          Notre offre passée à la Value Equation
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="p-5">
              <p className="text-xs font-semibold tracking-wide text-emerald uppercase">Déjà fort</p>
              <p className="mt-2 text-sm text-foreground">
                120+ biens gérés à Monaco / Côte d&apos;Azur, clientèle UHNW : une preuve de crédibilité que la
                plupart des concurrents identifiés dans notre veille n&apos;ont pas. Ça pousse directement la
                « probabilité perçue de réussite ».
              </p>
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold tracking-wide text-destructive uppercase">Le plus gros écart</p>
              <p className="mt-2 text-sm text-foreground">
                24 modules, 182 leçons : complet, mais ça allonge le « délai perçu avant résultat ». Rien dans notre
                copywriting ne dit à quel moment l&apos;élève signe son premier propriétaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Gift className="size-4 text-primary" />
          Les 5 leviers pour muscler une offre — appliqués chez nous
        </h2>
        <p className="text-sm text-muted-foreground">
          Le reste de son livre ($100M Offers) détaille comment habiller une bonne offre pour la rendre irrésistible,
          sans changer le produit lui-même.
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {LEVERS.map((l) => (
            <div key={l.titre} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <l.icon className="size-4 text-primary" />
                <p className="font-semibold text-foreground">{l.titre}</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{l.principe}</p>
              <p className="mt-3 rounded-lg bg-primary/5 px-3 py-2 text-sm text-foreground">{l.applique}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ClipboardList className="size-4 text-primary" />
          Méthodologie &amp; limites
        </h2>
        <div className="space-y-2 rounded-2xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Construction :</strong> chaîne YouTube publique @AlexHormozi (4,51M
            abonnés) et recherche ciblée sur le contenu où il explique sa Value Equation et son livre <em>$100M
            Offers</em>, le 24 septembre 2026.
          </p>
          <p>
            <strong className="text-foreground">Ce qu&apos;on n&apos;a pas fait :</strong> pas de scraping TikTok pour
            lui non plus, et pas de lecture intégrale du livre — le cadre ci-dessus vient de ses propres vidéos
            d&apos;explication, pas d&apos;un résumé tiers.
          </p>
          <p>
            <strong className="text-foreground">Sur la garantie de résultat proposée plus haut :</strong> c&apos;est
            une piste, pas une décision — un engagement de ce type doit être validé avec Jacques avant toute mise en
            ligne, comme pour la garantie 14 jours ajoutée précédemment.
          </p>
        </div>
      </section>
    </div>
  );
}
