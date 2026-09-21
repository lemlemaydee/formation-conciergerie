"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VideoCarouselItem {
  id: string;
  videoUrl: string;
  posterUrl: string | null;
  name: string;
  role: string | null;
}

function VideoTile({ item }: { item: VideoCarouselItem }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="group relative aspect-[9/16] h-[420px] w-auto shrink-0 snap-center overflow-hidden rounded-2xl border border-border bg-muted shadow-sm sm:h-[480px]">
      <video
        ref={videoRef}
        src={item.videoUrl}
        poster={item.posterUrl ?? undefined}
        playsInline
        controls={playing}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        className="size-full object-cover"
      />
      {!playing && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <button
            type="button"
            aria-label={`Lire la vidéo de ${item.name}`}
            className="absolute inset-0 flex items-center justify-center"
            onClick={() => {
              setPlaying(true);
              requestAnimationFrame(() => {
                videoRef.current?.play().catch(() => setPlaying(false));
              });
            }}
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
              <Play className="ml-1 size-6 fill-primary text-primary" />
            </span>
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
            <p className="text-sm font-semibold text-white">{item.name}</p>
            {item.role && <p className="text-xs text-white/80">{item.role}</p>}
          </div>
        </>
      )}
    </div>
  );
}

export function VideoCarousel({ items }: { items: VideoCarouselItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByTile(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const tile = el.querySelector<HTMLElement>("[data-tile]");
    const step = (tile?.offsetWidth ?? 260) + 16;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div key={item.id} data-tile>
            <VideoTile item={item} />
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => scrollByTile(-1)}
            aria-label="Précédent"
            className={cn(
              "flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted",
            )}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByTile(1)}
            aria-label="Suivant"
            className={cn(
              "flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted",
            )}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
