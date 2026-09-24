"use client";

import { useActionState } from "react";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { HeroVideo } from "@/components/landing/hero-video";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerForMasterclass, type RegisterState } from "@/app/masterclass/actions";

const initialState: RegisterState = { error: null, success: false };

export function MasterclassGate({ videoUrl, posterUrl }: { videoUrl: string | null; posterUrl: string | null }) {
  const [state, formAction, pending] = useActionState(registerForMasterclass, initialState);

  if (state.success) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-4 lg:mx-0 lg:max-w-none">
        <HeroVideo videoUrl={videoUrl} posterUrl={posterUrl} />
        <p className="flex items-center justify-center gap-1.5 text-center text-sm font-medium text-emerald">
          <CheckCircle2 className="size-4" />
          Inscription confirmée — la masterclass est à vous.
        </p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-xl lg:mx-0">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/15 via-gold/10 to-transparent blur-2xl" />
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
        <div className="mb-5 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Lock className="size-4" />
          Accès protégé — réservé aux inscrits
        </div>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mc-first-name">Prénom</Label>
            <Input id="mc-first-name" name="firstName" required autoComplete="given-name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mc-email">Email</Label>
            <Input id="mc-email" name="email" type="email" required autoComplete="email" />
          </div>
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={pending} nativeButton={true}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            Accéder à la masterclass gratuite
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            100% gratuit. Vos coordonnées ne sont jamais partagées.
          </p>
        </form>
      </div>
    </div>
  );
}
