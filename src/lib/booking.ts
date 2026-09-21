const OPEN_HOUR = 10;
const CLOSE_HOUR = 20;
const SLOT_MINUTES = 30;
const DAYS_AHEAD = 14;

export interface DayOption {
  iso: string; // YYYY-MM-DD
  label: string; // "Lun 23 sept."
}

export function getUpcomingDays(count = DAYS_AHEAD): DayOption[] {
  const days: DayOption[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    const iso = toISODate(date);
    const label = date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    days.push({ iso, label: capitalize(label) });
  }

  return days;
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
