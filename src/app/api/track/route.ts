import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// `request.geo`/`request.ip` ont été retirés de Next.js en v15 ; le pays se
// lit désormais directement depuis l'en-tête que Vercel ajoute côté edge
// (absent en local, d'où le fallback null).
function detectDevice(userAgent: string): "mobile" | "tablet" | "desktop" {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (/mobi|android|iphone/.test(ua)) return "mobile";
  return "desktop";
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const path = typeof body.path === "string" ? body.path.slice(0, 300) : "/";
  const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 300) : null;

  const country = request.headers.get("x-vercel-ip-country");
  const userAgent = request.headers.get("user-agent") ?? "";

  const supabase = await createClient();
  await supabase.from("page_views").insert({
    path,
    country,
    device: detectDevice(userAgent),
    referrer,
  });

  return NextResponse.json({ ok: true });
}
