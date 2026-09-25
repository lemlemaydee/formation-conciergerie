"use client";

import { useState } from "react";
import { Loader2, Upload, Video as VideoIcon, Image as ImageIcon, Trash2 } from "lucide-react";
import { uploadToStorage } from "@/lib/supabase/upload";
import { setMasterclassVideoUrl, setMasterclassPosterUrl, removeMasterclassVideo } from "@/app/admin/parametres/actions";

export function MasterclassVideoSettings({
  initialVideoUrl,
  initialPosterUrl,
}: {
  initialVideoUrl: string | null;
  initialPosterUrl: string | null;
}) {
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [posterUrl, setPosterUrl] = useState(initialPosterUrl);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    setError(null);
    try {
      const url = await uploadToStorage("site-media", "masterclass", file);
      await setMasterclassVideoUrl(url);
      setVideoUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'upload.");
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  }

  async function handlePosterUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPoster(true);
    setError(null);
    try {
      const url = await uploadToStorage("site-media", "masterclass-poster", file);
      await setMasterclassPosterUrl(url);
      setPosterUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'upload.");
    } finally {
      setUploadingPoster(false);
      e.target.value = "";
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <p className="text-sm font-semibold text-foreground">Vidéo de la formation gratuite</p>
      <p className="mt-1 text-sm text-muted-foreground">
        La vidéo de présentation (Mehdi &amp; Jacques) qui s&apos;affiche sur la page d&apos;accueil (
        <a href="/" target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-2 hover:underline">
          /
        </a>
        ). Distincte de la vidéo hero de l&apos;ancien site. Format paysage (16:9) recommandé.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Vidéo</p>
          <div className="space-y-2">
            {videoUrl && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                <VideoIcon className="size-4 shrink-0 text-primary" />
                <span className="truncate">Vidéo en ligne</span>
                <a href={videoUrl} target="_blank" rel="noreferrer" className="ml-auto text-primary underline-offset-2 hover:underline">
                  Voir
                </a>
              </div>
            )}
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-3 text-xs text-muted-foreground hover:bg-muted/30">
              {uploadingVideo ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              {uploadingVideo ? "Upload en cours…" : videoUrl ? "Remplacer la vidéo" : "Uploader une vidéo (MP4)"}
              <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} disabled={uploadingVideo} />
            </label>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Image de couverture (optionnel)</p>
          <div className="space-y-2">
            {posterUrl && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                <ImageIcon className="size-4 shrink-0 text-primary" />
                <span className="truncate">Image en ligne</span>
                <a href={posterUrl} target="_blank" rel="noreferrer" className="ml-auto text-primary underline-offset-2 hover:underline">
                  Voir
                </a>
              </div>
            )}
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-3 text-xs text-muted-foreground hover:bg-muted/30">
              {uploadingPoster ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              {uploadingPoster ? "Upload en cours…" : posterUrl ? "Remplacer l'image" : "Uploader une image"}
              <input type="file" accept="image/*" className="hidden" onChange={handlePosterUpload} disabled={uploadingPoster} />
            </label>
          </div>
        </div>
      </div>

      {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

      {videoUrl && (
        <button
          type="button"
          onClick={async () => {
            if (!confirm("Retirer la vidéo de la masterclass ? La page reviendra à l'aperçu par défaut.")) return;
            await removeMasterclassVideo();
            setVideoUrl(null);
            setPosterUrl(null);
          }}
          className="mt-4 flex items-center gap-1.5 text-xs font-medium text-destructive hover:underline"
        >
          <Trash2 className="size-3.5" />
          Retirer la vidéo
        </button>
      )}
    </div>
  );
}
