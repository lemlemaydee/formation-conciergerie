import Link from "next/link";
import { ArrowRight, CalendarClock, CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { getFormationStructure, computeProgress } from "@/lib/formation-data";

export default async function DashboardPage() {
  const [profile, categories] = await Promise.all([getCurrentProfile(), getFormationStructure()]);
  const firstName = (profile?.full_name || profile?.email || "").split(/[ @]/)[0];
  const progress = computeProgress(categories);
  const nextLesson = categories.flatMap((c) => c.lessons.map((l) => ({ ...l, category: c.title }))).find(
    (l) => !l.done,
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {firstName ? `Bon retour, ${firstName}` : "Bon retour"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Voici où vous en êtes dans votre formation.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Progression globale</p>
            <span className="text-sm font-semibold text-primary">{progress.percent}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress.percent}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {progress.done} / {progress.total} leçons terminées
          </p>

          {nextLesson && (
            <div className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <PlayCircle className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{nextLesson.category}</p>
                  <p className="text-sm font-medium text-foreground">{nextLesson.title}</p>
                </div>
              </div>
              <Button size="sm" render={<Link href="/dashboard/formation" />} nativeButton={false}>
                Reprendre
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarClock className="size-4 text-primary" />
            Prochain live
          </div>
          <p className="mt-3 text-sm text-foreground">Q&amp;A Acquisition clients</p>
          <p className="text-xs text-muted-foreground">Jeudi 18h</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full"
            render={<Link href="/dashboard/lives" />}
            nativeButton={false}
          >
            Voir le calendrier
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Vos catégories</p>
          <Link
            href="/dashboard/formation"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Tout voir
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((category) => {
            const p = computeProgress([category]);
            return (
              <div key={category.title} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{category.title}</p>
                  {p.percent === 100 ? (
                    <CheckCircle2 className="size-4 text-emerald" />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {p.done}/{p.total}
                    </span>
                  )}
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${p.percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
