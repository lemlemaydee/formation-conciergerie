import { createClient } from "@/lib/supabase/server";

export interface FormationLesson {
  id: string;
  title: string;
  durationLabel: string;
  done: boolean;
}

export interface FormationCategory {
  title: string;
  lessons: FormationLesson[];
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

export async function getFormationStructure(): Promise<FormationCategory[]> {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select(
      "title, order_index, subcategories(id, title, order_index, lessons(id, title, duration_seconds, order_index, is_published))",
    )
    .order("order_index");

  if (error || !categories) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let doneLessonIds = new Set<string>();
  if (user) {
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id);
    doneLessonIds = new Set((progress ?? []).map((p) => p.lesson_id));
  }

  return categories.map((category) => {
    const subcategories = [...(category.subcategories ?? [])].sort(
      (a, b) => a.order_index - b.order_index,
    );

    const lessons = subcategories.flatMap((sub) =>
      [...(sub.lessons ?? [])]
        .filter((l) => l.is_published)
        .sort((a, b) => a.order_index - b.order_index)
        .map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          durationLabel: formatDuration(lesson.duration_seconds),
          done: doneLessonIds.has(lesson.id),
        })),
    );

    return { title: category.title, lessons };
  });
}

export function computeProgress(categories: FormationCategory[]) {
  const all = categories.flatMap((c) => c.lessons);
  const done = all.filter((l) => l.done).length;
  const total = all.length;
  return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}
