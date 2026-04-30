"use client";

import { usePathname } from "next/navigation";

// ─── Wrapper qui détermine la largeur max et le padding bottom ──────────
// Cas par défaut : max-w-xl (576px), pb réservé pour la BottomNav.
// Cas full-bleed : routes "outils desktop" (mode prof) où on veut profiter
// de la largeur d'écran.
//
// On garde un composant client minuscule pour ne pas pousser tout le layout
// en client. Le SyncProvider, la BottomNav et SW sont déjà clients.

const FULL_BLEED = ["/prof"];
const NO_BOTTOM_PAD = ["/prof", "/onboarding", "/auth"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullBleed = FULL_BLEED.some((r) => pathname.startsWith(r));
  const noPad = NO_BOTTOM_PAD.some((r) => pathname.startsWith(r));

  const widthClass = fullBleed ? "w-full" : "max-w-xl mx-auto";
  const padClass = noPad ? "" : "pb-[calc(6rem+env(safe-area-inset-bottom))]";

  return (
    <div className={`${widthClass} min-h-screen ${padClass}`}>{children}</div>
  );
}
