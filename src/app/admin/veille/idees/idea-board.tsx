"use client";

import { useMemo, useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Search, ExternalLink, Target, Lightbulb, Clapperboard, CheckCircle2, ListVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/dashboard/stat-card";
import { IdeaDialog, type IdeaDefaults } from "@/app/admin/veille/idees/idea-dialog";
import { createIdea, updateIdea, deleteIdea, updateIdeaStatus } from "@/app/admin/veille/idees/actions";
import { STATUSES, type IdeaStatus } from "@/app/admin/veille/idees/constants";

export interface IdeaRow {
  id: string;
  title: string;
  hook: string;
  topic: string;
  pain_point: string | null;
  format: string | null;
  source_label: string | null;
  source_url: string | null;
  performance_note: string | null;
  status: IdeaStatus;
  script: string | null;
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

function toDefaults(idea: IdeaRow): IdeaDefaults {
  return {
    title: idea.title,
    hook: idea.hook,
    topic: idea.topic,
    pain_point: idea.pain_point ?? "",
    format: idea.format ?? "",
    source_label: idea.source_label ?? "",
    source_url: idea.source_url ?? "",
    performance_note: idea.performance_note ?? "",
    script: idea.script ?? "",
  };
}

export function IdeaBoard({ ideas }: { ideas: IdeaRow[] }) {
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState(ALL);
  const [painFilter, setPainFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);

  const topics = useMemo(() => Array.from(new Set(ideas.map((i) => i.topic))).sort((a, b) => a.localeCompare(b)), [ideas]);
  const painPoints = useMemo(
    () => Array.from(new Set(ideas.map((i) => i.pain_point).filter((v): v is string => Boolean(v)))).sort((a, b) => a.localeCompare(b)),
    [ideas],
  );

  const topicItems = useMemo(
    () => ({ [ALL]: "Tous les sujets", ...Object.fromEntries(topics.map((t) => [t, t])) }),
    [topics],
  );
  const painItems = useMemo(
    () => ({ [ALL]: "Tous les pain points", ...Object.fromEntries(painPoints.map((p) => [p, p])) }),
    [painPoints],
  );
  const statusItems = useMemo(
    () => ({ [ALL]: "Tous les statuts", ...STATUS_LABELS }),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ideas.filter((idea) => {
      if (topicFilter !== ALL && idea.topic !== topicFilter) return false;
      if (painFilter !== ALL && idea.pain_point !== painFilter) return false;
      if (statusFilter !== ALL && idea.status !== statusFilter) return false;
      if (!q) return true;
      return (
        idea.title.toLowerCase().includes(q) ||
        idea.hook.toLowerCase().includes(q) ||
        idea.topic.toLowerCase().includes(q) ||
        (idea.pain_point ?? "").toLowerCase().includes(q)
      );
    });
  }, [ideas, search, topicFilter, painFilter, statusFilter]);

  const counts = useMemo(() => {
    const base: Record<IdeaStatus, number> = { idee: 0, a_tourner: 0, tourne: 0, publie: 0 };
    for (const idea of ideas) base[idea.status] += 1;
    return base;
  }, [ideas]);

  const hasActiveFilters = search.trim() !== "" || topicFilter !== ALL || painFilter !== ALL || statusFilter !== ALL;

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
              placeholder="Rechercher un hook, un sujet…"
              className="pl-8"
            />
          </div>
          <Select value={topicFilter} items={topicItems} onValueChange={(v) => setTopicFilter(String(v))}>
            <SelectTrigger className="w-auto min-w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Tous les sujets</SelectItem>
              {topics.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={painFilter} items={painItems} onValueChange={(v) => setPainFilter(String(v))}>
            <SelectTrigger className="w-auto min-w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Tous les pain points</SelectItem>
              {painPoints.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <IdeaDialog
          trigger={
            <Button nativeButton={true} className="shrink-0">
              <Plus className="size-4" />
              Nouvelle idée
            </Button>
          }
          dialogTitle="Nouvelle idée de vidéo"
          action={createIdea}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
          {hasActiveFilters ? "Aucune idée ne correspond à cette recherche." : "Aucune idée pour l'instant — clique sur « Nouvelle idée » pour commencer."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}

function IdeaCard({ idea }: { idea: IdeaRow }) {
  const [, startTransition] = useTransition();

  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <Select
          value={idea.status}
          items={STATUS_LABELS}
          onValueChange={(v) => startTransition(() => updateIdeaStatus(idea.id, v as IdeaStatus))}
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
          <IdeaDialog
            trigger={
              <Button variant="ghost" size="icon-sm" nativeButton={true} aria-label="Modifier">
                <Pencil className="size-3.5" />
              </Button>
            }
            dialogTitle="Modifier l'idée"
            action={updateIdea.bind(null, idea.id)}
            defaults={toDefaults(idea)}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={true}
            aria-label="Supprimer"
            onClick={() => {
              if (confirm(`Supprimer "${idea.title}" ?`)) deleteIdea(idea.id);
            }}
          >
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        </div>
      </div>

      <h3 className="font-semibold text-foreground">{idea.title}</h3>
      <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-pretty text-foreground italic">&laquo;&nbsp;{idea.hook}&nbsp;&raquo;</p>

      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
          {idea.topic}
        </span>
        {idea.pain_point && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-medium text-gold-foreground">
            <Target className="size-3" />
            {idea.pain_point}
          </span>
        )}
        {idea.format && (
          <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {idea.format}
          </span>
        )}
      </div>

      {(idea.source_label || idea.performance_note || idea.source_url) && (
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="min-w-0 truncate">{idea.source_label}</span>
          <span className="flex shrink-0 items-center gap-2">
            {idea.performance_note && <span className="whitespace-nowrap">{idea.performance_note}</span>}
            {idea.source_url && (
              <a href={idea.source_url} target="_blank" rel="noreferrer" className="hover:text-primary" aria-label="Voir la vidéo source">
                <ExternalLink className="size-3.5" />
              </a>
            )}
          </span>
        </div>
      )}
    </article>
  );
}
