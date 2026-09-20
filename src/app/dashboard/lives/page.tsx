import { CalendarClock, Radio } from "lucide-react";
import { PlaceholderSection } from "@/components/dashboard/placeholder-section";

export default function DashboardLivesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lives</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sessions hebdomadaires en direct avec les formateurs.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarClock className="size-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Q&amp;A Acquisition clients</p>
              <p className="text-xs text-muted-foreground">Jeudi 18h</p>
            </div>
          </div>
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            À venir
          </span>
        </div>
      </div>

      <PlaceholderSection
        icon={Radio}
        title="Visio intégrée bientôt disponible"
        description="Le lien de connexion et les replays apparaîtront ici une fois les sessions live activées par l'équipe."
      />
    </div>
  );
}
