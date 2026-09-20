"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { updateFullName, updatePassword, type AccountState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initialState: AccountState = { error: null, success: null };

export function AccountForms({ email, fullName }: { email: string; fullName: string }) {
  const [nameState, nameAction, namePending] = useActionState(updateFullName, initialState);
  const [pwdState, pwdAction, pwdPending] = useActionState(updatePassword, initialState);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Profil</h2>
        <form action={nameAction} className="mt-4 space-y-4">
          <FormAlert state={nameState} />
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input id="fullName" name="fullName" defaultValue={fullName} />
          </div>
          <Button type="submit" disabled={namePending}>
            {namePending ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </form>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Mot de passe</h2>
        <form action={pwdAction} className="mt-4 space-y-4">
          <FormAlert state={pwdState} />
          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input id="password" name="password" type="password" minLength={6} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" minLength={6} required />
          </div>
          <Button type="submit" disabled={pwdPending}>
            {pwdPending ? "Mise à jour…" : "Mettre à jour"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function FormAlert({ state }: { state: AccountState }) {
  if (state.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertDescription>{state.error}</AlertDescription>
      </Alert>
    );
  }
  if (state.success) {
    return (
      <Alert>
        <CheckCircle2 className="size-4" />
        <AlertDescription>{state.success}</AlertDescription>
      </Alert>
    );
  }
  return null;
}
