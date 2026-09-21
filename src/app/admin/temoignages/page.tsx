import { createClient } from "@/lib/supabase/server";
import { TestimonialList } from "@/app/admin/temoignages/testimonial-list";

export default async function AdminTemoignagesPage() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("video_testimonials")
    .select("id, name, role, video_url, poster_url, is_active")
    .order("order_index");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Témoignages vidéo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vidéos verticales (9:16) affichées en carrousel sous la section avis de la landing page.
        </p>
      </div>
      <TestimonialList testimonials={testimonials ?? []} />
    </div>
  );
}
