"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ExternalLink,
  Target,
  Lightbulb,
  Clapperboard,
  CheckCircle2,
  ListVideo,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  FileText,
  NotebookPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/dashboard/stat-card";
import { VideoDialog, type VideoDefaults } from "@/app/admin/veille/idees/video-dialog";
import { AccountDialog, type AccountDefaults } from "@/app/admin/veille/idees/account-dialog";
import {
  createVideo,
  updateVideo,
  deleteVideo,
  updateVideoStatus,
  createAccount,
  updateAccount,
  deleteAccount,
} from "@/app/admin/veille/idees/actions";
import { STATUSES, type IdeaStatus } from "@/app/admin/veille/idees/constants";
import type { AccountRow, VideoRow } from "@/app/admin/veille/idees/types";

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

const CATEGORY_LABELS: Record<string, string> = {
  formateur: "Formateur",
  conciergerie: "Conciergerie",
};

const ALL = "__all__";

const compactNumber = new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 });

function toVideoDefaults(video: VideoRow): VideoDefaults {
  return {
    account_id: video.account_id ?? "none",
    title: video.title,
    hook: video.hook,
    topic: video.topic,
    pain_point: video.pain_point ?? "",
    comment_themes: video.comment_themes ?? "",
    format: video.format ?? "",
    video_url: video.video_url ?? "",
    posted_at: video.posted_at ?? "",
    view_count: video.view_count?.toString() ?? "",
    like_count: video.like_count?.toString() ?? "",
    comment_count: video.comment_count?.toString() ?? "",
    share_count: video.share_count?.toString() ?? "",
    stats_captured_at: video.stats_captured_at ?? "",
    performance_note: video.performance_note ?? "",
    content_summary: video.content_summary ?? "",
    script: video.script ?? "",
  };
}

function toAccountDefaults(account: AccountRow): AccountDefaults {
  return {
    handle: account.handle,
    display_name: account.display_name ?? "",
    category: account.category ?? "none",
    platform: account.platform,
    profile_url: account.profile_url ?? "",
    follower_count: account.follower_count?.toString() ?? "",
    notes: account.notes ?? "",
  };
}

export function VideoBoard({ videos, accounts }: { videos: VideoRow[]; accounts: AccountRow[] }) {
  const [search, setSearch] = useState("");
  const [accountFilter, setAccountFilter] = useState(ALL);
  const [formatFilter, setFormatFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);

  const accountMap = useMemo(() => new Map(accounts.map((a) => [a.id, a])), [accounts]);

  const videoCountByAccount = useMemo(() => {
    const m = new Map<string, number>();
    for (const v of videos) if (v.account_id) m.set(v.account_id, (m.get(v.account_id) ?? 0) + 1);
    return m;
  }, [videos]);

  const formats = useMemo(
    () => Array.from(new Set(videos.map((v) => v.format).filter((v): v is string => Boolean(v)))).sort((a, b) => a.localeCompare(b)),
    [videos],
  );

  const accountItems = useMemo(
    () => ({ [ALL]: "Tous les comptes", ...Object.fromEntries(accounts.map((a) => [a.id, a.handle])) }),
    [accounts],
  );
  const formatItems = useMemo(() => ({ [ALL]: "Tous les formats", ...Object.fromEntries(formats.map((f) => [f, f])) }), [formats]);
  const statusItems = useMemo(() => ({ [ALL]: "Tous les statuts", ...STATUS_LABELS }), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return videos.filter((v) => {
      if (accountFilter !== ALL && v.account_id !== accountFilter) return false;
      if (formatFilter !== ALL && v.format !== formatFilter) return false;
      if (statusFilter !== ALL && v.status !== statusFilter) return false;
      if (!q) return true;
      const account = v.account_id ? accountMap.get(v.account_id) : null;
      return (
        v.title.toLowerCase().includes(q) ||
        v.hook.toLowerCase().includes(q) ||
        v.topic.toLowerCase().includes(q) ||
        (v.pain_point ?? "").toLowerCase().includes(q) ||
        (account?.handle ?? "").toLowerCase().includes(q) ||
        (account?.display_name ?? "").toLowerCase().includes(q)
      );
    });
  }, [videos, search, accountFilter, formatFilter, statusFilter, accountMap]);

  const counts = useMemo(() => {
    const base: Record<IdeaStatus, number> = { idee: 0, a_tourner: 0, tourne: 0, publie: 0 };
    for (const v of videos) base[v.status] += 1;
    return base;
  }, [videos]);

  const hasActiveFilters = search.trim() !== "" || accountFilter !== ALL || formatFilter !== ALL || statusFilter !== ALL;
  const selectedAccount = accountFilter !== ALL ? accountMap.get(accountFilter) : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Lightbulb} label="Idées" value={String(counts.idee)} hint="Pas encore planifiées" />
        <StatCard icon={ListVideo} label="À tourner" value={String(counts.a_tourner)} hint="Prêtes à passer en prod" />
        <StatCard icon={Clapperboard} label="Tourné" value={String(counts.tourne)} hint="En attente de publication" />
        <StatCard icon={CheckCircle2} label="Publié" value={String(counts.publie)} hint="Déjà en ligne" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Users className="size-4 text-primary" />
            Comptes suivis ({accounts.length})
          </h2>
          <AccountDialog
            trigger={
              <Button variant="outline" size="sm" nativeButton={true}>
                <Plus className="size-3.5" />
                Ajouter un compte
              </Button>
            }
            dialogTitle="Ajouter un compte"
            action={createAccount}
          />
        </div>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          <button
            type="button"
            onClick={() => setAccountFilter(ALL)}
            className={`shrink-0 rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              accountFilter === ALL ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:bg-muted/50"
            }`}
          >
            Tous les comptes
            <span className="ml-2 text-xs text-muted-foreground">{videos.length}</span>
          </button>

          {accounts.map((account) => (
            <div
              key={account.id}
              className={`group relative shrink-0 rounded-xl border px-4 py-2.5 pr-14 transition-colors ${
                accountFilter === account.id ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted/50"
              }`}
            >
              <button
                type="button"
                onClick={() => setAccountFilter(accountFilter === account.id ? ALL : account.id)}
                className="text-left"
              >
                <span className={`block text-sm font-semibold whitespace-nowrap ${accountFilter === account.id ? "text-primary" : "text-foreground"}`}>
                  {account.handle}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground">
                  {account.category && <span>{CATEGORY_LABELS[account.category]}</span>}
                  {account.follower_count != null && <span>{compactNumber.format(account.follower_count)} abonnés</span>}
                  <span>· {videoCountByAccount.get(account.id) ?? 0} vidéo{(videoCountByAccount.get(account.id) ?? 0) > 1 ? "s" : ""}</span>
                </span>
              </button>
              <div className="absolute top-1.5 right-1 flex items-center opacity-0 group-hover:opacity-100">
                <AccountDialog
                  trigger={
                    <Button variant="ghost" size="icon-sm" nativeButton={true} aria-label={`Modifier ${account.handle}`}>
                      <Pencil className="size-3" />
                    </Button>
                  }
                  dialogTitle={`Modifier ${account.handle}`}
                  action={updateAccount.bind(null, account.id)}
                  defaults={toAccountDefaults(account)}
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  nativeButton={true}
                  aria-label={`Supprimer ${account.handle}`}
                  onClick={() => {
                    if (confirm(`Supprimer le compte ${account.handle} ? Ses vidéos resteront mais ne seront plus reliées à ce compte.`)) {
                      deleteAccount(account.id);
                    }
                  }}
                >
                  <Trash2 className="size-3 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {selectedAccount && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {selectedAccount.handle}
                {selectedAccount.display_name ? ` — ${selectedAccount.display_name}` : ""}
              </p>
              {selectedAccount.notes && <p className="mt-0.5 text-xs text-muted-foreground">{selectedAccount.notes}</p>}
            </div>
            {selectedAccount.profile_url && (
              <a
                href={selectedAccount.profile_url}
                target="_blank"
                rel="noreferrer"
                className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Voir le profil
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un hook, un compte, un sujet…"
              className="pl-8"
            />
          </div>
          <Select value={accountFilter} items={accountItems} onValueChange={(v) => setAccountFilter(String(v))}>
            <SelectTrigger className="w-auto min-w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Tous les comptes</SelectItem>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.handle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={formatFilter} items={formatItems} onValueChange={(v) => setFormatFilter(String(v))}>
            <SelectTrigger className="w-auto min-w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Tous les formats</SelectItem>
              {formats.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
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
        <VideoDialog
          trigger={
            <Button nativeButton={true} className="shrink-0">
              <Plus className="size-4" />
              Nouvelle vidéo
            </Button>
          }
          dialogTitle="Nouvelle vidéo repérée"
          action={createVideo}
          accounts={accounts}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
          {hasActiveFilters ? "Aucune vidéo ne correspond à cette recherche." : "Aucune vidéo pour l'instant — clique sur « Nouvelle vidéo » pour commencer."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} account={video.account_id ? (accountMap.get(video.account_id) ?? null) : null} accounts={accounts} />
          ))}
        </div>
      )}
    </div>
  );
}

function VideoCard({ video, account, accounts }: { video: VideoRow; account: AccountRow | null; accounts: AccountRow[] }) {
  const [, startTransition] = useTransition();

  const hasStats = video.view_count != null || video.like_count != null || video.comment_count != null || video.share_count != null;

  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <Select
          value={video.status}
          items={STATUS_LABELS}
          onValueChange={(v) => startTransition(() => updateVideoStatus(video.id, v as IdeaStatus))}
        >
          <SelectTrigger
            className={`h-6 w-fit gap-1 rounded-full border-none px-2.5 text-[11px] font-medium ${STATUS_BADGE[video.status]}`}
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
          <VideoDialog
            trigger={
              <Button variant="ghost" size="icon-sm" nativeButton={true} aria-label="Modifier">
                <Pencil className="size-3.5" />
              </Button>
            }
            dialogTitle="Modifier la vidéo"
            action={updateVideo.bind(null, video.id)}
            accounts={accounts}
            defaults={toVideoDefaults(video)}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={true}
            aria-label="Supprimer"
            onClick={() => {
              if (confirm(`Supprimer "${video.title}" ?`)) deleteVideo(video.id);
            }}
          >
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        </div>
      </div>

      {account && (
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
          {account.handle}
        </span>
      )}

      <h3 className="font-semibold text-foreground">{video.title}</h3>
      <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-pretty text-foreground italic">&laquo;&nbsp;{video.hook}&nbsp;&raquo;</p>

      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
          {video.topic}
        </span>
        {video.pain_point && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-medium text-gold-foreground">
            <Target className="size-3" />
            {video.pain_point}
          </span>
        )}
        {video.format && (
          <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {video.format}
          </span>
        )}
      </div>

      {hasStats ? (
        <div className="flex flex-wrap items-center gap-3 rounded-lg bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          {video.view_count != null && (
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {compactNumber.format(video.view_count)}
            </span>
          )}
          {video.like_count != null && (
            <span className="flex items-center gap-1">
              <Heart className="size-3.5" />
              {compactNumber.format(video.like_count)}
            </span>
          )}
          {video.comment_count != null && (
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3.5" />
              {compactNumber.format(video.comment_count)}
            </span>
          )}
          {video.share_count != null && (
            <span className="flex items-center gap-1">
              <Share2 className="size-3.5" />
              {compactNumber.format(video.share_count)}
            </span>
          )}
          {video.stats_captured_at && <span className="ml-auto whitespace-nowrap">relevées le {video.stats_captured_at}</span>}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">Stats non relevées pour l&apos;instant</p>
      )}

      {video.comment_themes && (
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Viewers cherchent : </span>
          {video.comment_themes}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          {video.content_summary && (
            <span className="flex items-center gap-1" title="Résumé structuré renseigné">
              <FileText className="size-3.5" />
            </span>
          )}
          {video.script && (
            <span className="flex items-center gap-1" title="Script perso renseigné">
              <NotebookPen className="size-3.5" />
            </span>
          )}
          {!video.content_summary && !video.script && video.performance_note && <span className="truncate">{video.performance_note}</span>}
        </span>
        {video.video_url && (
          <a href={video.video_url} target="_blank" rel="noreferrer" className="flex shrink-0 items-center gap-1 hover:text-primary" aria-label="Voir la vidéo source">
            <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
