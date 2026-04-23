// ─────────────────────────────────────────────────────────────────────────────
// Middleware Next.js — rafraîchit la session Supabase à chaque navigation
// (nécessaire pour que le cookie ne expire pas pendant que l'utilisateur est
// sur l'app). Idempotent si Supabase n'est pas configuré.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Fallback : pas de Supabase → rien à rafraîchir, on passe.
  if (!url || !anon) return NextResponse.next();

  let res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        req.cookies.set({ name, value, ...options });
        res = NextResponse.next({ request: { headers: req.headers } });
        res.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        req.cookies.set({ name, value: "", ...options });
        res = NextResponse.next({ request: { headers: req.headers } });
        res.cookies.set({ name, value: "", ...options });
      },
    },
  });

  // Rafraîchir le token si nécessaire.
  await supabase.auth.getUser();

  return res;
}

// Applique seulement aux routes qui pourraient lire la session.
// On exclut les assets statiques et l'API publique /api/incipit-card.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|api/incipit-card).*)",
  ],
};
