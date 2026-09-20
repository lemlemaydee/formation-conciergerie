import { Radio } from "lucide-react";
import { PlaceholderSection } from "@/components/dashboard/placeholder-section";

export default function AdminLivesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lives</h1>
        <p className="mt-1 text-sm text-muted-foreground">Planifier et lancer les sessions en direct.</p>
      </div>
      <PlaceholderSection
        icon={Radio}
        title="Planification à venir"
        description="Créer une session, générer le lien et notifier les élèves : cette section arrive avec l'intégration de la visio."
      />
    </div>
  );
}
