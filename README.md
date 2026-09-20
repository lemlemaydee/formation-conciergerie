# Formation & Conciergerie Airbnb

Plateforme de formation, communauté et conciergerie Airbnb : landing page, tunnel de vente, dashboard élève et back-office admin.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com) (auth, base de données, storage)

## Démarrer en local

```bash
npm install
cp .env.local.example .env.local   # puis renseigner les clés Supabase
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Déploiement

Déployé sur [Vercel](https://vercel.com), branché sur ce dépôt GitHub (déploiement automatique à chaque push sur `main`). Les variables d'environnement (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) sont configurées dans les réglages du projet Vercel.
