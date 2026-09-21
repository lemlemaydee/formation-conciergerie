import { ExternalLink, Wrench } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PlaceholderSection } from "@/components/dashboard/placeholder-section";

export default async function DashboardOutilsPage() {
  const supabase = await createClient();
  const { data: tools } = await supabase
    .from("affiliate_tools")
    .select("*")
    .eq("is_active", true)
    .order("order_index");

  const grouped = (tools ?? []).reduce<Record<string, typeof tools>>((acc, tool) => {
    const key = tool.category || "Autres outils";
    acc[key] = [...(acc[key] ?? []), tool];
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Outils recommandés</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Les outils qu&apos;on utilise vraiment, au quotidien, pour gérer sa conciergerie.
        </p>
      </div>

      {!tools || tools.length === 0 ? (
        <PlaceholderSection
          icon={Wrench}
          title="Bientôt disponible"
          description="La liste d'outils recommandés arrive bientôt."
        />
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground">{category}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {items?.map((tool) => (
                <a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="group flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{tool.name}</p>
                    <ExternalLink className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  {tool.description && <p className="text-xs text-muted-foreground">{tool.description}</p>}
                </a>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
