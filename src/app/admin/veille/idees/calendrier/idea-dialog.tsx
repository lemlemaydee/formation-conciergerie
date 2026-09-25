"use client";

import { useActionState, useState, cloneElement, type ReactElement } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SimpleState } from "@/app/admin/veille/idees/calendrier/actions";
import { CATEGORY_LABELS, FUNNEL_STAGE_LABELS } from "@/app/admin/veille/idees/calendrier/constants";

export interface CalendarIdeaDefaults {
  title?: string;
  angle?: string;
  category?: string;
  funnel_stage?: string;
  format_inspiration?: string;
  pain_point?: string;
  inspired_by?: string;
  suggested_hook?: string;
  script?: string;
}

export function CalendarIdeaDialog({
  trigger,
  dialogTitle,
  action,
  defaults,
}: {
  trigger: ReactElement;
  dialogTitle: string;
  action: (prevState: SimpleState, formData: FormData) => Promise<SimpleState>;
  defaults?: CalendarIdeaDefaults;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(action, { error: null, success: false });

  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success) setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {cloneElement(trigger, { onClick: () => setOpen(true) } as React.HTMLAttributes<HTMLElement>)}
      <DialogContent className="max-h-[88vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>Une idée de vidéo originale pour Formation Conciergerie.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="title">Titre de l&apos;idée</Label>
            <Input id="title" name="title" defaultValue={defaults?.title} required autoFocus />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="angle">Angle</Label>
            <Textarea
              id="angle"
              name="angle"
              placeholder="Ce que la vidéo raconte, avec vos vrais chiffres et votre vraie histoire…"
              defaultValue={defaults?.angle}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="category">Catégorie</Label>
              <Select name="category" defaultValue={defaults?.category || "conciergerie"} items={CATEGORY_LABELS}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="funnel_stage">Étape de tunnel</Label>
              <Select name="funnel_stage" defaultValue={defaults?.funnel_stage || "general"} items={FUNNEL_STAGE_LABELS}>
                <SelectTrigger id="funnel_stage" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FUNNEL_STAGE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="format_inspiration">Format inspiré de</Label>
              <Input id="format_inspiration" name="format_inspiration" placeholder="Liste numérotée, storytelling…" defaultValue={defaults?.format_inspiration} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pain_point">Pain point ciblé</Label>
              <Input id="pain_point" name="pain_point" placeholder="Ce qui bloque le spectateur…" defaultValue={defaults?.pain_point} />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="inspired_by">Inspiré par (comptes / patterns observés)</Label>
            <Input id="inspired_by" name="inspired_by" placeholder="Ex : pattern de questions chez @maisonbleue_…" defaultValue={defaults?.inspired_by} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="suggested_hook">Accroche suggérée (originale)</Label>
            <Textarea id="suggested_hook" name="suggested_hook" defaultValue={defaults?.suggested_hook} rows={2} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="script">Notre script (à écrire)</Label>
            <Textarea
              id="script"
              name="script"
              placeholder="Une fois l'idée validée, rédigez ici votre propre script…"
              defaultValue={defaults?.script}
              rows={5}
            />
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={pending} nativeButton={true}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
