export const STATUSES = ["idee", "a_tourner", "tourne", "publie"] as const;
export type IdeaStatus = (typeof STATUSES)[number];
