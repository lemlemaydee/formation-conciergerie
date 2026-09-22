"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { DASHBOARD_NAV_ITEMS, ADMIN_NAV_ITEMS } from "@/components/dashboard/nav-items";
import { ProfileMenu } from "@/components/dashboard/nav-sidebar";

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
            {items.map((item) => (
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
            ))}
          </nav>
          <div className="shrink-0 border-t border-border p-3">
            <ProfileMenu userLabel={userLabel} userEmail={userEmail} side="top" />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
