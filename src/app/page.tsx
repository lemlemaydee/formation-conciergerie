import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { ProgrammeSection } from "@/components/landing/programme-section";
import { TeamSection } from "@/components/landing/team-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CommunityPreview } from "@/components/landing/community-preview";
import { PricingPreview } from "@/components/landing/pricing-preview";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCta } from "@/components/landing/final-cta";
import { SiteFooter } from "@/components/landing/site-footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <ProblemSection />
        <ProgrammeSection />
        <TeamSection />
        <HowItWorks />
        <TestimonialsSection />
        <CommunityPreview />
        <PricingPreview />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
