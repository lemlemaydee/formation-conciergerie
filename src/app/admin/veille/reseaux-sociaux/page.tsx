import Link from "next/link";
import {
  ArrowLeft,
  Video,
  Users,
  PlayCircle,
  TrendingUp,
  Layers3,
  ShieldCheck,
  Lightbulb,
  ClipboardList,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface Video {
  titre: string;
  vues: string;
  quand: string;
}

const TOP_VIDEOS_PRINCIPALE: Video[] = [
  { titre: "J'ai fait 10000€ en un mois en partant de 0 au lycée", vues: "359K", quand: "il y a 2 ans — vidéo pilier" },
  { titre: "Daily vlog d'un étudiant RICHE SA MÈRE", vues: "171K", quand: "il y a 1 an" },
  { titre: "Je vais à la fac alors que je gagne 40k/mois", vues: "122K", quand: "il y a 1 an" },
  { titre: "LE MINDSET qui m'a permis d'être millionaire à 19 ans !", vues: "73K", quand: "il y a 2 sem." },
  { titre: "Comment je gagne 150'000€/mois à 19 ans ? (Daily Vlog)", vues: "61K", quand: "il y a 9 mois" },
  { titre: "Mickaël Wu, le meilleur coach make money en France", vues: "50K", quand: "il y a 8 mois" },
];

const TOP_SHORTS: Video[] = [
  { titre: "ARRÊTEZ DE DIRE WESH !", vues: "75K", quand: "mindset / culture jeune, zéro vente" },
  { titre: "je deviens chauve", vues: "45K", quand: "vulnérabilité / auto-dérision" },
  { titre: "Imagine tu regrettes ta vie à 60 ans", vues: "25K", quand: "mindset / urgence de vivre" },
  { titre: "L'école nous apprend à réussir à l'école, pas dans la vie", vues: "19K", quand: "contre-conformisme" },
  { titre: "Mon Glow Down.", vues: "19K", quand: "transformation personnelle" },
];

const ETUDES_DE_CAS: { titre: string; resultat: string; vues: string }[] = [
  { titre: "Il vend des accompagnements de beauté et gagne 6000€/mois à 18 ans !", resultat: "Nathan — 6 000€/mois à 18 ans", vues: "5K" },
  { titre: "Comment ce coach sportif est passé de 1k à 6k€/mois ?", resultat: "Justin — 1K → 6K€/mois", vues: "3,8K" },
  { titre: "De salarié chez Orange à +5K€/MOIS", resultat: "Ex-salarié Orange → 5K€/mois", vues: "3,5K" },
  { titre: "200k abonnés en 3 mois pour Arthur, on te dévoile tout !", resultat: "Arthur — 200K abonnés en 3 mois", vues: "3,2K" },
  { titre: "Il passe de 2k en resell à 20k€/mois grâce à la création de contenu", resultat: "2K → 20K€/mois (reconversion resell)", vues: "1,5K" },
  { titre: "D'étudiants pauvres à +8k€/mois", resultat: "Étudiants → 8K€/mois", vues: "4,9K" },
  { titre: "À 17 ans, mes clients gagnent 15k€/mois grâce à la création de contenu", resultat: "Client de 17 ans — 15K€/mois", vues: "5,2K" },
  { titre: "Comment Benoît est passé de 0 à 5k€/mois ?", resultat: "Benoît — 0 → 5K€/mois", vues: "2,5K" },
  { titre: "Comment Maya est passée de 0 à 10k€/mois en étudiant ?", resultat: "Maya — 0 → 10K€/mois, étudiante", vues: "12K" },
  { titre: "Témoignage d'une maman d'un de nos élèves qui gagne 5000€/mois", resultat: "Témoignage parent — 5K€/mois", vues: "1,3K" },
];

const HOOKS: { technique: string; exemple: string; pourquoi: string }[] = [
  {
    technique: "Chiffre précis + délai serré dans le titre",
    exemple: "« J'ai fait 10000€ en un mois en partant de 0 au lycée » — 359K vues",
    pourquoi: "Un chiffre rond et un délai court rendent la promesse concrète et vérifiable, contrairement à « gagner de l'argent ».",
  },
  {
    technique: "Format « un jour dans ma vie à X€/mois »",
    exemple: "« Un jour dans ma vie d'étudiant entrepreneur à 15000€ par mois »",
    pourquoi: "Montre le résultat comme un mode de vie filmé au quotidien, pas comme un coup de chance ponctuel.",
  },
  {
    technique: "Avant/après nommé et daté",
    exemple: "« De salarié chez Orange à +5K€/MOIS »",
    pourquoi: "Un point de départ précis et reconnaissable (un employeur connu) permet au spectateur de se projeter directement.",
  },
  {
    technique: "Contenu grand public sans aucune vente",
    exemple: "« L'école nous apprend à réussir à l'école, pas dans la vie » (Short mindset)",
    pourquoi: "Capte une audience large à coût nul avant tout argumentaire commercial — construit la marque avant de monétiser.",
  },
  {
    technique: "Réponse frontale aux critiques",
    exemple: "« Je vends des formations et alors ? » / « Si tu hésites à acheter mon accompagnement, regarde cette vidéo » (1h17)",
    pourquoi: "Désamorce l'objection dans une vidéo dédiée plutôt que de l'ignorer et laisser le doute s'installer.",
  },
  {
    technique: "Urgence datée",
    exemple: "« LES PRIX AUGMENTENT LE 30 SEPTEMBRE, RÉSERVE TON APPEL GRATUIT AVEC NOS COACH ! »",
    pourquoi: "Une date précise et un prix qui bouge donnent une raison d'agir maintenant plutôt que « plus tard ».",
  },
];

const MECANIQUES: { titre: string; texte: string }[] = [
  {
    titre: "Un seul CTA, répété partout",
    texte: "Chaque description de vidéo (des deux chaînes) pointe vers le même appel gratuit, pris en DM Instagram (@mickawu) — jamais de lien de paiement direct en description.",
  },
  {
    titre: "Garantie « satisfait ou remboursé »",
    texte: "Présente sur quasiment toutes les vidéos, formulée à l'identique — la garantie fait partie du pitch répété, pas d'un argumentaire ponctuel.",
  },
  {
    titre: "L'équipe devient elle-même du contenu",
    texte: "« Présentation Coach Calvin », « Présentation Coach Hustler » : chaque coach recruté a sa propre vidéo de présentation — signale une structure qui a grandi au-delà du fondateur seul.",
  },
  {
    titre: "Le live devient un format à part entière",
    texte: "« MICKAËL WU CONFÉRENCE 1 — REDIFFUSION COMPLÈTE » (2h03) : l'événement en présentiel est retravaillé en contenu long, puis redécoupé en extraits.",
  },
];

const RECOMMANDATIONS: { titre: string; texte: string }[] = [
  {
    titre: "Construire un étage de contenu qui ne vend rien",
    texte: "Ses Shorts les plus vus (école, mindset, vie d'étudiant) ne parlent presque jamais d'argent. Notre contenu est aujourd'hui 100% conciergerie — un étage plus large (indépendance, vie d'entrepreneur, discipline) toucherait des gens qui ne savent pas encore qu'ils veulent une conciergerie.",
  },
  {
    titre: "Systématiser la vidéo étude de cas nommée",
    texte: "Sa chaîne « Accompagnement » (62 vidéos) ne contient quasiment que des résultats élèves nommés et datés. Nous avons des témoignages, mais pas un format récurrent dédié — une série régulière « résultat d'élève » ferait le même travail de preuve sociale en continu.",
  },
  {
    titre: "Adresser les objections dans des vidéos dédiées",
    texte: "« Si tu hésites à acheter mon accompagnement, regarde cette vidéo » (1h17) et « Je vends des formations et alors ? » traitent le scepticisme de face plutôt que de l'éviter. Nos objections FAQ existent en texte — une ou deux versions vidéo pourraient convertir davantage.",
  },
  {
    titre: "Une date limite réelle, pas permanente",
    texte: "« Les prix augmentent le 30 septembre » ne fonctionne que parce que c'est vérifiable. À tester uniquement si la raison est réelle (ouverture de promo, date de cohorte) — une fausse urgence répétée érode la confiance plus vite qu'elle ne convertit.",
  },
  {
    titre: "Montrer le duo, pas juste un visage",
    texte: "Ses vidéos « Présentation Coach X » existent parce qu'il n'est plus seul. Nous le sommes déjà, à deux : Mehdi et Jacques pourraient apparaître davantage ensemble dans le contenu, pas seulement dans la section « Équipe » du site.",
  },
];

export default function AdminVeilleReseauxSociauxPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <Link
          href="/admin/veille"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Veille concurrentielle
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-foreground">Stratégie réseaux sociaux — Mickaël Wu</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Structure de contenu, hooks et mécaniques de vente observés chez un créateur qui enseigne la création de
          contenu et vend un accompagnement business. Rien à voir avec la conciergerie — tout à voir avec comment il
          vend. Instantané du 24 septembre 2026, chaînes YouTube publiques uniquement.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Video} label="Chaîne principale" value="63,1K" hint="@mickaelwu — 133 vidéos" />
        <StatCard icon={Users} label="Chaîne « Accompagnement »" value="2,47K" hint="62 vidéos, 100% études de cas" />
        <StatCard icon={PlayCircle} label="Vidéo la plus vue" value="359K" hint="« 10 000€ en 1 mois, parti de 0 au lycée »" />
        <StatCard icon={TrendingUp} label="Chaînes analysées" value="2" hint="TikTok inaccessible cette session" />
      </div>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Layers3 className="size-4 text-primary" />
          La pyramide de contenu
        </h2>
        <p className="text-sm text-muted-foreground">
          Trois étages bien distincts, chacun avec un rôle précis dans le tunnel — du plus grand public au plus
          vendeur.
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-wide text-emerald uppercase">Haut de tunnel — Shorts</p>
            <p className="mt-2 text-sm text-foreground">
              Mindset, école, image de soi, relations — jamais d&apos;argent ni de vente. Construit l&apos;audience à
              coût nul.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-wide text-gold uppercase">Milieu — Vlogs longs</p>
            <p className="mt-2 text-sm text-foreground">
              « Un jour dans ma vie à X€/mois », chiffres précis en titre. Construit l&apos;aspiration et la
              crédibilité par le mode de vie filmé.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-wide text-primary uppercase">Bas de tunnel — Chaîne dédiée</p>
            <p className="mt-2 text-sm text-foreground">
              100% études de cas élèves nommées, présentation de l&apos;équipe, événements. Répond à « est-ce que ça
              marche pour quelqu&apos;un comme moi ? ».
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <TrendingUp className="size-4 text-primary" />
          Ses vidéos les plus vues — chaîne principale
        </h2>
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vidéo</TableHead>
                <TableHead>Vues</TableHead>
                <TableHead>Contexte</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TOP_VIDEOS_PRINCIPALE.map((v) => (
                <TableRow key={v.titre}>
                  <TableCell className="min-w-56 whitespace-normal font-medium text-foreground">{v.titre}</TableCell>
                  <TableCell className="whitespace-nowrap font-mono text-xs">{v.vues}</TableCell>
                  <TableCell className="whitespace-normal text-muted-foreground">{v.quand}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <h3 className="pt-2 text-sm font-semibold text-foreground">Ses Shorts les plus vus</h3>
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Short</TableHead>
                <TableHead>Vues</TableHead>
                <TableHead>Registre</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TOP_SHORTS.map((v) => (
                <TableRow key={v.titre}>
                  <TableCell className="min-w-56 whitespace-normal font-medium text-foreground">{v.titre}</TableCell>
                  <TableCell className="whitespace-nowrap font-mono text-xs">{v.vues}</TableCell>
                  <TableCell className="whitespace-normal text-muted-foreground">{v.quand}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Users className="size-4 text-primary" />
          Bibliothèque d&apos;études de cas — chaîne « Accompagnement »
        </h2>
        <p className="text-sm text-muted-foreground">
          Quasiment chaque vidéo de cette chaîne suit le même gabarit : un prénom ou un contexte de départ, un
          résultat chiffré. Une vraie chaîne de production de preuve sociale.
        </p>
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre de la vidéo</TableHead>
                <TableHead>Résultat mis en avant</TableHead>
                <TableHead>Vues</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ETUDES_DE_CAS.map((v) => (
                <TableRow key={v.titre}>
                  <TableCell className="min-w-56 whitespace-normal text-foreground">{v.titre}</TableCell>
                  <TableCell className="min-w-40 whitespace-normal font-medium text-foreground">{v.resultat}</TableCell>
                  <TableCell className="whitespace-nowrap font-mono text-xs">{v.vues}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Lightbulb className="size-4 text-primary" />
          Les hooks et titres qui reviennent
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {HOOKS.map((h) => (
            <div key={h.technique} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="font-semibold text-foreground">{h.technique}</p>
              <p className="mt-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-foreground italic">{h.exemple}</p>
              <p className="mt-2 text-sm text-muted-foreground">{h.pourquoi}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Mécaniques de vente observées
        </h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
          {MECANIQUES.map((m) => (
            <div key={m.titre} className="grid grid-cols-1 gap-1 p-5 sm:grid-cols-[220px_1fr] sm:gap-5">
              <h3 className="font-semibold text-foreground">{m.titre}</h3>
              <p className="text-sm text-muted-foreground">{m.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Lightbulb className="size-4 text-primary" />
          Ce qu&apos;on peut en tirer pour Formation Conciergerie
        </h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
          {RECOMMANDATIONS.map((r) => (
            <div key={r.titre} className="grid grid-cols-1 gap-1 p-5 sm:grid-cols-[260px_1fr] sm:gap-5">
              <h3 className="font-semibold text-foreground">{r.titre}</h3>
              <p className="text-sm text-muted-foreground">{r.texte}</p>
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
            <strong className="text-foreground">Construction :</strong> visite directe des deux chaînes YouTube
            publiques de Mickaël Wu (@mickaelwu et @MickaëlWuAccompagnement) le 24 septembre 2026 — titres, vues et
            descriptions publiques uniquement.
          </p>
          <p>
            <strong className="text-foreground">TikTok :</strong> son compte (@mickaelwu) a été localisé mais
            l&apos;accès a été bloqué par TikTok pendant cette session (limite atteinte après la veille précédente sur
            la conciergerie). À reprendre dans une session séparée pour compléter avec le format court TikTok.
          </p>
          <p>
            <strong className="text-foreground">Contexte :</strong> plusieurs chaînes tierces publient des contenus
            qui l&apos;interrogent directement sur son offre (ex. une chaîne d&apos;analyse de formations). Aucune
            conclusion ici sur le bien-fondé de ces contenus — c&apos;est juste un signal que ce type de discours
            marketing (promesses de revenus, garantie systématique) attire aussi l&apos;examen critique, à garder en
            tête pour notre propre crédibilité.
          </p>
        </div>
      </section>
    </div>
  );
}
