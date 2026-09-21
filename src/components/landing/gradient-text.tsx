import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-primary via-primary to-primary/50 bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}
