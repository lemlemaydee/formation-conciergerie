"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle, MailCheck } from "lucide-react";
import { signup, type SignupState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthShell } from "@/components/auth/auth-shell";

const initialState: SignupState = { error: null, emailSent: false };

export default function InscriptionPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <AuthShell
      title="Créer un compte"
      subtitle="En principe, votre compte est créé automatiquement après achat d'une formule."
      footer={
        <>
          Déjà un compte ?{" "}
          <Link href="/connexion" className="font-medium text-primary hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      {state.emailSent ? (
        <Alert>
          <MailCheck className="size-4" />
          <AlertDescription>
            Vérifiez votre boîte mail pour confirmer votre adresse et activer votre compte.
          </AlertDescription>
        </Alert>
      ) : (
        <form action={formAction} className="space-y-4">
          {state.error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input id="fullName" name="fullName" type="text" required autoComplete="name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="vous@email.com" required autoComplete="email" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? "Création…" : "Créer mon compte"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
