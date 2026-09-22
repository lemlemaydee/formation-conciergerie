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

export function TitleEditDialog({
  trigger,
  dialogTitle,
  dialogDescription,
  action,
  defaultTitle = "",
  defaultDescription,
  withDescription = false,
}: {
  trigger: ReactElement;
  dialogTitle: string;
  dialogDescription: string;
  action: (prevState: SimpleState, formData: FormData) => Promise<SimpleState>;
  defaultTitle?: string;
  defaultDescription?: string;
  withDescription?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(action, { error: null, success: false });

  // Ferme le dialog dès qu'une soumission réussit, sans passer par un effect
  // (voir https://react.dev/learn/you-might-not-need-an-effect) : on détecte
  // le changement d'état pendant le rendu, comme pour une prop qui change.
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
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" name="title" defaultValue={defaultTitle} required autoFocus />
          </div>
          {withDescription && (
            <div className="grid gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={defaultDescription} rows={3} />
            </div>
          )}
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
