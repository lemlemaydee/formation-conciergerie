import { Reveal } from "@/components/landing/reveal";
import { MarqueeLogoScroller } from "@/components/ui/marquee-logo-scroller";

const LOGOS = [
  { src: "/logos/airbnb.svg", alt: "Airbnb", gradient: { from: "#FF8A8E", via: "#FF5A5F", to: "#C62828" } },
  { src: "/logos/booking.svg", alt: "Booking.com", gradient: { from: "#4D7FD1", via: "#003A9A", to: "#001F52" } },
  { src: "/logos/expedia.svg", alt: "Expedia", gradient: { from: "#3B4374", via: "#191E3B", to: "#0A0D1D" } },
  { src: "/logos/google.svg", alt: "Google", gradient: { from: "#8AB4F8", via: "#4285F4", to: "#1A56C4" } },
  { src: "/logos/tripadvisor.svg", alt: "Tripadvisor", gradient: { from: "#7FF0C3", via: "#34E0A1", to: "#0E9A6C" } },
  { src: "/logos/hotels-com.svg", alt: "Hotels.com", gradient: { from: "#FF7A87", via: "#EF3346", to: "#B0121F" } },
];

export function PlatformsSection() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <MarqueeLogoScroller
            title="Vos annonces, diffusées sur les plateformes qui comptent"
            description="On gère la présence de vos biens sur les principaux canaux de réservation — configuration, tarifs et disponibilités, synchronisés automatiquement."
            logos={LOGOS}
          />
        </Reveal>
      </div>
    </section>
  );
}
