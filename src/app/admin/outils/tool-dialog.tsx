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
import type { SimpleState } from "@/app/admin/contenus/actions";

export interface ToolDefaults {
  name?: string;
  description?: string;
  url?: string;
  category?: string;
}

export function ToolDialog({
  trigger,
  dialogTitle,
  action,
  defaults,
}: {
  trigger: ReactElement;
  dialogTitle: string;
  action: (prevState: SimpleState, formData: FormData) => Promise<SimpleState>;
  defaults?: ToolDefaults;
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
      <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>Outil proposé aux élèves, avec ton lien affilié.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" defaultValue={defaults?.name} required autoFocus />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="url">Lien affilié</Label>
            <Input id="url" name="url" type="url" placeholder="https://..." defaultValue={defaults?.url} required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="category">Catégorie</Label>
            <Input id="category" name="category" placeholder="Channel manager, ménage…" defaultValue={defaults?.category} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={defaults?.description} rows={2} />
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
