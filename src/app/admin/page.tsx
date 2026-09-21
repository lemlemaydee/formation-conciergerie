import Link from "next/link";
import { Users, TrendingUp, GraduationCap, CalendarClock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/stat-card";

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const todayIso = new Date().toISOString().slice(0, 10);

  const [{ count: clientCount }, { data: tierRows }, { count: lessonCount }, { count: progressCount }, { count: upcomingBookings }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
      supabase.from("profiles").select("tier").eq("role", "student"),
      supabase.from("lessons").select("*", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("lesson_progress").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("*", { count: "exact", head: true }).gte("slot_date", todayIso),
    ]);

  const tierCounts = (tierRows ?? []).reduce<Record<string, number>>((acc, row) => {
    const key = row.tier ?? "non assigné";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const completionRate =
    lessonCount && clientCount
      ? Math.round(((progressCount ?? 0) / (lessonCount * clientCount)) * 100)
      : null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Vue d&apos;ensemble</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Le chiffre d&apos;affaires est marqué d&apos;un * : en attente de la connexion Stripe.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Clients inscrits" value={String(clientCount ?? 0)} hint="Donnée réelle" />
        <StatCard icon={TrendingUp} label="CA du mois*" value="0 €" hint="Stripe non connecté" />
        <StatCard
          icon={GraduationCap}
          label="Taux de complétion moyen"
          value={completionRate !== null ? `${completionRate}%` : "—"}
          hint="Donnée réelle"
        />
        <Link href="/admin/rendez-vous">
          <StatCard
            icon={CalendarClock}
            label="Appels à venir"
            value={String(upcomingBookings ?? 0)}
            hint="Donnée réelle"
          />
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-foreground">Clients par palier</p>
        {Object.keys(tierCounts).length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun client pour le moment.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(tierCounts).map(([tier, count]) => (
              <div key={tier} className="rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground capitalize">{tier}</p>
                <p className="mt-1 text-xl font-bold text-foreground">{count}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
