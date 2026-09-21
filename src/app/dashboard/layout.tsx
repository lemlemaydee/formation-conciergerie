import { NavSidebar } from "@/components/dashboard/nav-sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { getCurrentProfile } from "@/lib/supabase/profile";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  const userLabel = profile?.full_name || profile?.email?.split("@")[0] || "Mon compte";
  const userEmail = profile?.email ?? "";
  const brandLabel = profile?.role === "admin" ? "Admin" : "Espace élève";

  return (
    <div className="flex min-h-screen bg-muted/20">
      <NavSidebar variant="dashboard" brandLabel={brandLabel} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar variant="dashboard" brandLabel={brandLabel} userLabel={userLabel} userEmail={userEmail} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
