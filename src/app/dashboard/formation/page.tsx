import { getFormationStructure, computeProgress } from "@/lib/formation-data";
import { LessonRow } from "./lesson-row";

export default async function FormationLibraryPage() {
  const categories = await getFormationStructure();
  const overall = computeProgress(categories);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ma formation</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {overall.done} / {overall.total} leçons terminées — {overall.percent}%
        </p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${overall.percent}%` }} />
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
          Aucun contenu pour le moment. Il apparaîtra ici dès qu&apos;il sera ajouté depuis l&apos;admin.
        </p>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => {
            const p = computeProgress([category]);
            return (
              <div key={category.title} className="rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <p className="text-sm font-semibold text-foreground">{category.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {p.done}/{p.total} · {p.percent}%
                  </span>
                </div>
                <ul className="divide-y divide-border">
                  {category.lessons.map((lesson) => (
                    <LessonRow key={lesson.id} lesson={lesson} />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
