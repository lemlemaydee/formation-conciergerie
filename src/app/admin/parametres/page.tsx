import { Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PlaceholderSection } from "@/components/dashboard/placeholder-section";
import { HeroVideoSettings } from "@/app/admin/parametres/hero-video-settings";
import { MasterclassVideoSettings } from "@/app/admin/parametres/masterclass-video-settings";

export default async function AdminParametresPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("hero_video_url, hero_video_poster_url, masterclass_video_url, masterclass_video_poster_url")
    .limit(1)
    .single();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Informations légales, emails automatiques, intégrations et rôles internes.
        </p>
      </div>

      <MasterclassVideoSettings
        initialVideoUrl={settings?.masterclass_video_url ?? null}
        initialPosterUrl={settings?.masterclass_video_poster_url ?? null}
      />

      <HeroVideoSettings
        initialVideoUrl={settings?.hero_video_url ?? null}
        initialPosterUrl={settings?.hero_video_poster_url ?? null}
      />

      <PlaceholderSection
        icon={Settings}
        title="Réglages généraux à venir"
        description="Cette section regroupera les intégrations (Stripe, emailing) et la gestion des accès administrateurs."
      />
    </div>
  );
}
