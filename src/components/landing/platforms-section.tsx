import { Reveal } from "@/components/landing/reveal";
import { LogoCloud } from "@/components/ui/logo-cloud";
import {
  AirbnbIcon,
  BookingComIcon,
  ExpediaIcon,
  GoogleIcon,
  TripAdvisorIcon,
  HotelsComIcon,
} from "@/components/ui/brand-icons";

const LOGOS = [AirbnbIcon, BookingComIcon, ExpediaIcon, GoogleIcon, TripAdvisorIcon, HotelsComIcon];

export function PlatformsSection() {
  return (
    <section className="border-t border-border bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <LogoCloud
            label="On diffuse et gère vos annonces sur les plateformes qui comptent"
            logos={LOGOS.map((Icon, i) => (
              <Icon key={i} className="h-6 w-auto shrink-0 text-muted-foreground transition-colors hover:text-foreground sm:h-7" />
            ))}
          />
        </Reveal>
      </div>
    </section>
  );
}
