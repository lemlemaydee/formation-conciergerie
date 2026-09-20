"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import type { NavItem } from "@/components/dashboard/nav-sidebar";

export function Topbar({
  items,
  brandLabel,
  userLabel,
  userEmail,
}: {
  items: NavItem[];
  brandLabel: string;
  userLabel: string;
  userEmail: string;
}) {
  const [open, setOpen] = useState(false);
  const initials = userLabel.slice(0, 2).toUpperCase() || "CC";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Ouvrir le menu" />}
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>{brandLabel}</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4">
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
        </SheetContent>
      </Sheet>

      <div className="hidden text-sm font-medium text-muted-foreground md:block">{userLabel}</div>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="gap-2 px-2" />}>
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline">{userLabel}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
            {userEmail}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/dashboard/mon-compte" />}>
            <UserIcon className="size-4" />
            Mon compte
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form action={logout}>
            <DropdownMenuItem render={<button type="submit" className="w-full" />} variant="destructive">
              <LogOut className="size-4" />
              Se déconnecter
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
