"use client";

import { Plus, Pencil, Trash2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { TestimonialEditor, type TestimonialData } from "@/app/admin/temoignages/testimonial-editor";
import { deleteTestimonial, toggleTestimonialActive } from "@/app/admin/temoignages/actions";

export function TestimonialList({ testimonials }: { testimonials: TestimonialData[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <TestimonialEditor
          trigger={
            <Button nativeButton={true}>
              <Plus className="size-4" />
              Nouveau témoignage
            </Button>
          }
        />
      </div>

      {testimonials.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
          Aucun témoignage vidéo pour le moment.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted/60">
                {t.poster_url ? (
                  <img src={t.poster_url} alt="" className="size-12 rounded-lg object-cover" />
                ) : (
                  <Video className="size-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
                <p className="truncate text-xs text-muted-foreground">{t.role || "—"}</p>
                {!t.video_url && (
                  <Badge variant="secondary" className="mt-1">
                    Pas de vidéo
                  </Badge>
                )}
              </div>
              <Switch
                checked={t.is_active}
                onCheckedChange={(checked) => toggleTestimonialActive(t.id, Boolean(checked))}
              />
              <TestimonialEditor
                testimonial={t}
                trigger={
                  <Button variant="ghost" size="icon-sm" nativeButton={true}>
                    <Pencil className="size-3.5" />
                  </Button>
                }
              />
              <Button
                variant="ghost"
                size="icon-sm"
                nativeButton={true}
                onClick={() => {
                  if (confirm(`Supprimer le témoignage de "${t.name}" ?`)) deleteTestimonial(t.id);
                }}
              >
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
