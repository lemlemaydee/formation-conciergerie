"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMonthGrid, toISODate, BOOKING_WINDOW_DAYS } from "@/lib/booking";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function CalendarPicker({
  selectedIso,
  onSelect,
}: {
  selectedIso: string | null;
  onSelect: (iso: string) => void;
}) {
  const today = startOfDay(new Date());
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + BOOKING_WINDOW_DAYS);

  const [viewDate, setViewDate] = useState(() => startOfMonth(today));

  const cells = getMonthGrid(viewDate.getFullYear(), viewDate.getMonth());
  const monthLabel = viewDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const canGoPrev = startOfMonth(viewDate) > startOfMonth(today);
  const canGoNext = startOfMonth(viewDate) < startOfMonth(maxDate);

  return (
    <div className="w-full min-w-0">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
          disabled={!canGoPrev}
          aria-label="Mois précédent"
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="text-sm font-semibold text-foreground capitalize">{monthLabel}</p>
        <button
          type="button"
          onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
          disabled={!canGoNext}
          aria-label="Mois suivant"
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={i} className="py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;
          const iso = toISODate(date);
          const disabled = date < today || date > maxDate;
          const selected = iso === selectedIso;
          const isToday = date.getTime() === today.getTime();

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(iso)}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition-colors",
                disabled && "pointer-events-none text-muted-foreground/30",
                !disabled && !selected && "text-foreground hover:bg-muted",
                selected && "bg-primary text-primary-foreground",
                !selected && isToday && !disabled && "ring-1 ring-inset ring-primary/40",
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
