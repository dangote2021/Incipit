"use client";

import { useEffect, useRef, useState } from "react";

// ─── Logo "Incipit" du header home. Au clic → popover "se dit inkipit".
// ─── C'est aussi le rôle pédagogique de la marque : beaucoup de gens
// ─── ne savent pas prononcer "incipit" (c-i, pas k-i). Avant on avait un
// ─── <Link href="/"> qui, depuis la home, donnait l'impression d'un bouton
// ─── mort. Maintenant le clic déclenche la prononciation.
export default function BrandPronunciation() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Auto-fermeture au clic extérieur + Escape.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Incipit — découvrir la prononciation"
        className="flex items-baseline gap-1 px-3 py-1.5 rounded-full bg-paper/90 backdrop-blur-md border border-ink/20 shadow-md hover:border-ink/40 transition"
      >
        <span className="font-serif font-black text-xl tracking-tight text-ink">
          Incipit
        </span>
        <span className="text-bordeaux text-lg leading-none">.</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Prononciation d'Incipit"
          className="absolute left-0 top-full mt-2 w-64 rounded-2xl bg-ink text-paper p-4 shadow-2xl border border-ink/20 z-50"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-black mb-1">
            Prononciation
          </div>
          <div className="font-serif text-lg leading-snug">
            Incipit se dit{" "}
            <span className="font-black italic">inkipit</span>.
          </div>
          <p className="text-[12px] text-paper/70 leading-relaxed mt-2">
            Du latin <span className="italic">incipit</span>, « il commence » —
            les premiers mots d&apos;un livre.
          </p>
        </div>
      )}
    </div>
  );
}
