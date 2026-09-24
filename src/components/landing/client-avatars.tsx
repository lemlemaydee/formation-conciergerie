"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENTS = ["bg-primary text-primary-foreground", "bg-gold text-gold-foreground", "bg-emerald text-emerald-foreground"];

// Avatars anonymes (pas de vraies photos/noms attachés à un chiffre) — le
// chiffre affiché doit venir d'une donnée réelle fournie par Mehdi/Jacques.
export function ClientAvatars({
  total,
  shown = 5,
  size = 40,
  className,
}: {
  total: number;
  shown?: number;
  size?: number;
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const bubbles = Array.from({ length: shown });
  const remainder = Math.max(total - shown, 0);

  return (
    <div className={cn("flex items-center", className)}>
      {bubbles.map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full border-2 border-background shadow-sm",
            ACCENTS[i % ACCENTS.length],
          )}
          style={{ width: size, height: size, marginLeft: i === 0 ? 0 : -size * 0.35, zIndex: i }}
          animate={{ scale: hovered === i ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <User className="size-1/2" strokeWidth={2.5} />
        </motion.div>
      ))}
      {remainder > 0 && (
        <motion.div
          className="flex shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-semibold text-foreground shadow-sm"
          style={{ width: size, height: size, marginLeft: -size * 0.35, zIndex: shown }}
          animate={{ scale: hovered === shown ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onMouseEnter={() => setHovered(shown)}
          onMouseLeave={() => setHovered(null)}
        >
          +{remainder}
        </motion.div>
      )}
    </div>
  );
}
