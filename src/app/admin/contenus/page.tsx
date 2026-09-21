import { createClient } from "@/lib/supabase/server";
import { ContentManager, type CategoryData } from "@/app/admin/contenus/content-manager";

export default async function AdminContenusPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select(
      `id, title, description, order_index,
       subcategories (
         id, title, order_index,
         lessons (
           id, title, description, video_url, duration_seconds, min_tier, is_published, order_index,
           lesson_resources ( id, title, file_url )
         )
       )`,
    )
    .order("order_index");

  const categories: CategoryData[] = (data ?? []).map((cat) => ({
    id: cat.id,
    title: cat.title,
    description: cat.description,
    subcategories: [...(cat.subcategories ?? [])]
      .sort((a, b) => a.order_index - b.order_index)
      .map((sub) => ({
        id: sub.id,
        title: sub.title,
        lessons: [...(sub.lessons ?? [])]
          .sort((a, b) => a.order_index - b.order_index)
          .map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            video_url: lesson.video_url,
            duration_seconds: lesson.duration_seconds,
            min_tier: lesson.min_tier,
            is_published: lesson.is_published,
            resources: lesson.lesson_resources ?? [],
          })),
      })),
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Contenus</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Catégories, sous-catégories, vidéos et ebooks de la formation.
        </p>
      </div>
      <ContentManager categories={categories} />
    </div>
  );
}
