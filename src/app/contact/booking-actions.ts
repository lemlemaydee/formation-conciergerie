"use server";

import { createClient } from "@/lib/supabase/server";
import { getAvailableSlots } from "@/lib/booking";

export async function getSlotsForDate(isoDate: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_taken_slots", { p_date: isoDate });

  if (error) {
    // Table/fonction pas encore créée (migration non lancée) : tout est libre.
    return getAvailableSlots(isoDate, []);
  }

  const taken = (data ?? []).map((row: { slot_time: string }) => row.slot_time);
  return getAvailableSlots(isoDate, taken);
}

export interface BookingState {
  error: string | null;
  success: boolean;
}

export async function createBooking(
  _prevState: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const slotDate = String(formData.get("slotDate") ?? "");
  const slotTime = String(formData.get("slotTime") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const comment = String(formData.get("comment") ?? "").trim();

  if (!slotDate || !slotTime || !firstName || !lastName || !email || !phone) {
    return { error: "Merci de remplir tous les champs obligatoires.", success: false };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("bookings").insert({
    slot_date: slotDate,
    slot_time: slotTime,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    comment: comment || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Ce créneau vient d'être réservé. Merci d'en choisir un autre.", success: false };
    }
    return { error: "Impossible de réserver pour le moment. Réessayez plus tard.", success: false };
  }

  return { error: null, success: true };
}
