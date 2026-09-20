"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const STATS = [
  { target: 500, suffix: "+", label: "élèves accompagnés" },
  { target: 10000, suffix: "+", label: "biens gérés par la communauté" },
  { target: 48, suffix: "/5", divide: 10, label: "note moyenne des élèves" },
  { target: 52, suffix: "/an", label: "sessions live avec les formateurs" },
];

function AnimatedStat({ target, suffix, divide, label }: (typeof STATS)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  const display = divide ? (value / divide).toFixed(1) : value.toLocaleString("fr-FR");

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl font-bold text-foreground sm:text-4xl">
        {display}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
