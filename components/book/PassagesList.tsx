"use client";

import Link from "next/link";
import { usePremium, FEATURES } from "@/lib/premium";
import type { KeyPassage } from "@/lib/types";

// ─── Gate Premium des passages clés (feature passagesFull).
// ─── Règle : 2 passages en gratuit, 5 pour les Premium.
// ─── On rend TOUJOURS les 5 côté SSR (crawlable), et on masque visuellement
// ─── 3..5 côté client pour les free. Permet au SEO d'indexer l'intégralité
// ─── tout en gardant le paywall visible côté UX.
type Props = {
  passages: KeyPassage[];
  freeCount?: number;
};

export default function PassagesList({ passages, freeCount = 2 }: Props) {
  const { isPremium, hydrated } = usePremium();

  // Avant hydratation on montre le comportement gratuit (le plus restrictif)
  // pour éviter un flash "tout visible puis verrouillé". Tant qu'on n'a pas
  // hydraté, on considère le user free → 2 visibles, reste en preview flouté.
  const gated = !hydrated || !isPremium;
  const hiddenCount = Math.max(0, passages.length - freeCount);

  return (
    <>
      <ol className="space-y-3">
        {passages.map((p, idx) => {
          const isLocked = gated && idx >= freeCount;
          if (isLocked) {
            return (
              <li
                key={p.id}
                className="relative bg-paper border border-ink/10 rounded-2xl p-4 overflow-hidden"
                aria-hidden="false"
              >
                {/* Contenu flouté — on laisse le texte pour le crawler mais on
                    applique un blur + masque dégradé. Pointer-events: none
                    pour empêcher la sélection. */}
                <div className="pointer-events-none select-none blur-sm opacity-60">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-serif text-2xl text-bordeaux/40 font-bold leading-none">
                      0{p.order}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-[15px] font-bold text-ink leading-tight">
                        {p.title}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-ink/50 font-bold mt-0.5">
                        {p.chapter} · {p.readingMinutes} min
                      </div>
                    </div>
                  </div>
                  <p className="text-[13px] text-ink/70 leading-relaxed mb-3">
                    {p.context}
                  </p>
                  <blockquote className="border-l-2 border-bordeaux/60 pl-3 font-serif text-[14px] text-ink/90 italic leading-relaxed">
                    {p.excerpt}
                  </blockquote>
                </div>
                {/* Overlay verrou — seul élément visuellement net de la carte. */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-paper/30 via-paper/70 to-paper/90">
                  <div className="text-center px-4">
                    <div className="text-[9px] uppercase tracking-[0.3em] text-bordeaux font-black mb-1">
                      Passage Premium
                    </div>
                    <div className="font-serif text-sm font-bold text-ink">
                      Passage {p.order} · {p.title}
                    </div>
                  </div>
                </div>
              </li>
            );
          }
          return (
            <li
              key={p.id}
              className="bg-paper border border-ink/10 rounded-2xl p-4"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-serif text-2xl text-bordeaux/40 font-bold leading-none">
                  0{p.order}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[15px] font-bold text-ink leading-tight">
                    {p.title}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-ink/50 font-bold mt-0.5">
                    {p.chapter} · {p.readingMinutes} min
                  </div>
                </div>
              </div>
              <p className="text-[13px] text-ink/70 leading-relaxed mb-3">
                {p.context}
              </p>
              <blockquote className="border-l-2 border-bordeaux/60 pl-3 font-serif text-[14px] text-ink/90 italic leading-relaxed">
                {p.excerpt}
              </blockquote>
            </li>
          );
        })}
      </ol>

      {gated && hiddenCount > 0 && (
        <div className="mt-4 rounded-2xl bg-ink text-paper p-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">
              {FEATURES.passagesFull.label} · {hiddenCount} verrouillé
              {hiddenCount > 1 ? "s" : ""}
            </div>
            <div className="font-serif text-lg font-black mt-1 leading-snug">
              Tous les passages clés, avec leur contexte.
            </div>
            <p className="text-[13px] text-paper/75 mt-2 leading-relaxed">
              Free : {FEATURES.passagesFull.free}. Premium :{" "}
              {FEATURES.passagesFull.premium}.
            </p>
            <Link
              href="/premium"
              className="mt-4 inline-block w-full text-center bg-gold text-ink py-3 rounded-full text-[11px] uppercase tracking-widest font-black hover:bg-paper transition"
            >
              Débloquer les {passages.length} passages →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
