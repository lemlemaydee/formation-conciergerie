import { redirect } from "next/navigation";

// Le contenu de cette page vit maintenant sur "/" (page d'accueil).
export default function MasterclassRedirect() {
  redirect("/");
}
