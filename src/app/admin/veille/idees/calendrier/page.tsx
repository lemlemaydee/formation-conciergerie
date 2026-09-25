import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CalendarBoard } from "@/app/admin/veille/idees/calendrier/calendar-board";

export default async function AdminCalendrierPage() {
  const supabase = await createClient();
  const { data: ideas } = await supabase.from("content_calendar_ideas").select("*").order("order_index");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Link
          href="/admin/veille/idees"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Banque d&apos;idées vidéos
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-foreground">Mon calendrier d&apos;idées</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Des idées de vidéos originales pour Formation Conciergerie, générées à partir des patterns repérés chez la
          concurrence — jamais une reprise de leur contenu, toujours un angle à vous, avec vos vrais chiffres et
          votre vraie histoire.
        </p>
      </div>

      <CalendarBoard ideas={ideas ?? []} />
    </div>
  );
}
