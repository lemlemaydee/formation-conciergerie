import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "L'accès à la formation est-il limité dans le temps ?",
    answer:
      "Non, l'accès aux vidéos de votre palier est à vie, mises à jour futures incluses.",
  },
  {
    question: "Faut-il déjà avoir une société pour commencer ?",
    answer:
      "Non. La formation Starter est justement pensée pour démarrer de zéro, sans expérience préalable.",
  },
  {
    question: "Qu'est-ce qui est inclus dans la communauté ?",
    answer:
      "Des espaces d'échange par thématique, du partage de documents et un live hebdomadaire avec les formateurs. Offerte à vie dès le palier Croissance.",
  },
  {
    question: "Est-il possible de payer en plusieurs fois ?",
    answer:
      "Oui, le paiement en 2 ou 3 fois sans frais est disponible sur les paliers Starter et Croissance.",
  },
  {
    question: "Comment fonctionne le palier sur-mesure ?",
    answer:
      "Pour les conciergeries de plus de 100 biens ou la conciergerie villa de luxe, nous étudions votre situation lors d'un appel puis établissons un devis personnalisé.",
  },
];

export function FaqSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            Questions fréquentes
          </h2>
        </div>

        <Accordion className="mt-10 w-full">
          {FAQS.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
