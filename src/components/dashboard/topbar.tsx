"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { DASHBOARD_NAV_ITEMS, ADMIN_NAV_ITEMS, isNavChildActive, type NavItem } from "@/components/dashboard/nav-items";
import { ProfileMenu } from "@/components/dashboard/nav-sidebar";

function MobileNavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = pathname.startsWith(item.href);
  const [open, setOpen] = useState(active);

  return (
    <div>
      <div
        className={cn(
          "flex items-center rounded-lg text-sm font-medium",
          active ? "text-primary" : "text-foreground",
        )}
      >
        <SheetClose
          nativeButton={false}
          className="flex flex-1 items-center gap-3 px-3 py-2.5 hover:bg-accent"
          render={<Link href={item.href} />}
        >
          <item.icon className="size-4 shrink-0" />
          {item.label}
        </SheetClose>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="pr-3 py-2.5 pl-1"
          aria-label={open ? "Réduire" : "Développer"}
          aria-expanded={open}
        >
          <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
        </button>
      </div>
      {open && (
        <div className="mt-1 ml-4 space-y-1 border-l border-border pl-4">
          {item.children!.map((child) => (
            <SheetClose
              key={child.href}
              nativeButton={false}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm hover:bg-accent",
                isNavChildActive(pathname, item.children!, child) ? "font-medium text-primary" : "text-foreground",
              )}
              render={<Link href={child.href} />}
            >
              {child.label}
            </SheetClose>
          ))}
        </div>
      )}
    </div>
  );
}

export function Topbar({
  variant,
  brandLabel,
  userLabel,
  userEmail,
}: {
  variant: "dashboard" | "admin";
  brandLabel: string;
  userLabel: string;
  userEmail: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const items = variant === "admin" ? ADMIN_NAV_ITEMS : DASHBOARD_NAV_ITEMS;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6 md:hidden">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          FC
        </span>
        <span className="text-sm font-semibold text-foreground">{brandLabel}</span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Ouvrir le menu" />}>
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="flex w-72 flex-col">
          <SheetHeader>
            <SheetTitle>{brandLabel}</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4">
            {items.map((item) =>
              item.children ? (
                <MobileNavGroup key={item.href} item={item} pathname={pathname} />
              ) : (
                <SheetClose
                  key={item.href}
                  nativeButton={false}
                  render={
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
                    />
                  }
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </SheetClose>
              ),
            )}
          </nav>
          <div className="shrink-0 border-t border-border p-3">
            <ProfileMenu userLabel={userLabel} userEmail={userEmail} side="top" />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
