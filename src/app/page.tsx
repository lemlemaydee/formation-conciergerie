import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Sprout, TrendingUp, Gem, Sparkles, ShieldCheck, LogIn } from "lucide-react";
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
import { ClientAvatars } from "@/components/landing/client-avatars";
import { MasterclassGate } from "@/app/masterclass/masterclass-gate";
import { RoadmapTimeline } from "@/app/masterclass/roadmap-timeline";
import { SuccessGrid } from "@/app/masterclass/success-grid";
import { ProofMarquee } from "@/app/masterclass/proof-marquee";
import { TestimonialCarousel } from "@/app/masterclass/testimonial-carousel";
import { ProfileHeader } from "@/app/masterclass/profile-header";
import { archivo, inter } from "@/app/masterclass/fonts";

export const metadata: Metadata = {
  title: "Formation gratuite — Formation Conciergerie",
  description: "Comment signer votre premier propriétaire et lancer votre conciergerie Airbnb, du studio à la villa de luxe.",
};

const BADGE_BLUE = "gap-1.5 border-primary/20 bg-primary/10 text-primary";

const CTA_GLOW: CSSProperties = {
  boxShadow: "0 10px 36px -6px color-mix(in oklch, var(--primary) 55%, transparent)",
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
    title: "Regardez la vidéo gratuitement",
    text: "Aucune inscription requise — la vidéo est visible directement sur cette page, sans rien à remplir.",
  },
  {
    title: "Recevez le programme complet (en option)",
    text: "Si vous voulez le programme détaillé par email, laissez vos coordonnées après la vidéo.",
  },
  {
    title: "Passez à l'action avec un plan clair",
    text: "Vous repartez avec la méthode et les 5 étapes pour signer votre premier propriétaire.",
  },
];

const FAQ = [
  {
    q: "La formation est-elle vraiment gratuite ?",
    a: "Oui, la vidéo est accessible directement sur cette page, sans rien à remplir. Vous pouvez en plus recevoir le programme complet par email si vous le souhaitez.",
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

export default async function Home() {
  const { videoUrl, posterUrl } = await getMasterclassVideo();

  return (
    <div
      className={`${inter.variable} ${archivo.variable} theme-masterclass-tokens theme-masterclass flex min-h-screen flex-col overflow-hidden`}
    >
      <main className="flex-1">
        <section id="inscription" className="mc-grid scroll-mt-20">
          <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-20 lg:px-8">
            <Reveal>
              <ProfileHeader />
            </Reveal>

            <Reveal delay={0.05} className="mt-6 flex flex-col items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge className={BADGE_BLUE}>
                  <span className="size-1.5 rounded-full bg-primary" />
                  Nouveau
                </Badge>
                <Badge className={BADGE_BLUE}>
                  <Sparkles className="size-3" />
                  Formation gratuite
                </Badge>
              </div>

              <h1 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-tight text-balance text-foreground sm:text-5xl">
                Comment signer votre premier <GradientText>propriétaire</GradientText> et lancer votre conciergerie
                Airbnb
              </h1>
              <Badge className={BADGE_BLUE}>
                <ShieldCheck className="size-3" />
                Aucune expérience requise
              </Badge>
            </Reveal>

            <Reveal delay={0.1} className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              <ClientAvatars total={100} shown={5} size={36} />
              <p className="text-sm font-medium text-muted-foreground">
                <span className="text-foreground">100+ propriétaires</span> nous font déjà confiance
              </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-10">
              <MasterclassGate videoUrl={videoUrl} posterUrl={posterUrl} />
            </Reveal>
          </div>
        </section>

        <Reveal>
          <ProofMarquee />
        </Reveal>

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

        <section className="mc-grid border-t border-border">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Badge className={BADGE_BLUE}>Témoignages</Badge>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
                Ce qu&apos;en disent <GradientText>nos élèves</GradientText>
              </h2>
            </Reveal>
            <div className="mt-12">
              <TestimonialCarousel />
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
              Emplacements réservés en attendant la publication de nos premiers vrais témoignages vidéo élèves.
            </p>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Badge className={BADGE_BLUE}>Résultats</Badge>
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
              <Badge className={BADGE_BLUE}>3 étapes</Badge>
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
                style={CTA_GLOW}
              >
                Regarder la vidéo gratuite
              </Button>
            </Reveal>
          </div>
        </section>

        <section className="mc-grid border-t border-border">
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
                    <AccordionTrigger className="py-5 text-left text-foreground hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-muted-foreground">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        <section className="mc-grid border-t border-border">
          <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 sm:py-28">
            <Reveal>
              <Badge className={BADGE_BLUE}>Démarrer</Badge>
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
                style={CTA_GLOW}
              >
                Regarder la vidéo gratuite
              </Button>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              FC
            </span>
            <span className="text-base font-semibold tracking-tight text-foreground">Formation Conciergerie</span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button render={<Link href="/connexion" />} nativeButton={false} variant="outline" size="sm">
              <LogIn className="size-3.5" />
              Connexion
            </Button>
            <Link
              href="/ancien-site"
              className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Voir le site complet
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Formation Conciergerie. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
