import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Fondations du projet
      </p>
      <h1 className="max-w-xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Formation & Conciergerie Airbnb
      </h1>
      <p className="max-w-md text-muted-foreground">
        Next.js 16 · Tailwind CSS v4 · shadcn/ui · Supabase — prêt pour la suite.
      </p>
      <Button size="lg">Rejoindre la formation</Button>
    </div>
  );
}
