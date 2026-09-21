import * as React from "react";
import { cn } from "@/lib/utils";

interface Logo {
  src: string;
  alt: string;
  gradient: {
    from: string;
    via: string;
    to: string;
  };
}

interface MarqueeLogoScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  logos: Logo[];
  speed?: "normal" | "slow" | "fast";
}

const DURATION_MAP = {
  normal: "40s",
  slow: "80s",
  fast: "15s",
};

/**
 * Bandeau de logos en défilement infini, en pause au survol. Le style de
 * fond dégradé de chaque tuile n'apparaît qu'au survol (groupe Tailwind).
 */
const MarqueeLogoScroller = React.forwardRef<HTMLDivElement, MarqueeLogoScrollerProps>(
  ({ title, description, logos, speed = "normal", className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        aria-label={title}
        className={cn("w-full overflow-hidden rounded-lg border border-border bg-card text-foreground", className)}
        {...props}
      >
        <div className="p-6 md:p-8 lg:p-10">
          <div className="grid grid-cols-1 gap-6 border-b border-border pb-6 md:pb-8 lg:grid-cols-[3fr_2fr] lg:gap-8">
            <h2 className="text-3xl font-semibold tracking-tighter text-balance md:text-4xl">{title}</h2>
            <p className="self-start text-balance text-muted-foreground lg:justify-self-end">{description}</p>
          </div>
        </div>

        <div
          className="w-full overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div
            className="flex w-max items-center gap-4 py-4 pr-4 transition-all duration-300 ease-in-out hover:[animation-play-state:paused]"
            style={{ "--duration": DURATION_MAP[speed], animation: "var(--animate-marquee)" } as React.CSSProperties}
          >
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="group relative flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary/70"
              >
                <div
                  style={
                    {
                      "--from": logo.gradient.from,
                      "--via": logo.gradient.via,
                      "--to": logo.gradient.to,
                    } as React.CSSProperties
                  }
                  className="absolute inset-0 scale-150 bg-gradient-to-br from-[var(--from)] via-[var(--via)] to-[var(--to)] opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
                />
                <img src={logo.src} alt={logo.alt} className="relative h-3/4 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

MarqueeLogoScroller.displayName = "MarqueeLogoScroller";

export { MarqueeLogoScroller };
