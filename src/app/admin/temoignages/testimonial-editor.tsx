"use client";

import { useActionState, useState, cloneElement, type ReactElement } from "react";
import { Loader2, Upload, Video as VideoIcon, Image as ImageIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadToStorage } from "@/lib/supabase/upload";
import type { SimpleState } from "@/app/admin/contenus/actions";
import {
  createTestimonial as createAction,
  updateTestimonial as updateAction,
  setTestimonialVideoUrl,
  setTestimonialPosterUrl,
} from "@/app/admin/temoignages/actions";

export interface TestimonialData {
  id: string;
  name: string;
  role: string | null;
  video_url: string;
  poster_url: string | null;
  is_active: boolean;
}

const EMPTY_STATE: SimpleState = { error: null, success: false };

export function TestimonialEditor({
  testimonial,
  trigger,
}: {
  testimonial?: TestimonialData;
  trigger: ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(testimonial);
  const action = isEdit ? updateAction.bind(null, testimonial!.id) : createAction;
  const [state, formAction, pending] = useActionState(action, EMPTY_STATE);

  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success && !isEdit) setOpen(false);
  }

  const [videoUrl, setVideoUrl] = useState(testimonial?.video_url ?? "");
  const [posterUrl, setPosterUrl] = useState(testimonial?.poster_url ?? "");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !testimonial) return;
    setUploadingVideo(true);
    setUploadError(null);
    try {
      const url = await uploadToStorage("testimonial-videos", testimonial.id, file);
      await setTestimonialVideoUrl(testimonial.id, url);
      setVideoUrl(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Échec de l'upload.");
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  }

  async function handlePosterUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !testimonial) return;
    setUploadingPoster(true);
    setUploadError(null);
    try {
      const url = await uploadToStorage("testimonial-videos", `${testimonial.id}-poster`, file);
      await setTestimonialPosterUrl(testimonial.id, url);
      setPosterUrl(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Échec de l'upload.");
    } finally {
      setUploadingPoster(false);
      e.target.value = "";
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {cloneElement(trigger, { onClick: () => setOpen(true) } as React.HTMLAttributes<HTMLElement>)}
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Modifier le témoignage" : "Nouveau témoignage vidéo"}</SheetTitle>
          <SheetDescription>Vidéo verticale (9:16), affichée dans le carrousel de la landing page.</SheetDescription>
        </SheetHeader>

        <form action={formAction} className="flex flex-col gap-4 px-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" defaultValue={testimonial?.name} required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="role">Sous-titre</Label>
            <Input id="role" name="role" placeholder="Ex: 12 biens en gestion" defaultValue={testimonial?.role ?? ""} />
          </div>
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" disabled={pending} nativeButton={true}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            {isEdit ? "Enregistrer" : "Créer"}
          </Button>
        </form>

        {isEdit && (
          <div className="mt-2 space-y-4 border-t border-border px-4 pt-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">Vidéo (9:16)</p>
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
              <p className="mb-2 text-sm font-semibold text-foreground">Image de couverture (optionnel)</p>
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
            {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
            {!videoUrl && <p className="text-xs text-muted-foreground">Ajoute une vidéo pour pouvoir activer ce témoignage.</p>}
          </div>
        )}

        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
}
