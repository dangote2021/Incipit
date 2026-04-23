"use client";

import { useEffect, useState } from "react";
import { consumeFlash, type Flash } from "@/lib/flash";

// ─── Toast discret, one-shot. Consomme un flash posé dans sessionStorage
// ─── (typiquement par l'onboarding avant redirection vers /) et l'affiche
// ─── ~3.2s avec un fade-out doux.
export default function FlashToast() {
  const [flash, setFlash] = useState<Flash | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const f = consumeFlash();
    if (!f) return;
    setFlash(f);
    // Micro-délai pour que la transition d'entrée joue.
    const inTimer = setTimeout(() => setVisible(true), 30);
    const outTimer = setTimeout(() => setVisible(false), 3000);
    const clearTimer = setTimeout(() => setFlash(null), 3400);
    return () => {
      clearTimeout(inTimer);
      clearTimeout(outTimer);
      clearTimeout(clearTimer);
    };
  }, []);

  if (!flash) return null;

  const toneClass =
    flash.tone === "info"
      ? "bg-ink text-paper border-ink"
      : "bg-bordeaux text-paper border-bordeaux";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[60] pointer-events-none transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <div
        className={`pointer-events-auto px-4 py-2.5 rounded-full shadow-lg border ${toneClass} flex items-center gap-2 max-w-[90vw]`}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-black opacity-80">
          ✓
        </span>
        <span className="font-serif text-sm leading-tight">
          {flash.message}
        </span>
      </div>
    </div>
  );
}
