import { BadgeCheck } from "lucide-react";

const PROOF_ITEMS = [
  "120+ biens gérés entre Monaco et la Côte d'Azur",
  "Formation créée par des opérateurs actifs, pas par des formateurs qui ont arrêté de pratiquer",
  "Conciergerie haut de gamme, du studio à la villa de luxe",
  "50+ propriétaires nous font déjà confiance",
  "On applique nous-mêmes la méthode enseignée",
];

export function ProofMarquee() {
  const items = [...PROOF_ITEMS, ...PROOF_ITEMS];

  return (
    <div className="overflow-hidden border-y border-primary/15 bg-primary/5 py-3">
      <div className="flex w-max animate-marquee items-center gap-10">
        {items.map((text, i) => (
          <span key={i} className="flex shrink-0 items-center gap-2 text-sm font-medium whitespace-nowrap text-primary/80">
            <BadgeCheck className="size-4 shrink-0" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
