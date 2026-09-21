import { Phone, Mail, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

export default async function AdminRendezVousPage() {
  const supabase = await createClient();
  const todayIso = new Date().toISOString().slice(0, 10);

  const [{ data: upcoming }, { data: past }] = await Promise.all([
    supabase
      .from("bookings")
      .select("*")
      .gte("slot_date", todayIso)
      .order("slot_date")
      .order("slot_time"),
    supabase
      .from("bookings")
      .select("*")
      .lt("slot_date", todayIso)
      .order("slot_date", { ascending: false })
      .order("slot_time", { ascending: false })
      .limit(30),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Rendez-vous</h1>
        <p className="mt-1 text-sm text-muted-foreground">Appels de découverte réservés depuis le site.</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">
          À venir <Badge variant="secondary" className="ml-1">{upcoming?.length ?? 0}</Badge>
        </h2>
        {!upcoming || upcoming.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
            Aucun appel à venir.
          </p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((b) => (
              <BookingRow key={b.id} booking={b} />
            ))}
          </div>
        )}
      </section>

      {past && past.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Passés</h2>
          <div className="space-y-2 opacity-70">
            {past.map((b) => (
              <BookingRow key={b.id} booking={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

interface Booking {
  id: string;
  slot_date: string;
  slot_time: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  comment: string | null;
}

function BookingRow({ booking }: { booking: Booking }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {booking.first_name} {booking.last_name}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(booking.slot_date).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}{" "}
            à {booking.slot_time.slice(0, 5)}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <a href={`mailto:${booking.email}`} className="flex items-center gap-1 hover:text-primary">
            <Mail className="size-3.5" />
            {booking.email}
          </a>
          <a href={`tel:${booking.phone}`} className="flex items-center gap-1 hover:text-primary">
            <Phone className="size-3.5" />
            {booking.phone}
          </a>
        </div>
      </div>
      {booking.comment && (
        <p className="mt-2 flex items-start gap-1.5 border-t border-border/60 pt-2 text-xs text-muted-foreground">
          <MessageSquare className="mt-0.5 size-3.5 shrink-0" />
          {booking.comment}
        </p>
      )}
    </div>
  );
}
