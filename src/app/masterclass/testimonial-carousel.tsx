import { Play } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/landing/reveal";

const PLACEHOLDER_COUNT = 10;

// Emplacements en attente de vrais témoignages vidéo élèves (format 9:16,
// façon TikTok/Reels) — aucun contenu à afficher pour le moment.
export function TestimonialCarousel() {
  return (
    <RevealGroup className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
        <RevealItem key={i} className="shrink-0 snap-start">
          <div className="flex aspect-[9/16] w-[160px] flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card text-center shadow-sm sm:w-[180px]">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Play className="ml-0.5 size-5 fill-current" />
            </span>
            <p className="max-w-[110px] text-xs text-muted-foreground">Témoignage vidéo à venir</p>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
