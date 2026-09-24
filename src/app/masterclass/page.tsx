import type { Metadata } from "next";
import Link from "next/link";
import { Sprout, TrendingUp, Gem } from "lucide-react";
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
        <section
          id="inscription"
          className="scroll-mt-20"
          style={{
            background:
              "radial-gradient(ellipse 900px 500px at 50% -10%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 70%)",
          }}
        >
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
            <Reveal>
              <Badge variant="outline">Formation gratuite</Badge>
              <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight text-balance text-foreground sm:text-5xl">
                Comment signer votre premier <GradientText>propriétaire</GradientText> et lancer votre conciergerie
                Airbnb
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
                La méthode exacte de Mehdi &amp; Jacques, qui gèrent déjà 120+ biens entre Monaco et la Côte
                d&apos;Azur — du studio à la villa de luxe.
              </p>
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

        <section
          className="border-t border-border bg-muted/30"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklch, var(--primary) 5%, transparent), transparent 25%), var(--muted)",
          }}
        >
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

        <section className="border-t border-border">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
                Pour qui, <GradientText>quel que soit</GradientText> votre point de départ
              </h2>
            </Reveal>
            <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {POUR_QUI.map((item) => (
                <RevealItem key={item.title}>
                  <div className="h-full rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="size-5" />
                    </span>
                    <p className="mt-4 font-semibold text-foreground">{item.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        <section className="border-t border-border bg-muted/30">
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
                Ne laissez pas cette formation finir <GradientText>dans vos favoris</GradientText>
              </h2>
              <p className="mt-4 text-lg text-pretty text-muted-foreground">
                Prenez 5 minutes maintenant, pendant que vous y pensez.
              </p>
              <Button render={<a href="#inscription" />} nativeButton={false} size="lg" className="mt-8">
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
