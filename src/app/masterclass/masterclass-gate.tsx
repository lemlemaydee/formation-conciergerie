"use client";

import { useActionState, useState } from "react";
import { Loader2, CheckCircle2, Mail } from "lucide-react";
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
import { archivo, inter } from "@/app/masterclass/fonts";

const initialState: RegisterState = { error: null, success: false };

const CTA_GLOW = { boxShadow: "0 10px 36px -6px color-mix(in oklch, var(--primary) 55%, transparent)" };

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
      <HeroVideo videoUrl={videoUrl} posterUrl={posterUrl} />

      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        {state.success ? (
          <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-emerald">
            <CheckCircle2 className="size-4" />
            Merci ! Vous recevrez le programme complet par email.
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Envie d&apos;aller plus loin ? Recevez le programme complet par email.
            </p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger
                render={
                  <Button size="lg" className="h-14 px-8 text-base font-semibold" style={CTA_GLOW} nativeButton={true} />
                }
              >
                <Mail className="size-4" />
                Recevoir le programme complet
              </DialogTrigger>
              <DialogContent
                className={`${inter.variable} ${archivo.variable} theme-masterclass-tokens sm:max-w-md`}
              >
                <DialogHeader>
                  <DialogTitle>Recevez le programme complet</DialogTitle>
                  <DialogDescription>Entrez vos coordonnées, on vous envoie tout par email.</DialogDescription>
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
                      Envoyer
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}
