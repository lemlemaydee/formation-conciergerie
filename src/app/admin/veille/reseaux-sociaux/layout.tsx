"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const COACHES = [
  { slug: "mickael-wu", label: "Mickaël Wu" },
  { slug: "alex-hormozi", label: "Alex Hormozi" },
  { slug: "russell-brunson", label: "Russell Brunson" },
];

export default function ReseauxSociauxLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Link
          href="/admin/veille"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Veille concurrentielle
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-foreground">Stratégie réseaux sociaux</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ce que les meilleurs dans leur domaine font pour vendre — contenu, offres et tunnels, décortiqués un
          créateur à la fois.
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-border">
        {COACHES.map((coach) => {
          const href = `/admin/veille/reseaux-sociaux/${coach.slug}`;
          const active = pathname === href;
          return (
            <Link
              key={coach.slug}
              href={href}
              className={cn(
                "-mb-px rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {coach.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
