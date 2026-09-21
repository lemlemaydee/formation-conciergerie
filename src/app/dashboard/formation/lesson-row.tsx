"use client";

import { useTransition } from "react";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { toggleLessonDone } from "./actions";
import type { FormationLesson } from "@/lib/formation-data";

export function LessonRow({ lesson }: { lesson: FormationLesson }) {
  const [pending, startTransition] = useTransition();

  return (
    <li className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-muted/40">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => toggleLessonDone(lesson.id, !lesson.done))}
        className="flex min-w-0 items-center gap-3 text-left disabled:opacity-60"
      >
        {lesson.done ? (
          <CheckCircle2 className="size-4 shrink-0 text-emerald" />
        ) : (
          <Circle className="size-4 shrink-0 text-muted-foreground/50" />
        )}
        <span className={`truncate text-sm ${lesson.done ? "text-muted-foreground" : "text-foreground"}`}>
          {lesson.title}
        </span>
      </button>
      <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
        {lesson.durationLabel}
        <PlayCircle className="size-4" />
      </div>
    </li>
  );
}
