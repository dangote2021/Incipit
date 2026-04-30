"use client";

import { useEffect, useId, useState } from "react";
import type { Character } from "@/lib/types";

type Props = {
  characters: Character[];
  open: boolean;
  onClose: () => void;
};

const ROLE_LABEL: Record<Character["role"], string> = {
  protagoniste: "Protagoniste",
  antagoniste: "Antagoniste",
  secondaire: "Personnage secondaire",
  narrateur: "Narrateur",
};

const ROLE_COLOR: Record<Character["role"], string> = {
  protagoniste: "bg-bordeaux text-paper",
  antagoniste: "bg-ink text-paper",
  secondaire: "bg-sage/20 text-sage",
  narrateur: "bg-gold/20 text-gold",
};

export default function CharacterSheet({ characters, open, onClose }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = characters.find((c) => c.id === activeId);
  const titleId = useId();

  // Echap pour fermer le drawer (sinon piège clavier sur desktop)
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (active) setActiveId(null);
        else onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, active]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-end"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-paper w-full max-h-[85vh] overflow-auto rounded-t-3xl shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-paper/95 backdrop-blur border-b border-ink/10 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-bordeaux font-bold">
              {active ? "Fiche personnage" : "Personnages"}
            </div>
            <h3 id={titleId} className="font-serif text-xl font-bold text-ink leading-tight">
              {active ? active.name : `${characters.length} fiches`}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {active && (
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="text-xs uppercase tracking-widest text-ink/60 font-bold min-h-[44px] px-3"
              >
                ← Liste
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-ink/50 text-2xl font-bold w-11 h-11 flex items-center justify-center"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>

        {!active && (
          <ul className="divide-y divide-ink/10">
            {characters.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-cream/50 transition"
                >
                  <span className="text-3xl shrink-0">{c.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-serif font-bold text-ink text-base truncate">
                        {c.name}
                      </span>
                      <span
                        className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${ROLE_COLOR[c.role]}`}
                      >
                        {ROLE_LABEL[c.role]}
                      </span>
                    </div>
                    <p className="text-sm text-ink/75 leading-snug italic">
                      {c.oneLiner}
                    </p>
                  </div>
                  <span className="text-ink/40 shrink-0">›</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {active && (
          <div className="px-5 py-5 space-y-5">
            <div className="flex items-start gap-4">
              <span className="text-6xl">{active.avatar}</span>
              <div className="flex-1">
                <div
                  className={`inline-block text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full mb-2 ${ROLE_COLOR[active.role]}`}
                >
                  {ROLE_LABEL[active.role]}
                </div>
                <p className="font-serif italic text-ink/80 text-base leading-snug">
                  {active.oneLiner}
                </p>
              </div>
            </div>

            <p className="text-[15px] text-ink/90 leading-relaxed">
              {active.description}
            </p>

            {active.keyQuote && (
              <blockquote className="bg-cream/60 border-l-4 border-bordeaux rounded-r-xl px-4 py-3 font-serif italic text-ink/90">
                « {active.keyQuote} »
              </blockquote>
            )}

            {active.relations && active.relations.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-widest text-ink/50 font-bold mb-2">
                  Relations
                </div>
                <ul className="space-y-2">
                  {active.relations.map((r, i) => (
                    <li
                      key={i}
                      className="bg-ink/5 rounded-xl px-3 py-2 text-sm text-ink/85"
                    >
                      <span className="font-bold">{r.to}</span>
                      <span className="text-ink/60"> — {r.link}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
