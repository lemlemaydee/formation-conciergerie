"use client";

import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ToolDialog } from "@/app/admin/outils/tool-dialog";
import { createTool, updateTool, deleteTool, toggleToolActive } from "@/app/admin/outils/actions";

export interface ToolRow {
  id: string;
  name: string;
  description: string | null;
  url: string;
  category: string | null;
  is_active: boolean;
}

export function ToolList({ tools }: { tools: ToolRow[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ToolDialog
          trigger={
            <Button nativeButton={true}>
              <Plus className="size-4" />
              Nouvel outil
            </Button>
          }
          dialogTitle="Nouvel outil recommandé"
          action={createTool}
        />
      </div>

      {tools.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
          Aucun outil pour le moment.
        </p>
      ) : (
        <div className="space-y-2">
          {tools.map((tool) => (
            <div key={tool.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <Switch
                checked={tool.is_active}
                onCheckedChange={(checked) => toggleToolActive(tool.id, Boolean(checked))}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{tool.name}</p>
                  {tool.category && <Badge variant="outline">{tool.category}</Badge>}
                  {!tool.is_active && <Badge variant="secondary">Masqué</Badge>}
                </div>
                {tool.description && <p className="truncate text-xs text-muted-foreground">{tool.description}</p>}
              </div>
              <a href={tool.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                <ExternalLink className="size-4" />
              </a>
              <ToolDialog
                trigger={
                  <Button variant="ghost" size="icon-sm" nativeButton={true}>
                    <Pencil className="size-3.5" />
                  </Button>
                }
                dialogTitle="Modifier l'outil"
                action={updateTool.bind(null, tool.id)}
                defaults={{
                  name: tool.name,
                  description: tool.description ?? "",
                  url: tool.url,
                  category: tool.category ?? "",
                }}
              />
              <Button
                variant="ghost"
                size="icon-sm"
                nativeButton={true}
                onClick={() => {
                  if (confirm(`Supprimer "${tool.name}" ?`)) deleteTool(tool.id);
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
