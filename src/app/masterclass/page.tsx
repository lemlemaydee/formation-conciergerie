import Link from "next/link";
import {
  Compass,
  Scale,
  Wrench,
  Target,
  Camera,
  Workflow,
  TrendingUp,
  MapPin,
  Users,
  BookOpen,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/reveal";
import { GradientText } from "@/components/landing/gradient-text";
import { MasterclassGate } from "@/app/masterclass/masterclass-gate";

const ICONS = [Compass, Scale, Wrench, Target, Camera, Workflow, TrendingUp];

// Une phrase d'accroche par catégorie relle du programme, dans l'ordre —
// pas le détail leçon par leçon, juste de quoi donner envie.
const CATEGORY_TEASERS: Record<string, string> = {
  "Fondamentaux & stratégie": "Comprendre les modèles de conciergerie qui existent et choisir le vôtre.",
  "Juridique, réglementation & fiscalité": "Sécuriser votre activité : statut, contrats, fiscalité, réglementation locale.",
  "Mise en place & structure commerciale": "Structurer votre offre et vos tarifs avant de démarcher qui que ce soit.",
  "Acquisition & vente": "Trouver et signer vos premiers propriétaires, étape par étape.",
  "Préparation & mise en ligne du bien": "Préparer, photographier et publier une annonce qui convertit.",
  "Opérations quotidiennes": "Gérer le ménage, les voyageurs et les imprévus sans y laisser vos journées.",
  "Piloter, développer & scaler": "Passer de votre premier bien à une conciergerie qui tourne sans vous.",
};

const FAQ = [
  {
    q: "La masterclass est-elle vraiment gratuite ?",
    a: "Oui, entièrement gratuite et sans engagement — on vous demande juste un prénom et un email pour vous donner l'accès.",
  },
  {
    q: "Faut-il déjà avoir de l'expérience en immobilier ?",
    a: "Non. Cette masterclass est pensée aussi bien pour un débutant complet que pour quelqu'un qui gère déjà quelques biens et veut structurer son activité.",
  },
  {
    q: "Je vais devoir acheter quelque chose après ?",
    a: "Non, aucune obligation. Si la méthode vous parle, vous pourrez ensuite découvrir nos formules — mais la masterclass se suffit à elle-même.",
  },
  {
    q: "Qui présente la masterclass ?",
    a: "Mehdi et Jacques, les deux fondateurs de Formation Conciergerie — ils gèrent eux-mêmes plus de 120 biens entre Monaco et la Côte d'Azur.",
  },
];

async function getCategoryTitles(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("title, order_index").order("order_index");
  if (!data || data.length === 0) return Object.keys(CATEGORY_TEASERS);
  return data.map((c) => c.title);
}

async function getMasterclassVideo() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("masterclass_video_url, masterclass_video_poster_url")
    .limit(1)
    .single();
  return { videoUrl: data?.masterclass_video_url ?? null, posterUrl: data?.masterclass_video_poster_url ?? null };
}

export default async function MasterclassPage() {
  const [categoryTitles, { videoUrl, posterUrl }] = await Promise.all([getCategoryTitles(), getMasterclassVideo()]);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              FC
            </span>
            <span className="text-base font-semibold tracking-tight text-foreground">Formation Conciergerie</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section id="inscription" className="scroll-mt-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.05fr] lg:gap-10 lg:px-8">
            <Reveal className="text-center lg:text-left">
              <Badge variant="outline">Masterclass gratuite</Badge>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-balance text-foreground sm:text-5xl">
                Comment lancer votre <GradientText>conciergerie Airbnb</GradientText>, du studio à la villa de
                luxe
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted-foreground lg:mx-0">
                La méthode qu&apos;on applique nous-mêmes pour gérer plus de 120 biens entre Monaco et la Côte
                d&apos;Azur, expliquée en vidéo par Mehdi &amp; Jacques.
              </p>
              <ul className="mx-auto mt-8 max-w-sm space-y-2.5 text-left text-sm text-foreground lg:mx-0">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  Les modèles de conciergerie qui existent, et lequel choisir
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                  Comment trouver et signer vos premiers propriétaires
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald" />
                  Les erreurs qui coûtent le plus cher en démarrant
                </li>
              </ul>
            </Reveal>

            <Reveal delay={0.15}>
              <MasterclassGate videoUrl={videoUrl} posterUrl={posterUrl} />
            </Reveal>
          </div>
        </section>

        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <RevealGroup className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
              <RevealItem className="flex flex-col items-center gap-1.5">
                <MapPin className="size-5 text-primary" />
                <p className="text-2xl font-bold text-foreground">120+</p>
                <p className="text-sm text-muted-foreground">biens gérés, Monaco &amp; Côte d&apos;Azur</p>
              </RevealItem>
              <RevealItem className="flex flex-col items-center gap-1.5">
                <Users className="size-5 text-primary" />
                <p className="text-2xl font-bold text-foreground">UHNW</p>
                <p className="text-sm text-muted-foreground">clientèle exigeante, du studio à la villa de luxe</p>
              </RevealItem>
              <RevealItem className="flex flex-col items-center gap-1.5">
                <BookOpen className="size-5 text-primary" />
                <p className="text-2xl font-bold text-foreground">24 modules</p>
                <p className="text-sm text-muted-foreground">directement issus de notre propre activité</p>
              </RevealItem>
            </RevealGroup>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
                Ce que vous allez <GradientText>découvrir</GradientText>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Le même fil conducteur que notre formation complète, en version accélérée.
              </p>
            </Reveal>

            <RevealGroup className="mt-12 space-y-3">
              {categoryTitles.map((title, i) => {
                const Icon = ICONS[i % ICONS.length];
                return (
                  <RevealItem key={title}>
                    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Icon className="size-4 text-primary" />
                          <p className="font-semibold text-foreground">{title}</p>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {CATEGORY_TEASERS[title] ?? "Un module de notre programme complet."}
                        </p>
                      </div>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        </section>

        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
                Pour qui, <GradientText>quel que soit</GradientText> votre point de départ
              </h2>
            </Reveal>
            <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-3">
              <RevealItem>
                <div className="h-full rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                  <p className="font-semibold text-foreground">Vous démarrez de zéro</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Aucune expérience en immobilier n&apos;est nécessaire pour commencer.
                  </p>
                </div>
              </RevealItem>
              <RevealItem>
                <div className="h-full rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                  <p className="font-semibold text-foreground">Vous gérez déjà quelques biens</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Structurez votre activité pour arrêter de tout faire dans l&apos;urgence.
                  </p>
                </div>
              </RevealItem>
              <RevealItem>
                <div className="h-full rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                  <p className="font-semibold text-foreground">Vous visez le haut de gamme</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Découvrez comment on opère nous-mêmes une clientèle UHNW au quotidien.
                  </p>
                </div>
              </RevealItem>
            </RevealGroup>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
                Questions <GradientText>fréquentes</GradientText>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Accordion className="mt-10 w-full space-y-3">
                {FAQ.map((item) => (
                  <AccordionItem
                    key={item.q}
                    value={item.q}
                    className="rounded-2xl border border-border bg-card px-5 shadow-sm"
                  >
                    <AccordionTrigger className="py-5 text-left hover:no-underline">{item.q}</AccordionTrigger>
                    <AccordionContent className="pb-5 text-muted-foreground">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        <section
          className="relative overflow-hidden border-t border-border"
          style={{
            background:
              "radial-gradient(ellipse 420px 220px at 8% 65%, color-mix(in oklch, var(--gold) 28%, transparent), transparent 65%), " +
              "radial-gradient(ellipse 420px 220px at 92% 65%, color-mix(in oklch, var(--primary) 28%, transparent), transparent 65%), " +
              "linear-gradient(to bottom, transparent, transparent 80%, var(--muted) 130%)",
          }}
        >
          <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 sm:py-28">
            <Reveal>
              <h2 className="text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
                Ne laissez pas cette masterclass finir <GradientText>dans vos favoris</GradientText>
              </h2>
              <p className="mt-4 text-lg text-pretty text-muted-foreground">
                Prenez 5 minutes maintenant, pendant que vous y pensez.
              </p>
              <Button render={<a href="#inscription" />} nativeButton={false} size="lg" className="mt-8">
                Accéder à la masterclass gratuite
              </Button>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Formation Conciergerie —{" "}
          <Link href="/" className="underline-offset-2 hover:underline">
            Retour au site
          </Link>
        </div>
      </footer>
    </div>
  );
}
