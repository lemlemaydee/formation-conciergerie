import { TrendingUp, Users, Globe, Smartphone, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/stat-card";
import { BarList, Sparkline } from "@/components/dashboard/bar-list";
import { parsePriceLabel, bucketByDay, formatEUR, daysAgoIso } from "@/lib/admin-stats";

const countryNames = typeof Intl.DisplayNames !== "undefined" ? new Intl.DisplayNames(["fr"], { type: "region" }) : null;

function countryLabel(code: string | null): string {
  if (!code) return "Inconnu";
  return countryNames?.of(code) ?? code;
}

export default async function AdminStatistiquesPage() {
  const supabase = await createClient();
  const since30 = daysAgoIso(30);

  const [{ data: offers }, { data: tierRows }, { data: signupRows }, { data: views }, { data: progressRows }, { data: students }, { count: totalLessons }] =
    await Promise.all([
      supabase.from("offers").select("slug, name, price_label"),
      supabase.from("profiles").select("tier").eq("role", "student"),
      supabase.from("profiles").select("created_at").eq("role", "student"),
      supabase.from("page_views").select("path, country, device, created_at").gte("created_at", since30),
      supabase.from("lesson_progress").select("user_id, completed_at"),
      supabase.from("profiles").select("id, full_name, email").eq("role", "student"),
      supabase.from("lessons").select("*", { count: "exact", head: true }).eq("is_published", true),
    ]);

  // --- Ventes (estimation tant que Stripe n'est pas connecté) ---
  const tierCounts = (tierRows ?? []).reduce<Record<string, number>>((acc, r) => {
    const key = r.tier ?? "non assigné";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const estimatedRevenue = (offers ?? []).reduce((sum, offer) => {
    const price = parsePriceLabel(offer.price_label);
    const count = tierCounts[offer.slug] ?? 0;
    return sum + (price ?? 0) * count;
  }, 0);
  const signupTrend = bucketByDay((signupRows ?? []).map((r) => r.created_at), 30);

  // --- Visiteurs (30 derniers jours) ---
  const totalViews = views?.length ?? 0;
  const viewsByCountry = Object.entries(
    (views ?? []).reduce<Record<string, number>>((acc, v) => {
      const key = countryLabel(v.country);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const viewsByDevice = Object.entries(
    (views ?? []).reduce<Record<string, number>>((acc, v) => {
      acc[v.device] = (acc[v.device] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([label, count]) => ({
    label: label === "mobile" ? "Mobile" : label === "tablet" ? "Tablette" : "Ordinateur",
    count,
  }));
  const viewsTrend = bucketByDay((views ?? []).map((v) => v.created_at), 30);
  const topPages = Object.entries(
    (views ?? []).reduce<Record<string, number>>((acc, v) => {
      acc[v.path] = (acc[v.path] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // --- Évolution des élèves ---
  const total = totalLessons ?? 0;
  const doneByStudent = (progressRows ?? []).reduce<Record<string, number>>((acc, p) => {
    acc[p.user_id] = (acc[p.user_id] ?? 0) + 1;
    return acc;
  }, {});
  const studentProgress = (students ?? [])
    .map((s) => ({
      id: s.id,
      name: s.full_name || s.email,
      done: doneByStudent[s.id] ?? 0,
      percent: total > 0 ? Math.round(((doneByStudent[s.id] ?? 0) / total) * 100) : 0,
    }))
    .sort((a, b) => b.percent - a.percent);
  const completionsTrend = bucketByDay((progressRows ?? []).map((p) => p.completed_at), 30);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Statistiques</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ventes (estimation), visiteurs du site et progression des élèves.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <TrendingUp className="size-4 text-primary" />
          Ventes
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            icon={TrendingUp}
            label="CA estimé (cumulé)"
            value={formatEUR(estimatedRevenue)}
            hint="Estimation par palier — Stripe non connecté"
          />
          <StatCard icon={Users} label="Clients au total" value={String((tierRows ?? []).length)} hint="Donnée réelle" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-foreground">Inscriptions — 30 derniers jours</p>
          <Sparkline points={signupTrend} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Globe className="size-4 text-primary" />
          Visiteurs du site — 30 derniers jours
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard icon={Globe} label="Pages vues" value={String(totalViews)} hint="Hors pages admin/dashboard" />
          <StatCard
            icon={Smartphone}
            label="Mobile vs Ordinateur"
            value={
              totalViews > 0
                ? `${Math.round(((viewsByDevice.find((d) => d.label === "Mobile")?.count ?? 0) / totalViews) * 100)}% mobile`
                : "—"
            }
            hint="Détecté depuis le user-agent"
          />
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-foreground">Trafic quotidien</p>
          <Sparkline points={viewsTrend} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:col-span-1">
            <p className="mb-3 text-sm font-semibold text-foreground">Appareil</p>
            <BarList items={viewsByDevice} />
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:col-span-1">
            <p className="mb-3 text-sm font-semibold text-foreground">Pays</p>
            <BarList items={viewsByCountry} />
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:col-span-1">
            <p className="mb-3 text-sm font-semibold text-foreground">Pages les + vues</p>
            <BarList items={topPages} />
          </div>
        </div>
        {viewsByCountry.some((c) => c.label === "Inconnu") && (
          <p className="text-xs text-muted-foreground">
            Pays &laquo;&nbsp;Inconnu&nbsp;&raquo; : le pays visiteur ne se détecte qu&apos;en production (en local, Vercel n&apos;ajoute pas l&apos;en-tête de géolocalisation).
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <GraduationCap className="size-4 text-primary" />
          Évolution des élèves
        </h2>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-foreground">Leçons terminées (toutes classes) — 30 derniers jours</p>
          <Sparkline points={completionsTrend} />
        </div>
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-3">
            <p className="text-sm font-semibold text-foreground">Progression par élève</p>
          </div>
          {studentProgress.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">Aucun élève pour le moment.</p>
          ) : (
            <div className="divide-y divide-border">
              {studentProgress.map((s) => (
                <div key={s.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                  <span className="flex-1 truncate text-foreground">{s.name}</span>
                  <span className="w-16 shrink-0 text-right text-muted-foreground">
                    {s.done}/{total}
                  </span>
                  <div className="h-1.5 w-28 shrink-0 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${s.percent}%` }} />
                  </div>
                  <span className="w-10 shrink-0 text-right font-medium text-foreground">{s.percent}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
