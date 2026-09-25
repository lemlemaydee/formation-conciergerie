"use client";

import { useMemo, useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Search, Lightbulb, Clapperboard, CheckCircle2, ListVideo, Quote, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/dashboard/stat-card";
import { CalendarIdeaDialog, type CalendarIdeaDefaults } from "@/app/admin/veille/idees/calendrier/idea-dialog";
import {
  createCalendarIdea,
  updateCalendarIdea,
  deleteCalendarIdea,
  updateCalendarIdeaStatus,
} from "@/app/admin/veille/idees/calendrier/actions";
import { STATUSES, type IdeaStatus } from "@/app/admin/veille/idees/constants";

export interface CalendarIdeaRow {
  id: string;
  title: string;
  angle: string;
  format_inspiration: string | null;
  pain_point: string | null;
  inspired_by: string | null;
  suggested_hook: string | null;
  script: string | null;
  status: IdeaStatus;
}

const STATUS_LABELS: Record<IdeaStatus, string> = {
  idee: "Idée",
  a_tourner: "À tourner",
  tourne: "Tourné",
  publie: "Publié",
};

const STATUS_BADGE: Record<IdeaStatus, string> = {
  idee: "bg-muted text-muted-foreground",
  a_tourner: "bg-gold/15 text-gold-foreground",
  tourne: "bg-primary/10 text-primary",
  publie: "bg-emerald/15 text-emerald-foreground",
};

const ALL = "__all__";

function toDefaults(idea: CalendarIdeaRow): CalendarIdeaDefaults {
  return {
    title: idea.title,
    angle: idea.angle,
    format_inspiration: idea.format_inspiration ?? "",
    pain_point: idea.pain_point ?? "",
    inspired_by: idea.inspired_by ?? "",
    suggested_hook: idea.suggested_hook ?? "",
    script: idea.script ?? "",
  };
}

export function CalendarBoard({ ideas }: { ideas: CalendarIdeaRow[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL);

  const statusItems = useMemo(() => ({ [ALL]: "Tous les statuts", ...STATUS_LABELS }), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ideas.filter((idea) => {
      if (statusFilter !== ALL && idea.status !== statusFilter) return false;
      if (!q) return true;
      return (
        idea.title.toLowerCase().includes(q) ||
        idea.angle.toLowerCase().includes(q) ||
        (idea.pain_point ?? "").toLowerCase().includes(q)
      );
    });
  }, [ideas, search, statusFilter]);

  const counts = useMemo(() => {
    const base: Record<IdeaStatus, number> = { idee: 0, a_tourner: 0, tourne: 0, publie: 0 };
    for (const idea of ideas) base[idea.status] += 1;
    return base;
  }, [ideas]);

  const hasActiveFilters = search.trim() !== "" || statusFilter !== ALL;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Lightbulb} label="Idées" value={String(counts.idee)} hint="Pas encore planifiées" />
        <StatCard icon={ListVideo} label="À tourner" value={String(counts.a_tourner)} hint="Prêtes à passer en prod" />
        <StatCard icon={Clapperboard} label="Tourné" value={String(counts.tourne)} hint="En attente de publication" />
        <StatCard icon={CheckCircle2} label="Publié" value={String(counts.publie)} hint="Déjà en ligne" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une idée, un pain point…"
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} items={statusItems} onValueChange={(v) => setStatusFilter(String(v))}>
            <SelectTrigger className="w-auto min-w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Tous les statuts</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CalendarIdeaDialog
          trigger={
            <Button nativeButton={true} className="shrink-0">
              <Plus className="size-4" />
              Nouvelle idée
            </Button>
          }
          dialogTitle="Nouvelle idée de vidéo"
          action={createCalendarIdea}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
          {hasActiveFilters ? "Aucune idée ne correspond à cette recherche." : "Aucune idée pour l'instant."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}

function IdeaCard({ idea }: { idea: CalendarIdeaRow }) {
  const [, startTransition] = useTransition();

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <Select
          value={idea.status}
          items={STATUS_LABELS}
          onValueChange={(v) => startTransition(() => updateCalendarIdeaStatus(idea.id, v as IdeaStatus))}
        >
          <SelectTrigger
            className={`h-6 w-fit gap-1 rounded-full border-none px-2.5 text-[11px] font-medium ${STATUS_BADGE[idea.status]}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex shrink-0 items-center gap-0.5">
          <CalendarIdeaDialog
            trigger={
              <Button variant="ghost" size="icon-sm" nativeButton={true} aria-label="Modifier">
                <Pencil className="size-3.5" />
              </Button>
            }
            dialogTitle="Modifier l'idée"
            action={updateCalendarIdea.bind(null, idea.id)}
            defaults={toDefaults(idea)}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={true}
            aria-label="Supprimer"
            onClick={() => {
              if (confirm(`Supprimer "${idea.title}" ?`)) deleteCalendarIdea(idea.id);
            }}
          >
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        </div>
      </div>

      <h3 className="font-semibold text-foreground">{idea.title}</h3>
      <p className="text-sm text-muted-foreground">{idea.angle}</p>

      <div className="flex flex-wrap gap-1.5">
        {idea.pain_point && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-medium text-gold-foreground">
            <Target className="size-3" />
            {idea.pain_point}
          </span>
        )}
        {idea.format_inspiration && (
          <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {idea.format_inspiration}
          </span>
        )}
      </div>

      {idea.suggested_hook && (
        <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-pretty text-foreground italic">
          &laquo;&nbsp;{idea.suggested_hook}&nbsp;&raquo;
        </p>
      )}

      {idea.script && (
        <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
          <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
          <p className="text-xs text-foreground/90">
            <span className="font-semibold text-foreground">Notre script : </span>
            {idea.script}
          </p>
        </div>
      )}

      {idea.inspired_by && (
        <div className="mt-auto flex items-start gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
          <Quote className="mt-0.5 size-3 shrink-0" />
          <span>{idea.inspired_by}</span>
        </div>
      )}
    </article>
  );
}
