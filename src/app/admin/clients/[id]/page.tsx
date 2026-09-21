import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, CalendarClock, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { TierSelect } from "@/app/admin/clients/[id]/tier-select";

export default async function AdminClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase.from("profiles").select("*").eq("id", id).single();
  if (!client) notFound();

  const [{ data: progressRows }, { count: totalLessons }, { data: bookings }] = await Promise.all([
    supabase.from("lesson_progress").select("lesson_id, completed_at").eq("user_id", id),
    supabase.from("lessons").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase
      .from("bookings")
      .select("*")
      .ilike("email", client.email)
      .order("slot_date", { ascending: false }),
  ]);

  const done = progressRows?.length ?? 0;
  const total = totalLessons ?? 0;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/admin/clients" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Retour aux clients
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">{client.full_name || "Sans nom"}</h1>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="size-3.5" />
              {client.email}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Inscrit le {new Date(client.created_at).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={client.role === "admin" ? "default" : "secondary"}>
              {client.role === "admin" ? "Admin" : "Élève"}
            </Badge>
            <TierSelect clientId={client.id} tier={client.tier} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <GraduationCap className="size-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Progression formation</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {done} / {total} leçons terminées — {percent}%
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <CalendarClock className="size-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Appels réservés</p>
        </div>
        {!bookings || bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun appel réservé avec cet email.</p>
        ) : (
          <div className="space-y-2">
            {bookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm">
                <span className="text-foreground">
                  {new Date(b.slot_date).toLocaleDateString("fr-FR")} à {b.slot_time.slice(0, 5)}
                </span>
                {b.phone && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="size-3" />
                    {b.phone}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
