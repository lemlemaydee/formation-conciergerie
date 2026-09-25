import type { Metadata } from "next";
import Link from "next/link";
import { Sprout, TrendingUp, Gem, Sparkles, ShieldCheck, Gift, TrendingUp as TrendingUpIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { archivo, inter } from "@/app/masterclass/fonts";
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
import { ClientAvatars } from "@/components/landing/client-avatars";
import { MasterclassGate } from "@/app/masterclass/masterclass-gate";
import { RoadmapTimeline } from "@/app/masterclass/roadmap-timeline";
import { SuccessGrid } from "@/app/masterclass/success-grid";

export const metadata: Metadata = {
  title: "Formation gratuite — Formation Conciergerie",
  description: "Comment signer votre premier propriétaire et lancer votre conciergerie Airbnb, du studio à la villa de luxe.",
};

const POUR_QUI = [
  {
    icon: Sprout,
    title: "Vous démarrez de zéro",
    text: "Aucune expérience en immobilier n'est nécessaire — la méthode vous fait poser vos premières actions concrètes dès la fin de la vidéo.",
  },
  {
    icon: TrendingUp,
    title: "Vous gérez déjà quelques biens",
    text: "Vous jonglez avec plusieurs annonces sans process clair ? Structurez votre activité pour arrêter de tout gérer dans l'urgence.",
  },
  {
    icon: Gem,
    title: "Vous visez le haut de gamme",
    text: "Découvrez comment on opère nous-mêmes des biens d'exception, pour une clientèle exigeante, entre Monaco et la Côte d'Azur.",
  },
];

const STEPS_ACCES = [
  {
    title: "Inscrivez-vous en 2 minutes",
    text: "Prénom, nom, email et téléphone — aucune expérience ni bien en gestion n'est requis.",
  },
  {
    title: "Débloquez la vidéo immédiatement",
    text: "Vous accédez à la formation complète dès votre inscription, sans attente et sans email à confirmer.",
  },
  {
    title: "Passez à l'action avec un plan clair",
    text: "Vous repartez avec la méthode et les 5 étapes pour signer votre premier propriétaire.",
  },
];

const FAQ = [
  {
    q: "La formation est-elle vraiment gratuite ?",
    a: "Oui, entièrement gratuite et sans engagement — on vous demande juste un prénom et un email pour vous donner l'accès.",
  },
  {
    q: "Faut-il déjà avoir de l'expérience en immobilier ?",
    a: "Non. Cette formation est pensée aussi bien pour un débutant complet que pour quelqu'un qui gère déjà quelques biens et veut structurer son activité.",
  },
  {
    q: "Je vais devoir acheter quelque chose après ?",
    a: "Non, aucune obligation. Si la méthode vous parle, vous pourrez ensuite découvrir nos formules — mais la vidéo se suffit à elle-même.",
  },
  {
    q: "Qui la présente ?",
    a: "Mehdi et Jacques, les deux fondateurs de Formation Conciergerie — ils gèrent eux-mêmes plus de 120 biens entre Monaco et la Côte d'Azur.",
  },
  {
    q: "Combien de temps faut-il pour voir des résultats ?",
    a: "Ça dépend surtout de votre implication et de votre marché — la vidéo vous montre la méthode, pas un raccourci magique. Certains signent leur premier propriétaire en quelques semaines en y consacrant du temps chaque jour.",
  },
  {
    q: "Le marché n'est-il pas déjà saturé ?",
    a: "Il y a plus de propriétaires qui cherchent un gestionnaire sérieux que de conciergeries capables de bien les servir — surtout sur le haut de gamme, où l'exigence est plus forte et la concurrence plus rare.",
  },
  {
    q: "Puis-je le faire en parallèle de mon emploi actuel ?",
    a: "Oui, c'est justement pensé pour ça : vous avancez à votre rythme, en parallèle de votre activité actuelle, jusqu'à votre premier bien géré.",
  },
];

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
  const { videoUrl, posterUrl } = await getMasterclassVideo();

  return (
    <div
      className={`${inter.variable} ${archivo.variable} theme-masterclass-tokens theme-masterclass flex min-h-screen flex-col overflow-hidden`}
    >
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-center px-4 sm:px-6 lg:px-8">
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
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
            <Reveal className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald" />
                  Nouveau
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <Sparkles className="size-3" />
                  Formation gratuite
                </Badge>
              </div>

              <h1 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-tight text-balance text-foreground sm:text-5xl">
                Comment signer votre premier <GradientText>propriétaire</GradientText> et lancer votre conciergerie
                Airbnb
              </h1>
              <p className="mx-auto max-w-xl text-lg text-pretty text-muted-foreground">
                La méthode exacte de Mehdi &amp; Jacques, qui gèrent déjà 120+ biens entre Monaco et la Côte
                d&apos;Azur — du studio à la villa de luxe.
              </p>
              <Badge variant="secondary" className="gap-1.5 bg-gold text-gold-foreground">
                <ShieldCheck className="size-3" />
                Aucune expérience requise
              </Badge>
            </Reveal>

            <Reveal delay={0.1} className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              <ClientAvatars total={50} shown={5} size={36} />
              <p className="text-sm font-medium text-muted-foreground">
                <span className="text-foreground">50+ propriétaires</span> nous font déjà confiance
              </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-10">
              <MasterclassGate videoUrl={videoUrl} posterUrl={posterUrl} />
            </Reveal>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
            <Reveal className="flex flex-col items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                <Gift className="size-6" />
              </span>
              <Badge variant="outline">Aucun piège</Badge>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
                Pourquoi cette formation est <GradientText>gratuite</GradientText>
              </h2>
              <p className="max-w-xl text-lg text-pretty text-muted-foreground">
                On ne vous vend rien sur cette page. On préfère vous montrer notre méthode plutôt que vous en parler —
                si elle vous convainc, vous pourrez ensuite découvrir nos formations complètes, sans aucune
                obligation.
              </p>
              <p className="text-lg font-bold text-foreground">
                Vous gagnez du temps, on vous démontre qu&apos;on sait de quoi on parle.
              </p>
            </Reveal>
          </div>
        </section>

        <section
          className="border-t border-border bg-muted/40"
        >
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Badge variant="outline">Résultats</Badge>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
                Des profils différents, <GradientText>un même point de départ</GradientText>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Voici ce que certains de nos élèves ont obtenu en appliquant la méthode.
              </p>
            </Reveal>
            <div className="mt-12">
              <SuccessGrid />
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">
              Résultats individuels présentés à titre d&apos;exemple. Ils dépendent du marché, du temps investi et de
              l&apos;application de la méthode, et ne constituent pas une promesse de résultat identique.
            </p>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
                Ce que vous allez <GradientText>découvrir</GradientText>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                5 étapes, de votre première recherche à votre premier propriétaire signé.
              </p>
            </Reveal>

            <div className="mt-12">
              <RoadmapTimeline />
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/40">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Badge variant="outline">3 étapes</Badge>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
                Comment accéder à la <GradientText>formation</GradientText>
              </h2>
            </Reveal>

            <RevealGroup className="mt-12 grid grid-cols-1 gap-5">
              {STEPS_ACCES.map((step, i) => (
                <RevealItem key={step.title}>
                  <div className="flex items-start gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <span
                      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground"
                      style={{ boxShadow: "0 0 24px color-mix(in oklch, var(--primary) 45%, transparent)" }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-lg font-bold text-foreground">{step.title}</p>
                      <p className="mt-1 text-muted-foreground">{step.text}</p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.1} className="mt-10 text-center">
              <Button
                render={<a href="#inscription" />}
                nativeButton={false}
                size="lg"
                className="h-14 px-8 text-base font-semibold"
              >
                Accéder à la formation gratuite
              </Button>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
                Pour qui, <GradientText>quel que soit</GradientText> votre point de départ
              </h2>
            </Reveal>
            <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {POUR_QUI.map((item) => (
                <RevealItem key={item.title} className="group relative h-full">
                  <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="h-full rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                    <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                      <item.icon className="size-6" />
                    </span>
                    <p className="mt-4 font-semibold text-foreground">{item.title}</p>
                    <p className="mt-2 text-sm text-foreground/75">{item.text}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        <section className="border-t border-border bg-muted/40">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="gap-1.5">
                <TrendingUpIcon className="size-3" />
                Pourquoi maintenant
              </Badge>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
                Le marché n&apos;a jamais été aussi <GradientText>favorable</GradientText>
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mx-auto mt-8 max-w-2xl space-y-5 text-center text-lg text-muted-foreground">
              <p>
                De plus en plus de propriétaires cherchent quelqu&apos;un de sérieux pour gérer leur bien — ils
                n&apos;ont ni le temps ni l&apos;envie de s&apos;en occuper eux-mêmes.
              </p>
              <p>
                Le nombre de locations courte durée continue de progresser chaque année, en France comme sur la Côte
                d&apos;Azur. Ce qui manque, ce ne sont pas les biens à gérer : ce sont les conciergeries capables de
                bien le faire.
              </p>
              <p className="text-xl font-bold text-foreground">
                Ce n&apos;est pas une question de travailler plus dur. C&apos;est une question de structurer
                correctement, dès le début.
              </p>
            </Reveal>
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
              "radial-gradient(ellipse 420px 220px at 8% 65%, color-mix(in oklch, var(--gold) 22%, transparent), transparent 65%), " +
              "radial-gradient(ellipse 420px 220px at 92% 65%, color-mix(in oklch, var(--primary) 30%, transparent), transparent 65%)",
          }}
        >
          <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 sm:py-28">
            <Reveal>
              <Badge variant="outline">Démarrer</Badge>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
                Ne laissez pas cette formation finir <GradientText>dans vos favoris</GradientText>
              </h2>
              <p className="mt-4 text-lg text-pretty text-muted-foreground">
                Prenez 5 minutes maintenant, pendant que vous y pensez.
              </p>
              <Button
                render={<a href="#inscription" />}
                nativeButton={false}
                size="lg"
                className="mt-8 h-14 px-8 text-base font-semibold"
              >
                Accéder à la formation gratuite
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
