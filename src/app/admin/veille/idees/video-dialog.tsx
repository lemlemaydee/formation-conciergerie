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
import type { SimpleState } from "@/app/admin/veille/idees/actions";
import type { AccountRow } from "@/app/admin/veille/idees/types";

export interface VideoDefaults {
  account_id?: string | null;
  title?: string;
  hook?: string;
  topic?: string;
  pain_point?: string;
  comment_themes?: string;
  format?: string;
  video_url?: string;
  posted_at?: string;
  view_count?: string;
  like_count?: string;
  comment_count?: string;
  share_count?: string;
  stats_captured_at?: string;
  performance_note?: string;
  content_summary?: string;
  script?: string;
}

export function VideoDialog({
  trigger,
  dialogTitle,
  action,
  accounts,
  defaults,
}: {
  trigger: ReactElement;
  dialogTitle: string;
  action: (prevState: SimpleState, formData: FormData) => Promise<SimpleState>;
  accounts: AccountRow[];
  defaults?: VideoDefaults;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(action, { error: null, success: false });

  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success) setOpen(false);
  }

  const accountItems = {
    none: "Aucun compte",
    ...Object.fromEntries(accounts.map((a) => [a.id, `${a.handle}${a.display_name ? ` — ${a.display_name}` : ""}`])),
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {cloneElement(trigger, { onClick: () => setOpen(true) } as React.HTMLAttributes<HTMLElement>)}
      <DialogContent className="max-h-[88vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>Une vidéo repérée chez un concurrent : son accroche, ses stats, ce que ses viewers cherchent.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="account_id">Compte</Label>
            <Select name="account_id" defaultValue={defaults?.account_id ?? "none"} items={accountItems}>
              <SelectTrigger id="account_id" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun compte</SelectItem>
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.handle}
                    {a.display_name ? ` — ${a.display_name}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="title">Titre de la vidéo</Label>
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
              <Label htmlFor="video_url">Lien de la vidéo (optionnel)</Label>
              <Input id="video_url" name="video_url" type="url" placeholder="https://www.tiktok.com/…" defaultValue={defaults?.video_url} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="posted_at">Date de publication</Label>
              <Input id="posted_at" name="posted_at" type="date" defaultValue={defaults?.posted_at} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-3">
            <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase">Statistiques relevées</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="grid gap-1.5">
                <Label htmlFor="view_count" className="text-xs">Vues</Label>
                <Input id="view_count" name="view_count" type="number" min="0" inputMode="numeric" defaultValue={defaults?.view_count} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="like_count" className="text-xs">Likes</Label>
                <Input id="like_count" name="like_count" type="number" min="0" inputMode="numeric" defaultValue={defaults?.like_count} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="comment_count" className="text-xs">Commentaires</Label>
                <Input id="comment_count" name="comment_count" type="number" min="0" inputMode="numeric" defaultValue={defaults?.comment_count} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="share_count" className="text-xs">Partages</Label>
                <Input id="share_count" name="share_count" type="number" min="0" inputMode="numeric" defaultValue={defaults?.share_count} />
              </div>
            </div>
            <div className="mt-3 grid gap-1.5">
              <Label htmlFor="stats_captured_at" className="text-xs">Relevées le</Label>
              <Input id="stats_captured_at" name="stats_captured_at" type="date" defaultValue={defaults?.stats_captured_at} className="max-w-48" />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="comment_themes">Ce que cherchent les viewers (thèmes des commentaires)</Label>
            <Textarea
              id="comment_themes"
              name="comment_themes"
              placeholder="Ex : beaucoup demandent le prix, doutent que ça marche sans expérience…"
              defaultValue={defaults?.comment_themes}
              rows={3}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="content_summary">Résumé structuré de la vidéo</Label>
            <Textarea
              id="content_summary"
              name="content_summary"
              placeholder="Plan de la vidéo, arguments clés, call-to-action — vos mots, pas un copier-coller du script d'origine."
              defaultValue={defaults?.content_summary}
              rows={4}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="performance_note">Note libre (optionnel)</Label>
            <Input
              id="performance_note"
              name="performance_note"
              placeholder="Toute observation rapide non structurée…"
              defaultValue={defaults?.performance_note}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="script">Notre script / notes (optionnel)</Label>
            <Textarea
              id="script"
              name="script"
              placeholder="Brouillon de NOTRE propre script inspiré de cette idée, plan, notes de tournage…"
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
