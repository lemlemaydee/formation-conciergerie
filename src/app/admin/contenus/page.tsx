import { Video } from "lucide-react";
import { PlaceholderSection } from "@/components/dashboard/placeholder-section";

export default function AdminContenusPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Contenus</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Catégories, sous-catégories, vidéos et ebooks de la formation.
        </p>
      </div>
      <PlaceholderSection
        icon={Video}
        title="Constructeur de programme à venir"
        description="Upload de vidéos, organisation par catégories et attachement d'ebooks : cette section arrive dans une prochaine étape."
      />
    </div>
  );
}
