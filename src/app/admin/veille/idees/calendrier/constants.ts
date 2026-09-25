export const CATEGORIES = ["conciergerie", "mindset", "motivation", "personal_branding"] as const;
export type CalendarCategory = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<CalendarCategory, string> = {
  conciergerie: "Conciergerie",
  mindset: "Mindset",
  motivation: "Motivation",
  personal_branding: "Personal branding",
};

export const FUNNEL_STAGES = ["general", "concret", "cta"] as const;
export type FunnelStage = (typeof FUNNEL_STAGES)[number];

export const FUNNEL_STAGE_LABELS: Record<FunnelStage, string> = {
  general: "Général",
  concret: "Concret",
  cta: "CTA",
};

export const FUNNEL_STAGE_HINTS: Record<FunnelStage, string> = {
  general: "Haut de tunnel — large audience, pas d'engagement demandé",
  concret: "Milieu de tunnel — valeur pratique, construit la confiance",
  cta: "Bas de tunnel — pousse vers la formation gratuite",
};
