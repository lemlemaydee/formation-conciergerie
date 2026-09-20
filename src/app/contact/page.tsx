import { Mail, MessageCircle, PhoneCall } from "lucide-react";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Réserver un appel — Formation Conciergerie",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                <PhoneCall className="size-3.5" />
                Appel découverte
              </span>
              <h1 className="mt-6 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
                Réservez un appel avec nous
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Une question sur la formation, votre palier, ou votre situation ne rentre dans
                aucune case (100+ biens, conciergerie villa de luxe) ? Décrivez votre situation,
                on revient vers vous pour caler un appel.
              </p>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3 text-sm text-foreground">
                  <MessageCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                  Réponse sous 24h ouvrées
                </li>
                <li className="flex items-start gap-3 text-sm text-foreground">
                  <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                  Ou directement par email :{" "}
                  <a href="mailto:contact@formation-conciergerie.fr" className="font-medium text-primary hover:underline">
                    contact@formation-conciergerie.fr
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
