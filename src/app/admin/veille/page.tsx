import Link from "next/link";
import { Radar, Users, GraduationCap, Building2, Workflow, Lightbulb, ClipboardList, Search, ArrowRight, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface Compte {
  nom: string;
  handle: string;
  followers: string;
  likes: string;
  note: string;
  flag?: { label: string; tone: "gold" | "destructive" };
}

const FORMATEURS: Compte[] = [
  {
    nom: "Yann Gendrey",
    handle: "@yann.gdrey",
    followers: "14,6K",
    likes: "341K",
    note: "« Expert & Formateur Airbnb ». Masterclass gratuite (CYGA Academy) : créer sa conciergerie et signer ses premiers propriétaires — modèle identique au nôtre. Le tunnel le plus abouti du lot.",
  },
  {
    nom: "Mina",
    handle: "@immosousloc",
    followers: "6 718",
    likes: "71,2K",
    note: "Juriste reconvertie en 2022. Masterclass gratuite (BNB Academy), modèle sous-location (exploiter des biens sans les acheter), +100 accompagnés, FAQ anti-objections très travaillée.",
  },
  {
    nom: "Sam & Abel",
    handle: "@sabelfamilly",
    followers: "730K",
    likes: "27,1M",
    note: "Compte famille/business généraliste. Offre conciergerie dédiée aux femmes/mamans (Sabel Academy) : ebook 47€ → appel → programme 10 modules, garantie 365 jours.",
  },
  {
    nom: "iliesbusiness",
    handle: "@ilies_business",
    followers: "23,7K",
    likes: "1,0M",
    note: "« Signe ton premier bien en 90 jours », funnel par DM. Compte le plus actif croisé dans nos recherches (posts très fréquents, forte récurrence).",
  },
  {
    nom: "Aïcha",
    handle: "@aicha.lcd",
    followers: "6 226",
    likes: "47,9K",
    note: "21 ans, 3 agences, +155 conciergeries accompagnées. Positionnement « jeune experte » fort, lien link-in-bio.",
  },
  {
    nom: "walidconciergerie",
    handle: "@walid.conciergerie",
    followers: "2 620",
    likes: "72,4K",
    note: "Marché marocain 🇲🇦. +25 conciergeries accompagnées, funnel DM « Airbnb ».",
  },
  {
    nom: "Lance ta conciergerie",
    handle: "@lancetaconciergerie",
    followers: "1 632",
    likes: "21,6K",
    note: "« Vivre d'Airbnb en 90 jours », 108 accompagnés, formation gratuite hébergée sur Skool.",
  },
  {
    nom: "Victor Chevalier",
    handle: "@victor_chvle",
    followers: "1 445",
    likes: "18,9K",
    note: "20 ans, « Conciergerie & Sous-Location », prise de rendez-vous via Linktree.",
  },
  {
    nom: "LaSousLocationPro.ch",
    handle: "@tonimartin.ch",
    followers: "4 793",
    likes: "42,3K",
    note: "Suisse 🇨🇭, « 1er coach en sous-location pro », formation gratuite sur YouTube.",
  },
  {
    nom: "William_trvn",
    handle: "@william_trvn",
    followers: "2 493",
    likes: "46,3K",
    note: "Angle « revenus passifs » (+500 à 1000€/appartement), pas de tunnel visible en bio pour l'instant.",
  },
  {
    nom: "Conciergerie Academy",
    handle: "@ezekway",
    followers: "14,3K",
    likes: "502,6K",
    note: "« Je révolutionne la conciergerie ». Formation gratuite qui dévoile une méthode complète en 7 étapes, 305+ personnes formées, vise une certification Qualiopi (financement CPF/OPCO).",
    flag: { label: "à surveiller", tone: "gold" },
  },
  {
    nom: "MaisonBleue",
    handle: "@maisonbleue_",
    followers: "51,4K",
    likes: "304,3K",
    note: "Programme « Property Partner » en 30 jours. Note 4,6/5 sur 132 avis vérifiés affichée dans le tunnel, 6 témoignages chiffrés, cible salariés/alternants.",
    flag: { label: "à surveiller", tone: "gold" },
  },
];

const CONCIERGERIES: Compte[] = [
  {
    nom: "Conciergerie en ligne",
    handle: "@blsd.immo",
    followers: "103,4K",
    likes: "906,2K",
    note: "De très loin le plus gros compte 100% conciergerie trouvé. Recrute des propriétaires partout en France, production soignée (playlists par typologie F2–F4, témoignages).",
  },
  {
    nom: "BnbZen France",
    handle: "@bnbzen_france",
    followers: "35,7K",
    likes: "397,9K",
    note: "Plateforme de séjours à la journée/nuitée (suites jacuzzi, vans avec chauffeur), paiement en plusieurs fois. Modèle adjacent, pas de la conciergerie classique.",
  },
  {
    nom: "Location Service France",
    handle: "@location.service8",
    followers: "11,9K",
    likes: "55,4K",
    note: "Contact WhatsApp uniquement, très peu d'informations publiques dans la bio.",
  },
  {
    nom: "rrconciergerie",
    handle: "@rrconciergerie",
    followers: "11,5K",
    likes: "62,2K",
    note: "Conciergerie de luxe lifestyle — Dubaï, Marrakech, Phuket, France : villas, voitures, yachts. Autre segment (ultra-luxe), pas de la gestion Airbnb classique.",
  },
  {
    nom: "CM Conciergerie",
    handle: "@cm.conciergerie",
    followers: "10,4K",
    likes: "312",
    note: "Bio vide, seulement 312 likes cumulés pour 10,4K abonnés — ratio anormal, probable compte peu actif ou audience achetée.",
    flag: { label: "signal faible", tone: "destructive" },
  },
  {
    nom: "Get Host Conciergerie",
    handle: "@sofian_immobilier",
    followers: "5 506",
    likes: "44,1K",
    note: "Opère en France 🇫🇷 et au Maroc 🇲🇦, porté par son « CEO ».",
  },
  {
    nom: "Simply Home Conciergerie",
    handle: "@simply.home.conciergerie",
    followers: "1 633",
    likes: "29,8K",
    note: "Val d'Europe, +100 logements gérés, vrai site (simplyhome.fr). Deux vidéos parties virales (341K et 107K vues) malgré un petit compte.",
  },
  {
    nom: "Conciergerie Paris",
    handle: "@conciergerie.paris",
    followers: "2 840",
    likes: "25,1K",
    note: "Positionnement parisien, profil non audité en détail.",
  },
  {
    nom: "Key Cosy",
    handle: "@keycosyconciergerie",
    followers: "312",
    likes: "3 014",
    note: "Tout petit compte, mais deux vidéos à 296K et 107K vues — la viralité ne dépend pas de la taille de l'audience de départ.",
  },
  {
    nom: "Conciergerie Rennes",
    handle: "@stayo.conciergerie",
    followers: "235",
    likes: "1 404",
    note: "Positionnement local clair, bio en menu de services lisible (accueil · ménage · linge · optimisation).",
  },
  {
    nom: "Maisond'Or",
    handle: "@maisondorconciergerie",
    followers: "257",
    likes: "2 701",
    note: "Versailles et alentours, positionnement local.",
  },
  {
    nom: "Malcolm",
    handle: "@malcolm.chc",
    followers: "547",
    likes: "4 083",
    note: "Conciergerie en Guadeloupe, site concieraglow.com.",
  },
];

interface Funnel {
  nom: string;
  handle: string;
  accroche: string;
  items: { label: string; texte: string }[];
  frappe: string;
  highlight?: string;
}

const FUNNELS: Funnel[] = [
  {
    nom: "CYGA Academy",
    handle: "@yann.gdrey",
    highlight: "le plus proche de nous",
    accroche: "« Crée ta conciergerie Airbnb et signe tes premiers propriétaires en partant de zéro. »",
    items: [
      { label: "Entrée du tunnel", texte: "Masterclass vidéo gratuite, 8 minutes, accès immédiat, aucune carte demandée." },
      { label: "Contenu annoncé", texte: "Fonctionnement d'une conciergerie, étude de rentabilité du marché local, construction de l'offre propriétaire, canaux de prospection (Google, réseaux sociaux, Leboncoin, Airbnb)." },
      { label: "Preuve sociale", texte: "5 cas nommés et datés : Florian (1er contrat en 28 jours), Aimen (+60 000 $CAD), Vivien (5 000€/mois en 3 mois), Tonio (influenceur 3M abonnés), Solène (maman solo)." },
    ],
    frappe: "Le même modèle exact que Formation Conciergerie (gestion pour propriétaires tiers), avec la preuve sociale la mieux chiffrée et datée du marché.",
  },
  {
    nom: "BNB Academy",
    handle: "@immosousloc",
    accroche: "« Générer +5 000€/mois en 90 jours grâce à la méthode Airbnb Automatisée. »",
    items: [
      { label: "Entrée du tunnel", texte: "Masterclass gratuite de 15 minutes, présentée par la fondatrice (ex-juriste en droit des affaires, reconvertie en 2022)." },
      { label: "Modèle", texte: "Sous-location professionnelle — exploiter des biens sans les acheter, pas la gestion pour propriétaires tiers." },
      { label: "Preuve sociale", texte: "Profils volontairement variés : maman, comptable, vendeuse, serveuse, étudiante, sous-loueur de 50 ans — « ça peut être toi aussi »." },
    ],
    frappe: "Une FAQ construite comme un argumentaire anti-objection : légalité, besoin de crédit, niveau débutant, saturation du marché — 4 freins traités un par un.",
  },
  {
    nom: "Sabel Academy",
    handle: "@sabelfamilly",
    accroche: "« Comment j'ai construit une conciergerie Airbnb depuis chez moi, même en post-partum. »",
    items: [
      { label: "Entrée du tunnel", texte: "Ebook à 47€ (produit d'appel) → appel découverte gratuit de 15 min → programme complet." },
      { label: "Modèle", texte: "Conciergerie, positionnée exclusivement pour les femmes/mamans voulant un revenu sans sacrifier leur présence familiale. 10 modules + communauté privée." },
      { label: "Garantie", texte: "« Résultats 365 jours ou remboursé » si la méthode est réellement appliquée un an sans résultat." },
    ],
    frappe: "Le tunnel le plus abouti commercialement : produit d'entrée à prix visible, montée en gamme claire, garantie qui lève le principal frein à l'achat.",
  },
  {
    nom: "Conciergerie Academy",
    handle: "@ezekway",
    accroche: "« Comment lancer ta conciergerie Airbnb de A à Z et signer ton 1er logement en 24 jours. »",
    items: [
      { label: "Entrée du tunnel", texte: "Formation vidéo gratuite. Le fondateur affirme gérer 100+ Airbnb sans avoir acheté un seul appartement. Mention « certification Qualiopi en cours de validation »." },
      { label: "Contenu", texte: "Le seul tunnel qui dévoile sa méthode complète en libre accès : 7 étapes détaillées, une action concrète à chaque étape." },
      { label: "Preuve sociale", texte: "305+ personnes formées. Cas nommés à profils volontairement non-experts : Xavier (pharmacien → 15 logements en 3 mois), Amine (21 ans, garagiste → 4 villas de luxe en 2 mois)." },
    ],
    frappe: "Vise Qualiopi — si obtenue, la formation devient finançable par CPF/OPCO. Le levier de conversion le plus structurant de tout l'échantillon.",
  },
  {
    nom: "MaisonBleue",
    handle: "@maisonbleue_",
    accroche: "« Deviens Property Partner en 30 jours et décroche ton premier propriétaire Airbnb — 1h par jour, sans lâcher ton CDI. »",
    items: [
      { label: "Entrée du tunnel", texte: "Vidéo exclusive gratuite." },
      { label: "Modèle", texte: "Positionnement « Property Partner » plutôt qu'« élève » : les fondateurs se présentent comme mentors/pairs, pas comme experts distants." },
      { label: "Preuve sociale", texte: "Note globale 4,6/5 sur 132 avis vérifiés affichée dans le tunnel, façon Trustpilot — puis 6 témoignages nommés et chiffrés." },
    ],
    frappe: "Le seul à afficher une note globale type avis vérifiés directement dans le tunnel — un format de preuve sociale absent des quatre autres.",
  },
];

const RECOMMANDATIONS: { titre: string; texte: string }[] = [
  {
    titre: "Le tunnel est standardisé",
    texte: "Masterclass courte et gratuite → preuve sociale chiffrée et datée → offre. Les cinq acteurs les plus sérieux l'utilisent à l'identique. Si on n'a pas exactement ce format côté TikTok, c'est le premier écart à combler.",
  },
  {
    titre: "Qualiopi peut neutraliser l'objection prix",
    texte: "Conciergerie Academy vise une certification Qualiopi. Une fois obtenue, la formation devient finançable par CPF ou OPCO — l'élève ne paie plus de sa poche. Le levier de conversion le plus structurant repéré dans tout l'échantillon.",
  },
  {
    titre: "La note « avis vérifiés » est un format à part",
    texte: "MaisonBleue est seule à afficher un score global (4,6/5, 132 avis vérifiés) directement dans son tunnel, façon Trustpilot. Un signal de confiance différent du témoignage individuel — les deux se complètent.",
  },
  {
    titre: "La preuve sociale se nomme et se date",
    texte: "« Florian, premier contrat signé en 28 jours » convainc plus que « nos élèves réussissent ». Nos témoignages gagneraient à porter un prénom, un chiffre et un délai précis.",
  },
  {
    titre: "Le prix reste caché partout",
    texte: "Aucun des cinq tunnels n'affiche son prix publiquement — il se découvre après la vidéo gratuite ou pendant l'appel. Personne ne compare frontalement les prix sur TikTok aujourd'hui : un angle mort, dans un sens ou dans l'autre selon notre stratégie de prix.",
  },
  {
    titre: "Sabel Academy est seule à réduire la friction avec un vrai produit d'appel",
    texte: "Elle seule propose un produit d'entrée visible (ebook 47€) et une garantie formelle (365 jours) — les deux mécaniques qui réduisent le plus la friction à l'achat.",
  },
  {
    titre: "La conciergerie pour tiers est moins occupée que la sous-location",
    texte: "Parmi les gros comptes de formation identifiés, la sous-location professionnelle domine (Mina, Lance ta conciergerie, iliesbusiness, Victor Chevalier, tonimartin.ch). CYGA Academy est le seul à coller exactement à notre modèle — un espace moins saturé sur TikTok.",
  },
  {
    titre: "Notre vrai différenciateur : le haut de gamme, pas juste « on opère »",
    texte: "Conciergerie Academy revendique aussi une opération réelle à notre échelle (100+ logements gérés). Ce qu'aucun concurrent direct ici n'adresse, en revanche, c'est le segment premium : Monaco / Côte d'Azur, clientèle UHNW. C'est cet angle-là qu'il faut pousser plus fort.",
  },
  {
    titre: "Le canal est vivant, pas saturé",
    texte: "Le cas client de CYGA Academy est daté d'août/septembre 2026, plusieurs comptes publient plusieurs fois par semaine. TikTok reste un canal d'acquisition actif sur cette niche en France.",
  },
];

const PISTES_NON_VERIFIEES = [
  "@bilelfartas", "@buani.logement.me", "@carlalexandrebnb", "@conciergerie_mile", "@elisabethhigelin",
  "@iris.indigo.conciergerie", "@l_avocat_investisseur_", "@lesclesdusud", "@melylupa.conciergerie",
  "@n.a.conciergerie", "@nassim.immobilier", "@rimconciergerie", "@thauconciergerie", "@wy.stays",
  "@conciergelite", "@conciergerie.cle", "@conciergerie.le.bardo", "@conciergerielocation",
  "@gentlehost.fr", "@lejconciergerie", "@yannis_ettouil",
];

function CompteTable({ comptes }: { comptes: Compte[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Compte</TableHead>
          <TableHead>Followers</TableHead>
          <TableHead>Likes</TableHead>
          <TableHead>Positionnement observé</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {comptes.map((c) => (
          <TableRow key={c.handle}>
            <TableCell className="whitespace-nowrap align-top">
              <span className="font-medium text-foreground">{c.nom}</span>
              <span className="mt-0.5 block font-mono text-xs text-muted-foreground">{c.handle}</span>
              {c.flag && (
                <span
                  className={`mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    c.flag.tone === "gold" ? "bg-gold/10 text-gold-foreground" : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {c.flag.label}
                </span>
              )}
            </TableCell>
            <TableCell className="align-top font-mono text-xs whitespace-nowrap">{c.followers}</TableCell>
            <TableCell className="align-top font-mono text-xs whitespace-nowrap">{c.likes}</TableCell>
            <TableCell className="min-w-64 whitespace-normal align-top text-muted-foreground">{c.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function AdminVeillePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Veille concurrentielle — TikTok</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Qui parle de conciergerie Airbnb et de sous-location sur TikTok en France, avec quelle audience, et comment
          ces comptes vendent leur offre. Instantané du 23 septembre 2026, données publiques uniquement.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Link
          href="/admin/veille/idees"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Lightbulb className="size-5" />
            </span>
            <div>
              <p className="font-semibold text-foreground">Banque d&apos;idées vidéos</p>
              <p className="text-sm text-muted-foreground">
                Hooks, sujets et pain points repérés ci-dessous, prêts à devenir des scripts.
              </p>
            </div>
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        <Link
          href="/admin/veille/reseaux-sociaux"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-gold/30 bg-gold/5 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-foreground">
              <TrendingUp className="size-5" />
            </span>
            <div>
              <p className="font-semibold text-foreground">Stratégie réseaux sociaux</p>
              <p className="text-sm text-muted-foreground">
                Ce que Mickaël Wu fait pour vendre son accompagnement — hooks, tunnel, preuve sociale.
              </p>
            </div>
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Comptes analysés" value="25" hint="Stats vérifiées sur profil" />
        <StatCard icon={Building2} label="Plus gros compte conciergerie" value="103,4K" hint="@blsd.immo (service réel)" />
        <StatCard icon={GraduationCap} label="Plus gros compte formateur" value="730K" hint="@sabelfamilly (généraliste)" />
        <StatCard icon={Workflow} label="Tunnels disséqués" value="5" hint="Pages de capture analysées" />
      </div>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <GraduationCap className="size-4 text-primary" />
          Formateurs &amp; coachs — concurrence directe
        </h2>
        <p className="text-sm text-muted-foreground">
          Ces comptes ne gèrent pas (ou peu) de biens eux-mêmes : ils enseignent comment se lancer, avec un tunnel de
          vente derrière le contenu TikTok.
        </p>
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <CompteTable comptes={FORMATEURS} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Building2 className="size-4 text-primary" />
          Conciergeries réelles — benchmark de service
        </h2>
        <p className="text-sm text-muted-foreground">
          Ils opèrent une vraie activité de conciergerie, sans formation visible. Utiles comme baromètre du marché,
          pas comme concurrents de la formation elle-même.
        </p>
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <CompteTable comptes={CONCIERGERIES} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Workflow className="size-4 text-primary" />
          Tunnels de vente disséqués
        </h2>
        <p className="text-sm text-muted-foreground">
          Aucun des cinq n&apos;affiche son prix publiquement : on le découvre après la vidéo gratuite ou lors de
          l&apos;appel.
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {FUNNELS.map((f) => (
            <div key={f.handle} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">{f.nom}</h3>
                  <p className="font-mono text-xs text-muted-foreground">{f.handle}</p>
                </div>
                {f.highlight && <Badge className="shrink-0">{f.highlight}</Badge>}
              </div>
              <p className="mt-4 text-sm text-pretty text-foreground italic">{f.accroche}</p>
              <dl className="mt-4 space-y-3">
                {f.items.map((it) => (
                  <div key={it.label}>
                    <dt className="text-[11px] font-semibold tracking-wide text-emerald uppercase">{it.label}</dt>
                    <dd className="mt-0.5 text-sm text-muted-foreground">{it.texte}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 rounded-lg bg-gold/10 p-3 text-sm font-medium text-gold-foreground">{f.frappe}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Lightbulb className="size-4 text-primary" />
          Lecture stratégique — ce que ça change pour nous
        </h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
          {RECOMMANDATIONS.map((r) => (
            <div key={r.titre} className="grid grid-cols-1 gap-1 p-5 sm:grid-cols-[220px_1fr] sm:gap-5">
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
            <strong className="text-foreground">Construction :</strong> recherches par mots-clés et par hashtags sur
            TikTok sans compte connecté, puis visite de chaque profil public repéré, le 23 septembre 2026. Mots-clés
            testés : conciergerie, conciergerie airbnb, sous-location, arbitrage locatif, formation airbnb, coach
            airbnb, gestion locative airbnb, meublé de tourisme, hashtags #conciergerieairbnb / #conciergerie /
            #souslocation.
          </p>
          <p>
            <strong className="text-foreground">Limites :</strong> sans connexion, TikTok plafonne le nombre de
            résultats par recherche et ne permet pas de trier par audience — cette liste est un échantillon
            représentatif, pas un recensement exhaustif. Les compteurs sont des instantanés à cette date et
            évolueront.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Search className="size-4 text-primary" />
          Pistes additionnelles, non vérifiées
        </h2>
        <p className="text-sm text-muted-foreground">
          Croisés dans les mêmes hashtags mais pas encore visités individuellement — noms seuls, aucune statistique
          confirmée.
        </p>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="font-mono text-xs leading-loose text-muted-foreground">{PISTES_NON_VERIFIEES.join(" · ")}</p>
        </div>
      </section>

      <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
        <Radar className="size-3.5" />
        Dossier de veille interne — à mettre à jour manuellement si vous voulez de nouvelles données.
      </div>
    </div>
  );
}
