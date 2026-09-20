import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Video,
  Tag,
  Radio,
  MessagesSquare,
  Settings,
} from "lucide-react";
import { NavSidebar, type NavItem } from "@/components/dashboard/nav-sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { getCurrentProfile } from "@/lib/supabase/profile";

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/contenus", label: "Contenus", icon: Video },
  { href: "/admin/offres", label: "Offres", icon: Tag },
  { href: "/admin/lives", label: "Lives", icon: Radio },
  { href: "/admin/communaute", label: "Communauté", icon: MessagesSquare },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <NavSidebar items={NAV_ITEMS} brandLabel="Admin" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar items={NAV_ITEMS} brandLabel="Admin" userLabel={profile.full_name || "Admin"} userEmail={profile.email} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
