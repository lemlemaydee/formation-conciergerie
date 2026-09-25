import { Check } from "lucide-react";

// Pas de vraie photo de Mehdi/Jacques disponible (voir team-section.tsx sur
// l'accueil, toujours en attente) — avatar en monogramme, pas de photo de
// stock attribuée à un nom réel.
export function ProfileHeader() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-500 p-[3px]">
        <div className="flex size-16 items-center justify-center rounded-full border-2 border-background bg-primary text-lg font-bold text-primary-foreground">
          MJ
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-bold text-foreground">MJ Academy</span>
          <span className="flex size-4 items-center justify-center rounded-full bg-primary">
            <Check className="size-2.5 text-primary-foreground" strokeWidth={3.5} />
          </span>
        </div>
        <p className="text-sm font-bold" style={{ color: "var(--lime)" }}>
          120+ biens en gestion
        </p>
      </div>
    </div>
  );
}
