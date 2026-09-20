"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle, MailCheck } from "lucide-react";
import { requestPasswordReset, type ResetState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthShell } from "@/components/auth/auth-shell";

const initialState: ResetState = { error: null, sent: false };

export default function MotDePasseOubliePage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  return (
    <AuthShell
      title="Mot de passe oublié"
      subtitle="Recevez un lien pour définir un nouveau mot de passe."
      footer={
        <Link href="/connexion" className="font-medium text-primary hover:underline">
          Retour à la connexion
        </Link>
      }
    >
      {state.sent ? (
        <Alert>
          <MailCheck className="size-4" />
          <AlertDescription>
            Si un compte existe avec cet email, un lien de réinitialisation vient d&apos;être envoyé.
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
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="vous@email.com" required autoComplete="email" />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? "Envoi…" : "Envoyer le lien"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
