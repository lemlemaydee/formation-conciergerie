"use client";

import { useActionState, useState } from "react";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { HeroVideo } from "@/components/landing/hero-video";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { registerForMasterclass, type RegisterState } from "@/app/masterclass/actions";

const initialState: RegisterState = { error: null, success: false };

export function MasterclassGate({ videoUrl, posterUrl }: { videoUrl: string | null; posterUrl: string | null }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(registerForMasterclass, initialState);

  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success) setOpen(false);
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="relative overflow-hidden rounded-2xl">
        <HeroVideo videoUrl={state.success ? videoUrl : null} posterUrl={state.success ? posterUrl : null} />

        {!state.success && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/85 px-6 text-center backdrop-blur-sm">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Lock className="size-6" />
            </span>
            <p className="max-w-xs text-sm text-muted-foreground">
              Entrez vos coordonnées pour débloquer la vidéo immédiatement.
            </p>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger
                render={<Button size="lg" className="h-14 px-8 text-base font-semibold" nativeButton={true} />}
              >
                Accéder à la formation gratuite
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Accédez à la formation gratuite</DialogTitle>
                  <DialogDescription>Entrez vos coordonnées, la vidéo se débloque juste après.</DialogDescription>
                </DialogHeader>
                <form action={formAction} className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="mc-first-name">Prénom</Label>
                      <Input id="mc-first-name" name="firstName" required autoComplete="given-name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mc-last-name">Nom</Label>
                      <Input id="mc-last-name" name="lastName" required autoComplete="family-name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mc-email">Email</Label>
                    <Input id="mc-email" name="email" type="email" required autoComplete="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mc-phone">Téléphone</Label>
                    <Input id="mc-phone" name="phone" type="tel" required autoComplete="tel" />
                  </div>
                  {state.error && <p className="text-sm text-destructive">{state.error}</p>}
                  <DialogFooter>
                    <Button type="submit" disabled={pending} nativeButton={true} className="w-full sm:w-auto">
                      {pending && <Loader2 className="size-4 animate-spin" />}
                      Débloquer la vidéo
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {state.success && (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-sm font-medium text-emerald">
          <CheckCircle2 className="size-4" />
          Inscription confirmée — la formation est à vous.
        </p>
      )}
    </div>
  );
}
