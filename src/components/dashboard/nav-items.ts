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
  Clapperboard,
  Radar,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavChild {
  href: string;
  label: string;
}

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  children?: NavChild[];
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
  { href: "/admin/temoignages", label: "Témoignages vidéo", icon: Clapperboard },
  { href: "/admin/rendez-vous", label: "Rendez-vous", icon: CalendarClock },
  { href: "/admin/statistiques", label: "Statistiques", icon: BarChart3 },
  {
    href: "/admin/veille",
    label: "Veille concurrentielle",
    icon: Radar,
    children: [
      { href: "/admin/veille", label: "Formateurs & stratégie commerciale" },
      { href: "/admin/veille/idees", label: "Banque d'idées vidéos" },
      { href: "/admin/veille/reseaux-sociaux", label: "Stratégie réseaux sociaux" },
    ],
  },
  { href: "/admin/outils", label: "Outils affiliés", icon: Wrench },
  { href: "/admin/offres", label: "Offres", icon: Tag },
  { href: "/admin/lives", label: "Lives", icon: Radio },
  { href: "/admin/communaute", label: "Communauté", icon: MessagesSquare },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

// Plusieurs enfants peuvent partager un préfixe (ex. /admin/veille et
// /admin/veille/reseaux-sociaux/alex-hormozi) : seul le préfixe le plus
// long qui correspond au pathname courant doit être actif.
export function isNavChildActive(pathname: string, children: NavChild[], child: NavChild): boolean {
  const matching = children
    .filter((c) => pathname === c.href || pathname.startsWith(`${c.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return matching?.href === child.href;
}
