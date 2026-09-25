import type { IdeaStatus } from "@/app/admin/veille/idees/constants";

export interface AccountRow {
  id: string;
  handle: string;
  display_name: string | null;
  category: "formateur" | "conciergerie" | null;
  platform: string;
  profile_url: string | null;
  follower_count: number | null;
  notes: string | null;
}

export interface VideoRow {
  id: string;
  account_id: string | null;
  title: string;
  hook: string;
  topic: string;
  pain_point: string | null;
  comment_themes: string | null;
  format: string | null;
  video_url: string | null;
  posted_at: string | null;
  view_count: number | null;
  like_count: number | null;
  comment_count: number | null;
  share_count: number | null;
  stats_captured_at: string | null;
  performance_note: string | null;
  content_summary: string | null;
  script: string | null;
  status: IdeaStatus;
}
