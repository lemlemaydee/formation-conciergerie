"use client";

import { useRef, useState } from "react";
import { Play, Video as VideoIcon } from "lucide-react";

export function HeroVideo({ videoUrl, posterUrl }: { videoUrl: string | null; posterUrl: string | null }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/15 via-gold/10 to-transparent blur-2xl" />

      <div className="group relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted shadow-xl">
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl ?? undefined}
              playsInline
              controls={playing}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              className="size-full object-cover"
            />
            {!playing && (
              <button
                type="button"
                aria-label="Lire la vidéo de présentation"
                className="absolute inset-0 flex items-center justify-center"
                onClick={() => {
                  setPlaying(true);
                  requestAnimationFrame(() => {
                    videoRef.current?.play().catch(() => setPlaying(false));
                  });
                }}
              >
                <span className="flex size-16 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-105">
                  <Play className="ml-1 size-7 fill-primary text-primary" />
                </span>
              </button>
            )}
          </>
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <VideoIcon className="size-8" />
            <p className="text-sm">Vidéo de présentation à venir</p>
          </div>
        )}
      </div>
    </div>
  );
}
