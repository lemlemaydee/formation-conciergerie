import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Radio,
  UserCircle,
  CreditCard,
  Video,
  Tag,
  MessagesSquare,
  Settings,
  CalendarClock,
  BarChart3,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

// Ce fichier ne doit être importé que par des Client Components : les
// composants d'icône Lucide ne sont pas sérialisables à travers la
// frontière Server -> Client (RSC), donc ces listes ne doivent jamais
// transiter par les props d'un Server Component (voir dashboard/layout.tsx).

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/formation", label: "Ma formation", icon: GraduationCap },
  { href: "/dashboard/communaute", label: "Communauté", icon: Users },
  { href: "/dashboard/lives", label: "Lives", icon: Radio },
  { href: "/dashboard/outils", label: "Outils recommandés", icon: Wrench },
  { href: "/dashboard/mon-compte", label: "Mon compte", icon: UserCircle },
  { href: "/dashboard/abonnement", label: "Abonnement", icon: CreditCard },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/contenus", label: "Contenus", icon: Video },
  { href: "/admin/rendez-vous", label: "Rendez-vous", icon: CalendarClock },
  { href: "/admin/statistiques", label: "Statistiques", icon: BarChart3 },
  { href: "/admin/outils", label: "Outils affiliés", icon: Wrench },
  { href: "/admin/offres", label: "Offres", icon: Tag },
  { href: "/admin/lives", label: "Lives", icon: Radio },
  { href: "/admin/communaute", label: "Communauté", icon: MessagesSquare },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];
