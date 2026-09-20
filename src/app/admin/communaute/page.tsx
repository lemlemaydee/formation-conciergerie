import { MessagesSquare } from "lucide-react";
import { PlaceholderSection } from "@/components/dashboard/placeholder-section";

export default function AdminCommunautePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Communauté</h1>
        <p className="mt-1 text-sm text-muted-foreground">Salons, modération et rôles.</p>
      </div>
      <PlaceholderSection
        icon={MessagesSquare}
        title="Modération à venir"
        description="Créer des salons et modérer les messages signalés : cette section arrive avec la communauté."
      />
    </div>
  );
}
