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
import type { SimpleState } from "@/app/admin/veille/idees/actions";

export interface IdeaDefaults {
  title?: string;
  hook?: string;
  topic?: string;
  pain_point?: string;
  format?: string;
  source_label?: string;
  source_url?: string;
  performance_note?: string;
  script?: string;
}

export function IdeaDialog({
  trigger,
  dialogTitle,
  action,
  defaults,
}: {
  trigger: ReactElement;
  dialogTitle: string;
  action: (prevState: SimpleState, formData: FormData) => Promise<SimpleState>;
  defaults?: IdeaDefaults;
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
          <DialogDescription>Une idée de vidéo : son accroche, le sujet et le pain point qu&apos;elle adresse.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="title">Titre de l&apos;idée</Label>
            <Input id="title" name="title" defaultValue={defaults?.title} required autoFocus />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="hook">Accroche (hook)</Label>
            <Textarea
              id="hook"
              name="hook"
              placeholder="La phrase qui capte l'attention dans les 2 premières secondes…"
              defaultValue={defaults?.hook}
              rows={2}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="topic">Sujet</Label>
              <Input id="topic" name="topic" placeholder="Prospection téléphonique…" defaultValue={defaults?.topic} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="format">Format</Label>
              <Input id="format" name="format" placeholder="Témoignage chiffré, POV, tutoriel…" defaultValue={defaults?.format} />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="pain_point">Pain point client adressé</Label>
            <Input
              id="pain_point"
              name="pain_point"
              placeholder="Ce qui bloque ou fait peur au spectateur…"
              defaultValue={defaults?.pain_point}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="source_label">Source / inspiration</Label>
              <Input id="source_label" name="source_label" placeholder="@compte — contexte" defaultValue={defaults?.source_label} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="performance_note">Performance observée</Label>
              <Input id="performance_note" name="performance_note" placeholder="296K vues, 312 abonnés…" defaultValue={defaults?.performance_note} />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="source_url">Lien de la vidéo source (optionnel)</Label>
            <Input id="source_url" name="source_url" type="url" placeholder="https://www.tiktok.com/…" defaultValue={defaults?.source_url} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="script">Script / notes (optionnel)</Label>
            <Textarea
              id="script"
              name="script"
              placeholder="Brouillon de script, plan, notes de tournage…"
              defaultValue={defaults?.script}
              rows={4}
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
