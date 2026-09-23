import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/landing/gradient-text";
import { Reveal } from "@/components/landing/reveal";
import { HeroVideo } from "@/components/landing/hero-video";
import { createClient } from "@/lib/supabase/server";

async function getHeroVideo() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("hero_video_url, hero_video_poster_url")
    .limit(1)
    .single();
  return { videoUrl: data?.hero_video_url ?? null, posterUrl: data?.hero_video_poster_url ?? null };
}

export async function Hero() {
  const { videoUrl, posterUrl } = await getHeroVideo();

  return (
    <section className="overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1.2fr] lg:gap-10 lg:py-32 lg:px-8">
        <Reveal className="text-center lg:text-left">
          <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            Formation conciergerie Airbnb
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            La méthode d&apos;une conciergerie qui gère déjà{" "}
            <GradientText>120+ biens</GradientText>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted-foreground lg:mx-0">
            Formation créée par des opérateurs actifs, pas par des formateurs
            qui ont arrêté de pratiquer. Ce qu&apos;on vous montre, c&apos;est
            ce qu&apos;on applique nous-mêmes, du studio à la villa de luxe.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button render={<Link href="/formation" />} nativeButton={false} size="lg" className="w-full sm:w-auto">
              Voir les formules
            </Button>
            <Button
              render={<Link href="#programme" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Voir le programme
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <HeroVideo videoUrl={videoUrl} posterUrl={posterUrl} />
        </Reveal>
      </div>
    </section>
  );
}
