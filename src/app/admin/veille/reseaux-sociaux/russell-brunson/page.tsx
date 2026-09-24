import {
  Video,
  Users,
  BookOpen,
  Workflow,
  GitBranch,
  MousePointerClick,
  Lightbulb,
  ClipboardList,
  MonitorPlay,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

const FRAMEWORKS: { titre: string; texte: string }[] = [
  {
    titre: "La Formule Secrète",
    texte: "Avant de construire quoi que ce soit : qui est mon client de rêve, où se trouve-t-il déjà, quel hameçon (contenu, pub) l'attire, et quelle est la première offre à lui faire.",
  },
  {
    titre: "Hook, Story, Offer",
    texte: "Chaque contenu ou page de vente suit ce triptyque : un hook qui arrête le défilement, une histoire qui crée la connexion et casse les fausses croyances, une offre qui devient la suite logique de l'histoire — jamais une vente à froid.",
  },
  {
    titre: "La Value Ladder",
    texte: "Une suite d'offres qui montent en engagement et en prix, chacune résolvant un problème plus grand que la précédente — le client gravit les marches, il n'est jamais mis devant l'achat le plus cher en premier.",
  },
];

export default function RussellBrunsonPage() {
  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Fondateur de ClickFunnels, auteur de <em>DotCom Secrets</em> et <em>Expert Secrets</em> — les deux livres qui
        ont popularisé le mot « tunnel de vente ». Sa chaîne YouTube actuelle a beaucoup changé de format (voir plus
        bas), donc l&apos;essentiel ici vient de ses frameworks fondateurs, toujours enseignés tels quels. Instantané
        du 24 septembre 2026, chaîne YouTube publique.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Video} label="Abonnés YouTube" value="423K" hint="@russellbrunson — ~1 000 vidéos" />
        <StatCard icon={BookOpen} label="Livre de référence" value="DotCom Secrets" hint="3 frameworks : Formule secrète, Hook Story Offer, Value Ladder" />
        <StatCard icon={Users} label="Société" value="ClickFunnels" hint="Plus d'1 million d'entrepreneurs formés selon sa bio" />
        <StatCard icon={MonitorPlay} label="Funnel signature" value="Perfect Webinar" hint="Masterclass gratuite → offre en fin de webinaire" />
      </div>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Workflow className="size-4 text-primary" />
          Les 3 frameworks de DotCom Secrets
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {FRAMEWORKS.map((f) => (
            <div key={f.titre} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="font-semibold text-foreground">{f.titre}</p>
              <p className="mt-2 text-sm text-muted-foreground">{f.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <GitBranch className="size-4 text-primary" />
          Notre Value Ladder actuelle — et le barreau qui manque
        </h2>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            <div className="rounded-xl border-2 border-dashed border-destructive/40 bg-destructive/5 p-4 text-center">
              <p className="text-xs font-semibold tracking-wide text-destructive uppercase">Manquant</p>
              <p className="mt-1 text-sm font-medium text-foreground">Un pas gratuit</p>
              <p className="mt-1 text-xs text-muted-foreground">Aucun lead magnet avant de demander 699€ directement</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">49€/mois</p>
              <p className="mt-1 text-sm font-medium text-foreground">Communauté seule</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">699€</p>
              <p className="mt-1 text-sm font-medium text-foreground">Starter</p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-center">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">1 499€</p>
              <p className="mt-1 text-sm font-medium text-foreground">Croissance</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Sur devis</p>
              <p className="mt-1 text-sm font-medium text-foreground">Sur-mesure</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Sa Value Ladder commence toujours par une marche gratuite pour transformer un inconnu en prospect avant de
            lui vendre quoi que ce soit. Nous passons directement de « visiteur du site » à « 699€ » — un mini-guide
            ou un calculateur de rentabilité gratuit (email contre accès) donnerait cette première marche.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MousePointerClick className="size-4 text-primary" />
          Le Perfect Webinar — déjà en train de se généraliser chez les concurrents
        </h2>
        <p className="text-sm text-muted-foreground">
          Sa structure de webinaire (une croyance centrale à faire tomber, trois fausses croyances démontées une par
          une, puis l&apos;offre) est exactement le squelette qu&apos;on a déjà repéré chez CYGA Academy, BNB Academy
          et Sabel Academy dans notre veille formateurs — masterclass courte et gratuite, preuve sociale, offre à la
          fin. Ce n&apos;est pas une coïncidence : c&apos;est devenu le format par défaut de la vente de formation en
          ligne.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Lightbulb className="size-4 text-primary" />
          Ce qu&apos;on peut en tirer pour Formation Conciergerie
        </h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
          <div className="grid grid-cols-1 gap-1 p-5 sm:grid-cols-[260px_1fr] sm:gap-5">
            <h3 className="font-semibold text-foreground">Créer un vrai premier barreau gratuit</h3>
            <p className="text-sm text-muted-foreground">
              Un calculateur de rentabilité ou une checklist « 10 questions avant de signer votre premier
              propriétaire », contre une adresse email — ça capture les visiteurs qui ne sont pas encore prêts à
              payer 699€ mais qui reviendraient avec le bon email de relance.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-1 p-5 sm:grid-cols-[260px_1fr] sm:gap-5">
            <h3 className="font-semibold text-foreground">Écrire nos pages avec Hook, Story, Offer</h3>
            <p className="text-sm text-muted-foreground">
              La page d&apos;accueil va assez vite à l&apos;offre. L&apos;histoire de Mehdi et Jacques (déjà écrite
              dans la section Équipe) pourrait précéder l&apos;offre plus tôt dans le parcours, pas seulement plus
              bas sur la page.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-1 p-5 sm:grid-cols-[260px_1fr] sm:gap-5">
            <h3 className="font-semibold text-foreground">La communauté à 49€/mois est déjà un barreau intermédiaire</h3>
            <p className="text-sm text-muted-foreground">
              Elle existe mais n&apos;est mentionnée qu&apos;en FAQ. Dans une vraie Value Ladder, chaque marche est
              proposée activement au bon moment — pas juste documentée pour qui pose la question.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ClipboardList className="size-4 text-primary" />
          Sa chaîne YouTube aujourd&apos;hui — et pourquoi on ne s&apos;en sert pas ici
        </h2>
        <div className="space-y-2 rounded-2xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
          <p>
            Le contenu actuel de sa chaîne (423K abonnés) a peu à voir avec les funnels : il publie surtout des
            enquêtes longues sur l&apos;histoire de la persuasion et de la propagande — Napoleon Hill, la
            Scientologie, le marketing politique, le contrôle mental. Exemples : « J&apos;ai payé 15 000$ pour la
            vérité que Napoleon Hill ne vous a jamais révélée » ou « La Scientologie : un entonnoir de 380 000$ et 65
            millions de mots écrits ».
          </p>
          <p>
            <strong className="text-foreground">Ce qui reste transférable malgré tout :</strong> ce virage montre
            qu&apos;un contenu narratif long-format sur l&apos;histoire d&apos;un sujet (même sans vendre) construit
            de l&apos;autorité — un format à part, différent des trois frameworks ci-dessus, qu&apos;on note sans le
            creuser davantage ici.
          </p>
          <p>
            <strong className="text-foreground">Construction :</strong> chaîne YouTube publique @russellbrunson et
            recherche ciblée sur « value ladder », « dotcom secrets », « hook story offer », le 24 septembre 2026. Pas
            de TikTok testé pour lui.
          </p>
        </div>
      </section>
    </div>
  );
}
