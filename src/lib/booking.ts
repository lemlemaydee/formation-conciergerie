const OPEN_HOUR = 10;
const CLOSE_HOUR = 20;
const SLOT_MINUTES = 30;
export const BOOKING_WINDOW_DAYS = 60;

// "Lundi 23 septembre" — à partir d'une date ISO (YYYY-MM-DD), sans dérive de
// fuseau horaire (on construit la date en local, pas via `new Date(iso)` qui
// l'interprète en UTC).
export function formatDateLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return capitalize(date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }));
}

// Grille d'un mois complet, semaines de lundi à dimanche, complétée par des
// cases vides (null) avant/après pour toujours faire des lignes de 7.
export function getMonthGrid(year: number, month: number): (Date | null)[] {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7; // 0 = lundi
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getAllSlots(): string[] {
  const slots: string[] = [];
  for (let minutes = OPEN_HOUR * 60; minutes < CLOSE_HOUR * 60; minutes += SLOT_MINUTES) {
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
  }
  return slots;
}

export function getAvailableSlots(isoDate: string, taken: string[]): string[] {
  const all = getAllSlots();
  const takenSet = new Set(taken.map((t) => t.slice(0, 5)));

  const now = new Date();
  const isToday = isoDate === toISODate(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return all.filter((slot) => {
    if (takenSet.has(slot)) return false;
    if (isToday) {
      const [h, m] = slot.split(":").map(Number);
      if (h * 60 + m <= nowMinutes) return false;
    }
    return true;
  });
}
