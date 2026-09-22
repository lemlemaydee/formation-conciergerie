"use client";

import { useActionState, useState, useRef, cloneElement, type ReactElement } from "react";
import { Loader2, FileText, Trash2, Video as VideoIcon, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadToStorage } from "@/lib/supabase/upload";
import {
  createLesson,
  updateLesson,
  setLessonVideoUrl,
  addLessonResource,
  deleteLessonResource,
  type LessonFormState,
} from "@/app/admin/contenus/actions";

const MIN_TIER_LABELS: Record<string, string> = {
  starter: "Starter",
  croissance: "Croissance",
  "sur-mesure": "Sur-mesure",
};

export interface LessonData {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration_seconds: number | null;
  min_tier: string;
  is_published: boolean;
  resources: { id: string; title: string; file_url: string }[];
}

const EMPTY_STATE: LessonFormState = { error: null, success: false };

export function LessonEditor({
  subcategoryId,
  lesson,
  trigger,
}: {
  subcategoryId: string;
  lesson?: LessonData;
  trigger: ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState<string | undefined>(lesson?.id);
  const [videoUrl, setVideoUrl] = useState<string | null>(lesson?.video_url ?? null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingResource, setUploadingResource] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const resourceTitleRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(lesson);

  const action = isEdit
    ? updateLesson.bind(null, lesson!.id)
    : currentLessonId
      ? updateLesson.bind(null, currentLessonId)
      : createLesson.bind(null, subcategoryId);
  const [state, formAction, pending] = useActionState(action, EMPTY_STATE);

  if (state.success && state.lessonId && !currentLessonId) {
    setCurrentLessonId(state.lessonId);
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !currentLessonId) return;
    setUploadingVideo(true);
    setVideoError(null);
    try {
      const url = await uploadToStorage("lesson-videos", currentLessonId, file);
      await setLessonVideoUrl(currentLessonId, url);
      setVideoUrl(url);
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : "Échec de l'upload.");
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  }

  async function handleResourceUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const title = resourceTitleRef.current?.value.trim();
    if (!file || !currentLessonId) return;
    if (!title) {
      setVideoError("Donne un titre au document avant de l'uploader.");
      e.target.value = "";
      return;
    }
    setUploadingResource(true);
    setVideoError(null);
    try {
      const url = await uploadToStorage("ebooks", currentLessonId, file);
      await addLessonResource(currentLessonId, title, url);
      if (resourceTitleRef.current) resourceTitleRef.current.value = "";
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : "Échec de l'upload.");
    } finally {
      setUploadingResource(false);
      e.target.value = "";
    }
  }

  const canUpload = Boolean(currentLessonId);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next && !isEdit) {
          setCurrentLessonId(undefined);
          setVideoUrl(null);
        }
      }}
    >
      {cloneElement(trigger, { onClick: () => setOpen(true) } as React.HTMLAttributes<HTMLElement>)}
      <DialogContent className="max-h-[88vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier la leçon" : "Nouvelle leçon"}</DialogTitle>
          <DialogDescription>
            Titre, description, palier minimum requis, puis vidéo et documents une fois enregistrée.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          <form action={formAction} className="flex flex-col gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" name="title" defaultValue={lesson?.title} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={lesson?.description ?? ""} rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="duration_minutes">Durée (min)</Label>
                <Input
                  id="duration_minutes"
                  name="duration_minutes"
                  type="number"
                  min={0}
                  defaultValue={lesson?.duration_seconds ? Math.round(lesson.duration_seconds / 60) : ""}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="min_tier">Palier minimum</Label>
                <Select name="min_tier" defaultValue={lesson?.min_tier ?? "starter"} items={MIN_TIER_LABELS}>
                  <SelectTrigger id="min_tier" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="croissance">Croissance</SelectItem>
                    <SelectItem value="sur-mesure">Sur-mesure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <label className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <Switch name="is_published" defaultChecked={lesson?.is_published ?? true} />
              Publiée (visible des élèves)
            </label>

            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
            {state.success && !isEdit && currentLessonId && (
              <p className="text-sm text-emerald">
                Leçon créée. Ajoute une vidéo et des documents à droite.
              </p>
            )}

            <Button type="submit" disabled={pending} nativeButton={true} className="mt-auto">
              {pending && <Loader2 className="size-4 animate-spin" />}
              {isEdit || currentLessonId ? "Enregistrer les modifications" : "Créer la leçon"}
            </Button>
          </form>

          <div className="space-y-5 rounded-xl bg-muted/30 p-4 md:border-l md:border-border md:bg-transparent md:pl-6">
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">Vidéo</p>
              {!canUpload ? (
                <p className="text-xs text-muted-foreground">Enregistre d&apos;abord le titre pour pouvoir uploader une vidéo.</p>
              ) : (
                <div className="space-y-2">
                  {videoUrl && (
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                      <VideoIcon className="size-4 shrink-0 text-primary" />
                      <span className="truncate">Vidéo en ligne</span>
                      <a href={videoUrl} target="_blank" rel="noreferrer" className="ml-auto text-primary underline-offset-2 hover:underline">
                        Voir
                      </a>
                    </div>
                  )}
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card px-3 py-3 text-xs text-muted-foreground hover:bg-muted/50">
                    {uploadingVideo ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                    {uploadingVideo ? "Upload en cours…" : videoUrl ? "Remplacer la vidéo" : "Uploader une vidéo (MP4)"}
                    <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} disabled={uploadingVideo} />
                  </label>
                </div>
              )}
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">Documents (ebooks, PDF)</p>
              {!canUpload ? (
                <p className="text-xs text-muted-foreground">Enregistre d&apos;abord le titre pour pouvoir ajouter un document.</p>
              ) : (
                <div className="space-y-2">
                  {lesson?.resources.map((res) => (
                    <div key={res.id} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs">
                      <FileText className="size-4 shrink-0 text-primary" />
                      <span className="truncate text-foreground">{res.title}</span>
                      <a href={res.file_url} target="_blank" rel="noreferrer" className="ml-auto text-primary underline-offset-2 hover:underline">
                        Voir
                      </a>
                      <button
                        type="button"
                        onClick={() => deleteLessonResource(res.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                  <Input ref={resourceTitleRef} placeholder="Titre du document (ex: Checklist ménage)" className="w-full bg-card" />
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card px-3 py-3 text-xs text-muted-foreground hover:bg-muted/50">
                    {uploadingResource ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                    {uploadingResource ? "Upload en cours…" : "Uploader un document"}
                    <input type="file" accept=".pdf,.epub" className="hidden" onChange={handleResourceUpload} disabled={uploadingResource} />
                  </label>
                </div>
              )}
              {videoError && <p className="mt-2 text-xs text-destructive">{videoError}</p>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
