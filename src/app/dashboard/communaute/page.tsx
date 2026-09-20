import { Users } from "lucide-react";
import { PlaceholderSection } from "@/components/dashboard/placeholder-section";

export default function DashboardCommunautePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Communauté</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Salons d&apos;échange, questions/réponses et entraide entre membres.
        </p>
      </div>
      <PlaceholderSection
        icon={Users}
        title="Bientôt disponible"
        description="La communauté (salons, chat, partage de fichiers) arrive dans une prochaine mise à jour de la plateforme."
      />
    </div>
  );
}
