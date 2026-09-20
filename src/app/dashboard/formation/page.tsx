import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { MOCK_CATEGORIES, computeProgress } from "@/lib/mock-formation";

export default function FormationLibraryPage() {
  const overall = computeProgress(MOCK_CATEGORIES);

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

      <div className="space-y-4">
        {MOCK_CATEGORIES.map((category) => {
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
                  <li
                    key={lesson.title}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {lesson.done ? (
                        <CheckCircle2 className="size-4 shrink-0 text-emerald" />
                      ) : (
                        <Circle className="size-4 shrink-0 text-muted-foreground/50" />
                      )}
                      <span
                        className={`truncate text-sm ${lesson.done ? "text-muted-foreground" : "text-foreground"}`}
                      >
                        {lesson.title}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                      {lesson.duration}
                      <PlayCircle className="size-4" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-xs text-muted-foreground">
        Contenu d&apos;exemple — les vraies vidéos apparaîtront ici une fois ajoutées depuis l&apos;admin.
      </p>
    </div>
  );
}
