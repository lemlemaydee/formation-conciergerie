"use client";

import { useLayoutEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

function applyStoredTheme() {
  try {
    const stored = localStorage.getItem("theme");
    const dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  } catch {
    // localStorage indisponible (navigation privée, etc.) : on garde le thème déjà appliqué par le script inline.
  }
}

export function ThemeToggle() {
  // Re-applique après le remount de React Strict Mode en dev, qui efface la classe posée par le script inline.
  useLayoutEffect(() => {
    applyStoredTheme();
  }, []);

  function toggle() {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // rien à persister si le stockage est indisponible
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Changer de thème"
      className="relative"
    >
      <Sun className="size-4 scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0" />
    </Button>
  );
}
