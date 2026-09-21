import { createClient } from "@/lib/supabase/server";
import { Reveal } from "@/components/landing/reveal";
import { GradientText } from "@/components/landing/gradient-text";
import { VideoCarousel } from "@/components/ui/video-carousel";

export async function VideoTestimonialsSection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("video_testimonials")
    .select("id, name, role, video_url, poster_url")
    .eq("is_active", true)
    .order("order_index");

  if (!data || data.length === 0) return null;

  const items = data.map((t) => ({
    id: t.id,
    videoUrl: t.video_url,
    posterUrl: t.poster_url,
    name: t.name,
    role: t.role,
  }));

  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
            En <GradientText>vidéo</GradientText>, de vive voix
          </h2>
          <p className="mt-4 text-lg text-pretty text-muted-foreground">
            Nos élèves racontent leur lancement, dans leurs mots.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <VideoCarousel items={items} />
        </Reveal>
      </div>
    </section>
  );
}
