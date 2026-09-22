import Link from "next/link";
import { FAQ } from "@/components/ui/faq-tabs";
import { Reveal } from "@/components/landing/reveal";

const categories = {
  formation: "Formation",
  communaute: "Communauté & lives",
  tarifs: "Tarifs & paiement",
};

const faqData = {
  formation: [
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
      question: "Combien de temps faut-il pour suivre le programme ?",
      answer:
        "Le programme est conçu pour être suivi à votre rythme : comptez plusieurs semaines pour parcourir l'ensemble des modules en profondeur, en parallèle de votre activité.",
    },
  ],
  communaute: [
    {
      question: "Qu'est-ce qui est inclus dans la communauté ?",
      answer:
        "Des espaces d'échange par thématique, du partage de documents et un live hebdomadaire avec les formateurs. Offerte à vie dès le palier Croissance.",
    },
    {
      question: "Comment se déroulent les lives ?",
      answer:
        "Chaque semaine, en visio avec partage d'écran, pour répondre à vos questions et creuser un sujet du programme.",
    },
    {
      question: "Puis-je accéder à la communauté sans acheter la formation ?",
      answer:
        "Oui, un abonnement à 49 €/mois donne accès à la communauté et aux lives indépendamment de la formation.",
    },
  ],
  tarifs: [
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
    {
      question: "Quelle est la différence entre Starter et Croissance ?",
      answer:
        "Le contenu s'adapte à l'échelle de votre activité, et le palier Croissance inclut en plus la communauté à vie ainsi que l'accès aux lives.",
    },
  ],
};

export function FaqSection() {
  return (
    <Reveal>
      <FAQ
        id="faq"
        subtitle="Une question ?"
        title="Questions fréquentes"
        className="border-t border-border"
        categories={categories}
        faqData={faqData}
        footer={
          <p className="text-sm text-muted-foreground">
            Vous ne trouvez pas votre réponse ?{" "}
            <Link href="/contact" className="font-medium text-primary underline-offset-4 hover:underline">
              Réservez un appel
            </Link>
          </p>
        }
      />
    </Reveal>
  );
}
