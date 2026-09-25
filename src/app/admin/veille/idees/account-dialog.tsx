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

const CATEGORY_ITEMS = {
  none: "Non classé",
  formateur: "Formateur / coach",
  conciergerie: "Conciergerie réelle",
};

export interface AccountDefaults {
  handle?: string;
  display_name?: string;
  category?: string;
  platform?: string;
  profile_url?: string;
  follower_count?: string;
  notes?: string;
}

export function AccountDialog({
  trigger,
  dialogTitle,
  action,
  defaults,
}: {
  trigger: ReactElement;
  dialogTitle: string;
  action: (prevState: SimpleState, formData: FormData) => Promise<SimpleState>;
  defaults?: AccountDefaults;
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>Un compte suivi dans la veille — ses vidéos pourront lui être reliées.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="handle">Compte (@handle)</Label>
              <Input id="handle" name="handle" placeholder="@dryxio_biz" defaultValue={defaults?.handle} required autoFocus />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="platform">Plateforme</Label>
              <Input id="platform" name="platform" defaultValue={defaults?.platform ?? "tiktok"} />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="display_name">Nom / marque (optionnel)</Label>
            <Input id="display_name" name="display_name" placeholder="Conciergerie Academy" defaultValue={defaults?.display_name} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="category">Catégorie</Label>
              <Select name="category" defaultValue={defaults?.category || "none"} items={CATEGORY_ITEMS}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Non classé</SelectItem>
                  <SelectItem value="formateur">Formateur / coach</SelectItem>
                  <SelectItem value="conciergerie">Conciergerie réelle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="follower_count">Abonnés (optionnel)</Label>
              <Input id="follower_count" name="follower_count" type="number" min="0" inputMode="numeric" defaultValue={defaults?.follower_count} />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="profile_url">Lien du profil (optionnel)</Label>
            <Input id="profile_url" name="profile_url" type="url" placeholder="https://www.tiktok.com/@…" defaultValue={defaults?.profile_url} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="notes">Notes de positionnement (optionnel)</Label>
            <Textarea id="notes" name="notes" placeholder="Ce qui différencie ce compte, son angle…" defaultValue={defaults?.notes} rows={3} />
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
