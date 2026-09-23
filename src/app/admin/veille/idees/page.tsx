import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { IdeaBoard } from "@/app/admin/veille/idees/idea-board";

export default async function AdminVeilleIdeesPage() {
  const supabase = await createClient();
  const { data: ideas } = await supabase.from("content_ideas").select("*").order("order_index");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Link
          href="/admin/veille"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Veille concurrentielle
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-foreground">Banque d&apos;idées vidéos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hooks, sujets et pain points repérés chez la concurrence — de quoi construire un calendrier de contenu et
          des scripts. Classe par statut au fur et à mesure que tu tournes.
        </p>
      </div>

      <IdeaBoard ideas={ideas ?? []} />
    </div>
  );
}
