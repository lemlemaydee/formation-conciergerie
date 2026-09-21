"use client";

import { useRef, type ReactNode } from "react";
import { useAnimationFrame } from "motion/react";
import { Marquee } from "@/components/ui/marquee";
import { BorderBeam } from "@/components/ui/border-beam";

const BEAM_DURATION = 8; // doit correspondre à la prop duration de BorderBeam
const BEAM_SIZE = 100; // doit correspondre à la prop size de BorderBeam

export function LogoCloud({ label, logos }: { label: ReactNode; logos: ReactNode[] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const waveSpanRef = useRef<HTMLSpanElement>(null);
  const startTimeRef = useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (!(cardRef.current && textRef.current && waveSpanRef.current)) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = time;
    }

    // Progression du beam : 0-100 le long du périmètre, même horloge que BorderBeam.
    const elapsed = ((time - startTimeRef.current) / 1000) % BEAM_DURATION;
    const beamOffset = (elapsed / BEAM_DURATION) * 100;

    const cardRect = cardRef.current.getBoundingClientRect();
    const textRect = textRef.current.getBoundingClientRect();

    const W = cardRect.width;
    const H = cardRect.height;
    const perimeter = 2 * (W + H);

    const textLeft = Math.max(0, textRect.left - cardRect.left);
    const textRight = Math.min(W, textRect.right - cardRect.left);

    const textStartPercent = (textLeft / perimeter) * 100;
    const textEndPercent = (textRight / perimeter) * 100;

    const span = waveSpanRef.current;

    if (beamOffset >= textStartPercent && beamOffset <= textEndPercent) {
      const t = (beamOffset - textStartPercent) / (textEndPercent - textStartPercent);
      span.style.backgroundPosition = `${95 - t * 90}% center`;
    } else if (beamOffset < textStartPercent) {
      span.style.backgroundPosition = "0% center";
    } else {
      span.style.backgroundPosition = "100% center";
    }
  });

  return (
    <div className="relative mx-auto max-w-(--breakpoint-lg) rounded-lg border border-border bg-card" ref={cardRef}>
      <BorderBeam className="isolate -z-1" duration={BEAM_DURATION} size={BEAM_SIZE} />

      <div className="absolute inset-x-0 top-0 flex -translate-y-1/2 items-center justify-center px-10">
        <p
          className="bg-card px-3 text-center font-medium text-foreground/80 text-lg tracking-[-0.01em] sm:px-6"
          ref={textRef}
        >
          <span
            ref={waveSpanRef}
            style={{
              backgroundImage:
                "linear-gradient(90deg, currentColor 0%, currentColor 45%, var(--gold) 47%, var(--primary) 50%, var(--gold) 53%, currentColor 55%, currentColor 100%)",
              backgroundSize: "250% 100%",
              backgroundRepeat: "no-repeat",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundPosition: "0% center",
            }}
          >
            {label}
          </span>
        </p>
      </div>

      <div className="grid">
        <div className="flex min-w-0 items-center justify-center gap-x-14 gap-y-10 p-10 pt-12 *:h-8">
          <Marquee className="mask-x-from-75% [--duration:25s] [&_svg]:mr-14" pauseOnHover>
            {logos}
          </Marquee>
        </div>
      </div>
    </div>
  );
}
