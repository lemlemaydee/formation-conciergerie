import { Settings } from "lucide-react";
import { PlaceholderSection } from "@/components/dashboard/placeholder-section";

export default function AdminParametresPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Informations légales, emails automatiques, intégrations et rôles internes.
        </p>
      </div>
      <PlaceholderSection
        icon={Settings}
        title="Réglages généraux à venir"
        description="Cette section regroupera les intégrations (Stripe, emailing) et la gestion des accès administrateurs."
      />
    </div>
  );
}
