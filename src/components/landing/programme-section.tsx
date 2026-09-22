import Link from "next/link";
import { Compass, Scale, Wrench, Target, Camera, Workflow, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/landing/reveal";
import { GradientText } from "@/components/landing/gradient-text";

const ICONS = [Compass, Scale, Wrench, Target, Camera, Workflow, TrendingUp];
const ACCENTS = [
  { bg: "bg-primary/10 text-primary", dot: "bg-primary" },
  { bg: "bg-gold/15 text-gold", dot: "bg-gold" },
  { bg: "bg-emerald/10 text-emerald", dot: "bg-emerald" },
];

interface ProgrammeModule {
  title: string;
  lessons: string[];
}

interface ProgrammeCategory {
  title: string;
  modules: ProgrammeModule[];
}

// Filet de sécurité si la requête échoue : la vraie source est la table
// `categories` (gérée depuis /admin/contenus), pas ce tableau.
const FALLBACK: ProgrammeCategory[] = [
  {
    title: "Fondamentaux & stratégie",
    modules: [
      {
        title: "Bienvenue & plan de bataille",
        lessons: ["Les 4 business models", "Le plan 30/60/90 jours de l'élève"],
      },
    ],
  },
];

async function getProgramme(): Promise<ProgrammeCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(
      "title, order_index, subcategories(title, order_index, lessons(title, order_index))",
    )
    .order("order_index");

  if (error || !data || data.length === 0) return FALLBACK;

  return data.map((category) => ({
    title: category.title,
    modules: [...(category.subcategories ?? [])]
      .sort((a, b) => a.order_index - b.order_index)
      .map((sub) => ({
        title: sub.title,
        lessons: [...(sub.lessons ?? [])]
          .sort((a, b) => a.order_index - b.order_index)
          .map((l) => l.title),
      })),
  }));
}

export async function ProgrammeSection() {
  const categories = await getProgramme();

  return (
    <section id="programme" className="scroll-mt-20 border-t border-border bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
            <GradientText>Le programme</GradientText>, en détail
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            24 modules, directement issus de notre propre activité de conciergerie. Ouvrez chaque
            thème pour voir exactement ce que vous allez apprendre.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion className="mt-12 w-full space-y-3">
            {categories.map((category, i) => {
              const Icon = ICONS[i % ICONS.length];
              const accent = ACCENTS[i % ACCENTS.length];
              const lessonCount = category.modules.reduce((sum, m) => sum + m.lessons.length, 0);

              return (
                <AccordionItem
                  key={category.title}
                  value={category.title}
                  className="rounded-2xl border border-border bg-card px-5 shadow-sm not-last:border-b"
                >
                  <AccordionTrigger className="py-5 hover:no-underline">
                    <div className="flex flex-1 items-center gap-4 text-left">
                      <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${accent.bg}`}>
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <span className="text-base font-semibold text-foreground">{category.title}</span>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {category.modules.length} module{category.modules.length > 1 ? "s" : ""} ·{" "}
                          {lessonCount} leçons
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="ml-14 space-y-5 pb-2">
                      {category.modules.map((module) => (
                        <div key={module.title}>
                          <p className="text-sm font-semibold text-foreground">{module.title}</p>
                          <ul className="mt-2 space-y-2">
                            {module.lessons.map((lesson) => (
                              <li key={lesson} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${accent.dot}`} />
                                {lesson}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Reveal>

        <Reveal delay={0.15} className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Une question sur un module en particulier ?{" "}
            <Link
              href="/contact"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Réservez un appel
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
