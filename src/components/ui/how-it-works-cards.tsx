"use client";

import type { CSSProperties } from "react";
import { LazyMotion, domAnimation, m } from "motion/react";
import { cn } from "@/lib/utils";

interface CardColors {
  bg: string;
  text: string;
  border: string;
}

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

interface CardProps {
  number: string;
  title: string;
  description: string;
  colors: CardColors;
  className?: string;
  rotate?: string;
}

function Card({ number, title, description, colors, className, rotate }: CardProps) {
  return (
    <div
      className={cn(
        "relative w-full transition-transform duration-300 hover:z-30 hover:scale-105 md:w-[280px]",
        rotate,
        className,
      )}
    >
      <div className="rounded-[25px] border border-border bg-card p-2 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.08)]">
        <Pin className={cn("z-20 mx-auto mb-6 h-8 w-8", colors.text)} />
        <div
          className={cn(
            "relative flex h-full flex-col overflow-hidden rounded-[15px] border p-[15px]",
            colors.bg,
            colors.border,
          )}
        >
          <span className={cn("mb-5 font-serif text-4xl font-bold italic", colors.text)}>
            {number}
          </span>
          <h3 className="mb-[10px] text-2xl leading-none font-semibold text-foreground">{title}</h3>
          <p className="text-sm/5 tracking-tight text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

export interface HowItWorksStep {
  title: string;
  description: string;
  colors: CardColors;
}

export interface StepPosition {
  className?: string;
  rotate?: string;
}

const DEFAULT_POSITIONS: StepPosition[] = [
  { className: "md:absolute md:top-0 md:left-[15%]", rotate: "rotate-8" },
  { className: "md:absolute md:top-[120px] md:right-[15%]", rotate: "-rotate-8" },
  { className: "md:absolute md:top-[450px] md:left-[15%]", rotate: "rotate-8" },
  { className: "md:absolute md:top-[570px] md:right-[10%]", rotate: "-rotate-8" },
  { className: "md:absolute md:top-[850px] md:left-[15%]", rotate: "rotate-8" },
];

export function HowItWorksCards({
  steps,
  positions = DEFAULT_POSITIONS,
  className,
}: {
  steps: HowItWorksStep[];
  positions?: StepPosition[];
  className?: string;
}) {
  let height = 1130;
  if (steps.length === 1) height = 400;
  else if (steps.length === 2) height = 450;
  else if (steps.length === 3) height = 800;
  else if (steps.length === 4) height = 900;

  return (
    <LazyMotion features={domAnimation}>
      <div className={cn("relative", className)}>
        <div
          className="relative mx-auto flex h-auto w-full max-w-[500px] flex-col space-y-8 md:block md:h-[var(--md-height)] md:space-y-0"
          style={{ "--md-height": `${height}px` } as CSSProperties}
        >
          {steps.length > 1 && (
            <svg
              className="pointer-events-none absolute top-0 left-0 z-0 hidden h-full w-full md:block"
              viewBox={`0 0 1000 ${height}`}
              preserveAspectRatio="none"
            >
              {(() => {
                const pathD = steps.reduce((acc, _, index) => {
                  if (index >= steps.length - 1) return acc;
                  if (index === 0) return "M 290 150 C 500 150, 550 270, 710 270";
                  if (index === 1) return acc + " C 850 270, 500 350, 290 450";
                  if (index === 2) return acc + " C 290 600, 550 720, 750 720";
                  if (index === 3) return acc + " C 950 720, 500 800, 290 850";
                  return acc;
                }, "");
                return (
                  <m.path
                    d={pathD}
                    stroke="currentColor"
                    className="text-border"
                    strokeWidth="2"
                    strokeDasharray="8 6"
                    fill="none"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: -140 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                );
              })()}
            </svg>
          )}

          {steps.map((step, index) => {
            const position = positions[index % positions.length];
            return (
              <Card
                key={step.title}
                number={`0${index + 1}`}
                title={step.title}
                description={step.description}
                colors={step.colors}
                rotate={position.rotate}
                className={position.className}
              />
            );
          })}
        </div>
      </div>
    </LazyMotion>
  );
}
