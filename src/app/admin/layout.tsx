import { redirect } from "next/navigation";
import { NavSidebar } from "@/components/dashboard/nav-sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { getCurrentProfile } from "@/lib/supabase/profile";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <NavSidebar variant="admin" brandLabel="Admin" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar variant="admin" brandLabel="Admin" userLabel={profile.full_name || "Admin"} userEmail={profile.email} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
