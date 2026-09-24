"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, User as UserIcon, ChevronsUpDown, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/auth/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DASHBOARD_NAV_ITEMS, ADMIN_NAV_ITEMS, isNavChildActive, type NavItem } from "@/components/dashboard/nav-items";

export function NavSidebar({
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
  const pathname = usePathname();
  const items = variant === "admin" ? ADMIN_NAV_ITEMS : DASHBOARD_NAV_ITEMS;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            FC
          </span>
          <span className="text-sm font-semibold text-foreground">{brandLabel}</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {items.map((item) =>
          item.children ? (
            <NavGroup key={item.href} item={item} pathname={pathname} />
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                (item.exact ? pathname === item.href : pathname.startsWith(item.href))
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          ),
        )}
      </nav>

      <div className="shrink-0 border-t border-border p-3">
        <ProfileMenu userLabel={userLabel} userEmail={userEmail} side="top" />
      </div>
    </aside>
  );
}

function NavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = pathname.startsWith(item.href);
  const [open, setOpen] = useState(active);

  const [trackedActive, setTrackedActive] = useState(active);
  if (active !== trackedActive) {
    setTrackedActive(active);
    if (active) setOpen(true);
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center rounded-xl text-sm font-medium transition-colors",
          active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <Link href={item.href} className="flex flex-1 items-center gap-3 px-3 py-2.5">
          <item.icon className="size-4 shrink-0" />
          {item.label}
        </Link>
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
          {item.children!.map((child) => {
            const childActive = isNavChildActive(pathname, item.children!, child);
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  childActive
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ProfileMenu({
  userLabel,
  userEmail,
  side = "bottom",
}: {
  userLabel: string;
  userEmail: string;
  side?: "top" | "bottom";
}) {
  const initials = userLabel.slice(0, 2).toUpperCase() || "CC";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors hover:bg-muted"
        nativeButton={true}
      >
        <Avatar className="size-8 shrink-0">
          <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials}</AvatarFallback>
        </Avatar>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-foreground">{userLabel}</span>
          <span className="block truncate text-xs text-muted-foreground">{userEmail}</span>
        </span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side={side} className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
            {userEmail}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/dashboard/mon-compte" />}>
            <UserIcon className="size-4" />
            Mon compte
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form action={logout} className="w-full">
            <DropdownMenuItem
              render={<button type="submit" className="w-full" />}
              nativeButton={true}
              variant="destructive"
            >
              <LogOut className="size-4" />
              Se déconnecter
            </DropdownMenuItem>
          </form>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
