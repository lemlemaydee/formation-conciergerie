import { createClient } from "@/lib/supabase/server";
import { ToolList } from "@/app/admin/outils/tool-list";

export default async function AdminOutilsPage() {
  const supabase = await createClient();
  const { data: tools } = await supabase.from("affiliate_tools").select("*").order("order_index");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Outils affiliés</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Les outils que vous recommandez aux élèves, avec vos liens affiliés.
        </p>
      </div>
      <ToolList tools={tools ?? []} />
    </div>
  );
}
