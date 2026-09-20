import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Radio,
  UserCircle,
  CreditCard,
} from "lucide-react";
import { NavSidebar, type NavItem } from "@/components/dashboard/nav-sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { getCurrentProfile } from "@/lib/supabase/profile";

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/formation", label: "Ma formation", icon: GraduationCap },
  { href: "/dashboard/communaute", label: "Communauté", icon: Users },
  { href: "/dashboard/lives", label: "Lives", icon: Radio },
  { href: "/dashboard/mon-compte", label: "Mon compte", icon: UserCircle },
  { href: "/dashboard/abonnement", label: "Abonnement", icon: CreditCard },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  const userLabel = profile?.full_name || profile?.email?.split("@")[0] || "Mon compte";
  const userEmail = profile?.email ?? "";

  return (
    <div className="flex min-h-screen bg-muted/20">
      <NavSidebar items={NAV_ITEMS} brandLabel="Espace élève" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar items={NAV_ITEMS} brandLabel="Espace élève" userLabel={userLabel} userEmail={userEmail} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
