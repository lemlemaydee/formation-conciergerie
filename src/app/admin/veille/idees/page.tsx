import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { VideoBoard } from "@/app/admin/veille/idees/video-board";

export default async function AdminVeilleIdeesPage() {
  const supabase = await createClient();
  const [{ data: accounts }, { data: videos }] = await Promise.all([
    supabase.from("veille_accounts").select("*").order("order_index"),
    supabase.from("veille_videos").select("*").order("order_index"),
  ]);

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
          Toutes les vidéos repérées, triées par compte : hooks, formats, statistiques et ce que les commentaires
          révèlent des pain points des viewers.
        </p>
      </div>

      <VideoBoard videos={videos ?? []} accounts={accounts ?? []} />
    </div>
  );
}
