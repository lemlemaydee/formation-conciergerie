// Structure d'exemple du programme — à remplacer par les vraies données
// (catégories, sous-catégories, vidéos) une fois le contenu chargé depuis l'admin.

export interface MockLesson {
  title: string;
  duration: string;
  done: boolean;
}

export interface MockCategory {
  title: string;
  lessons: MockLesson[];
}

export const MOCK_CATEGORIES: MockCategory[] = [
  {
    title: "Fondamentaux",
    lessons: [
      { title: "Bien démarrer sa conciergerie", duration: "12 min", done: true },
      { title: "Choisir son statut juridique", duration: "18 min", done: true },
      { title: "Structurer son offre", duration: "15 min", done: false },
    ],
  },
  {
    title: "Acquisition de propriétaires",
    lessons: [
      { title: "Trouver ses premiers propriétaires", duration: "20 min", done: true },
      { title: "Le script de démarchage", duration: "14 min", done: false },
      { title: "Convaincre sur le prix", duration: "16 min", done: false },
    ],
  },
  {
    title: "Opérations & ménage",
    lessons: [
      { title: "Organiser le ménage", duration: "17 min", done: false },
      { title: "Check-in / check-out sans friction", duration: "13 min", done: false },
    ],
  },
  {
    title: "Outils & automatisation",
    lessons: [
      { title: "Choisir son channel manager", duration: "22 min", done: false },
      { title: "Automatiser la messagerie voyageurs", duration: "19 min", done: false },
    ],
  },
];

export function computeProgress(categories: MockCategory[]) {
  const all = categories.flatMap((c) => c.lessons);
  const done = all.filter((l) => l.done).length;
  return { done, total: all.length, percent: Math.round((done / all.length) * 100) };
}
