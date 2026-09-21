"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { CheckCircle2, AlertCircle, Clock3 } from "lucide-react";
import { getUpcomingDays } from "@/lib/booking";
import { getSlotsForDate, createBooking, type BookingState } from "./booking-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const DAYS = getUpcomingDays();
const initialState: BookingState = { error: null, success: false };

export function BookingWidget() {
  const [selectedDay, setSelectedDay] = useState(DAYS[0].iso);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, startLoadingSlots] = useTransition();
  const [state, formAction, pending] = useActionState(createBooking, initialState);

  useEffect(() => {
    startLoadingSlots(async () => {
      const available = await getSlotsForDate(selectedDay);
      setSlots(available);
    });
  }, [selectedDay]);

  if (state.success) {
    return (
      <Alert>
        <CheckCircle2 className="size-4" />
        <AlertDescription>
          Créneau réservé ! Vous recevrez les détails de connexion par email avant l&apos;appel.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-w-0 space-y-5">
      <div className="min-w-0">
        <p className="mb-2 text-sm font-medium text-foreground">Choisissez un jour</p>
        <div className="flex min-w-0 gap-2 overflow-x-auto pb-2">
          {DAYS.map((day) => (
            <button
              key={day.iso}
              type="button"
              onClick={() => {
                setSelectedDay(day.iso);
                setSelectedSlot(null);
              }}
              className={cn(
                "shrink-0 rounded-lg border px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors",
                selectedDay === day.iso
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Clock3 className="size-3.5" />
          Choisissez un horaire (30 min)
        </p>
        {loadingSlots ? (
          <p className="text-sm text-muted-foreground">Chargement des disponibilités…</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-muted-foreground">Plus de créneau disponible ce jour-là.</p>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors",
                  selectedSlot === slot
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/50",
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedSlot && (
        <form action={formAction} className="space-y-4 border-t border-border pt-5">
          <input type="hidden" name="slotDate" value={selectedDay} />
          <input type="hidden" name="slotTime" value={selectedSlot} />

          {state.error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input id="firstName" name="firstName" required autoComplete="given-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input id="lastName" name="lastName" required autoComplete="family-name" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input id="phone" name="phone" type="tel" required autoComplete="tel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire</Label>
            <textarea
              id="comment"
              name="comment"
              rows={3}
              placeholder="Nombre de biens gérés, sujet à aborder…"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Réservation…" : `Confirmer le ${DAYS.find((d) => d.iso === selectedDay)?.label} à ${selectedSlot}`}
          </Button>
        </form>
      )}
    </div>
  );
}
