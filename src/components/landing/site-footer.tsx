import Link from "next/link";
import type { SVGProps } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.76 4.9 4.9 0 0 1-1.76 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.76-1.15 4.9 4.9 0 0 1-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76a4.9 4.9 0 0 1 1.76-1.15c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97V21h-4V9Z" />
    </svg>
  );
}

function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12s0-3.2-.4-4.7a2.94 2.94 0 0 0-2.1-2.1C18 4.8 12 4.8 12 4.8s-6 0-7.5.4a2.94 2.94 0 0 0-2.1 2.1C2 8.8 2 12 2 12s0 3.2.4 4.7c.24 1 .96 1.86 2.1 2.1 1.5.4 7.5.4 7.5.4s6 0 7.5-.4a2.94 2.94 0 0 0 2.1-2.1c.4-1.5.4-4.7.4-4.7ZM10 15.3V8.7l5.2 3.3-5.2 3.3Z" />
    </svg>
  );
}

const COLUMNS = [
  {
    title: "Produit",
    links: [
      { label: "Formation", href: "/formation" },
      { label: "Services conciergerie", href: "/services" },
      { label: "Tarifs", href: "/tarifs" },
      { label: "Communauté", href: "/communaute" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Témoignages", href: "/temoignages" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "CGV", href: "/cgv" },
      { label: "CGU", href: "/cgu" },
      { label: "Confidentialité", href: "/confidentialite" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                FC
              </span>
              <span className="text-base font-semibold text-foreground">
                Formation Conciergerie
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Formation, communauté et conciergerie déléguée pour les
              professionnels de la location courte durée.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { Icon: InstagramIcon, label: "Instagram" },
                { Icon: LinkedinIcon, label: "LinkedIn" },
                { Icon: YoutubeIcon, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold text-foreground">{column.title}</p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Newsletter</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Conseils conciergerie, une fois par mois.
              </p>
            </div>
            <form className="flex w-full max-w-sm gap-2">
              <Input type="email" placeholder="vous@email.com" className="bg-background" />
              <Button type="submit" className="shrink-0">
                S&apos;inscrire
              </Button>
            </form>
          </div>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Formation Conciergerie. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
