"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Video, FileText, ChevronDown, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TitleEditDialog } from "@/app/admin/contenus/title-edit-dialog";
import { LessonEditor, type LessonData } from "@/app/admin/contenus/lesson-editor";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  deleteLesson,
} from "@/app/admin/contenus/actions";

export interface CategoryData {
  id: string;
  title: string;
  description: string | null;
  subcategories: {
    id: string;
    title: string;
    lessons: LessonData[];
  }[];
}

function TierBadge({ tier }: { tier: string }) {
  const label = tier === "starter" ? "Starter" : tier === "croissance" ? "Croissance" : "Sur-mesure";
  return <Badge variant="outline">{label}</Badge>;
}

export function ContentManager({ categories }: { categories: CategoryData[] }) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(categories.map((c) => c.id)));

  function toggleCategory(id: string) {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <TitleEditDialog
          trigger={
            <Button nativeButton={true}>
              <Plus className="size-4" />
              Nouvelle catégorie
            </Button>
          }
          dialogTitle="Nouvelle catégorie"
          dialogDescription="Un grand chapitre du programme (ex: Fondamentaux)."
          action={createCategory}
          withDescription
        />
      </div>

      {categories.length === 0 && (
        <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
          Aucune catégorie pour le moment. Crée la première ci-dessus.
        </p>
      )}

      {categories.map((category) => {
        const isOpen = openCategories.has(category.id);
        return (
          <div key={category.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="flex flex-1 items-center gap-2 text-left"
              >
                <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", !isOpen && "-rotate-90")} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{category.title}</p>
                  {category.description && <p className="text-xs text-muted-foreground">{category.description}</p>}
                </div>
              </button>
              <TitleEditDialog
                trigger={
                  <Button variant="ghost" size="icon-sm" nativeButton={true}>
                    <Pencil className="size-3.5" />
                  </Button>
                }
                dialogTitle="Modifier la catégorie"
                dialogDescription="Titre et description de la catégorie."
                action={updateCategory.bind(null, category.id)}
                defaultTitle={category.title}
                defaultDescription={category.description ?? ""}
                withDescription
              />
              <Button
                variant="ghost"
                size="icon-sm"
                nativeButton={true}
                onClick={() => {
                  if (confirm(`Supprimer la catégorie "${category.title}" et tout son contenu ?`)) {
                    deleteCategory(category.id);
                  }
                }}
              >
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </div>

            {isOpen && (
              <div className="divide-y divide-border">
                {category.subcategories.map((sub) => (
                  <div key={sub.id} className="px-5 py-4">
                    <div className="mb-3 flex items-center gap-2">
                      <p className="flex-1 text-sm font-medium text-foreground">{sub.title}</p>
                      <TitleEditDialog
                        trigger={
                          <Button variant="ghost" size="icon-sm" nativeButton={true}>
                            <Pencil className="size-3.5" />
                          </Button>
                        }
                        dialogTitle="Modifier la sous-catégorie"
                        dialogDescription="Titre de la sous-catégorie."
                        action={updateSubcategory.bind(null, sub.id)}
                        defaultTitle={sub.title}
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        nativeButton={true}
                        onClick={() => {
                          if (confirm(`Supprimer "${sub.title}" et ses leçons ?`)) deleteSubcategory(sub.id);
                        }}
                      >
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                      <LessonEditor
                        subcategoryId={sub.id}
                        trigger={
                          <Button variant="outline" size="sm" nativeButton={true}>
                            <Plus className="size-3.5" />
                            Leçon
                          </Button>
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      {sub.lessons.length === 0 && (
                        <p className="text-xs text-muted-foreground">Aucune leçon.</p>
                      )}
                      {sub.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/20 px-3 py-2"
                        >
                          {lesson.is_published ? (
                            <CheckCircle2 className="size-3.5 shrink-0 text-emerald" />
                          ) : (
                            <Circle className="size-3.5 shrink-0 text-muted-foreground" />
                          )}
                          <span className="flex-1 truncate text-sm text-foreground">{lesson.title}</span>
                          {lesson.video_url && <Video className="size-3.5 shrink-0 text-primary" />}
                          {lesson.resources.length > 0 && (
                            <span className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
                              <FileText className="size-3 shrink-0" />
                              {lesson.resources.length}
                            </span>
                          )}
                          <TierBadge tier={lesson.min_tier} />
                          <LessonEditor
                            subcategoryId={sub.id}
                            lesson={lesson}
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
                              if (confirm(`Supprimer la leçon "${lesson.title}" ?`)) deleteLesson(lesson.id);
                            }}
                          >
                            <Trash2 className="size-3.5 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="px-5 py-3">
                  <TitleEditDialog
                    trigger={
                      <Button variant="outline" size="sm" nativeButton={true}>
                        <Plus className="size-3.5" />
                        Sous-catégorie
                      </Button>
                    }
                    dialogTitle="Nouvelle sous-catégorie"
                    dialogDescription={`Ajoute une sous-catégorie dans "${category.title}".`}
                    action={createSubcategory.bind(null, category.id)}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
