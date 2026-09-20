const TRANSLATIONS: Record<string, string> = {
  "Invalid login credentials": "Email ou mot de passe incorrect.",
  "Email not confirmed": "Merci de confirmer votre email avant de vous connecter.",
  "User already registered": "Un compte existe déjà avec cet email.",
  "Password should be at least 6 characters": "Le mot de passe doit contenir au moins 6 caractères.",
  "Unable to validate email address: invalid format": "Adresse email invalide.",
  "For security purposes, you can only request this after": "Merci de patienter avant de réessayer.",
};

export function translateAuthError(message: string): string {
  for (const [key, value] of Object.entries(TRANSLATIONS)) {
    if (message.includes(key)) return value;
  }
  return "Une erreur est survenue. Merci de réessayer.";
}
