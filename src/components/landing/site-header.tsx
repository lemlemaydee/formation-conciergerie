"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/formation", label: "Formation" },
  { href: "/communaute", label: "Communauté" },
  { href: "/tarifs", label: "Tarifs" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
        FC
      </span>
      <span className="text-base font-semibold tracking-tight text-foreground">
        Formation Conciergerie
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/connexion"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Connexion
          </Link>
          <Button render={<Link href="/formation" />} nativeButton={false}>
            Rejoindre la formation
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Ouvrir le menu"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <SheetClose
                  key={link.href}
                  nativeButton={false}
                  render={
                    <Link
                      href={link.href}
                      className="rounded-md px-3 py-2.5 text-base font-medium text-foreground hover:bg-accent"
                    />
                  }
                >
                  {link.label}
                </SheetClose>
              ))}
              <SheetClose
                nativeButton={false}
                render={
                  <Link
                    href="/connexion"
                    className="rounded-md px-3 py-2.5 text-base font-medium text-foreground hover:bg-accent"
                  />
                }
              >
                Connexion
              </SheetClose>
            </nav>
            <div className="mt-2 px-4">
              <SheetClose
                nativeButton={false}
                render={
                  <Link href="/formation" className={cn(buttonVariants(), "w-full")} />
                }
              >
                Rejoindre la formation
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
