"use client";

import { useEffect, useState } from "react";

// Ilot client : composer de note. Gère à la fois le bouton "+ Écrire"
// et l'apparition du textarea. La liste des notes existantes reste SSR.
//
// Honnêteté bêta : "Publier" ne publie nulle part — pas encore de back-end
// pour les notes de livre. On vide le draft avec un toast non-bloquant qui
// le dit clairement, plutôt que de simuler une publication factice.
export default function NoteComposer() {
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(t);
  }, [toast]);

  const cancel = () => {
    setWriting(false);
    setDraft("");
  };

  const publish = () => {
    if (!draft.trim()) return;
    setToast(
      "Note enregistrée localement (bêta : pas encore de back-end notes — ton brouillon est juste vidé)."
    );
    setWriting(false);
    setDraft("");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50">
          Écris ta note
        </h2>
        <button
          type="button"
          onClick={() => setWriting((v) => !v)}
          aria-expanded={writing}
          className="min-h-[44px] text-xs font-bold uppercase tracking-widest text-bordeaux px-3"
        >
          {writing ? "Fermer" : "+ Écrire"}
        </button>
      </div>

      {writing && (
        <div className="mb-4 bg-cream border border-ink/10 rounded-2xl p-4">
          <label className="sr-only" htmlFor="note-draft">
            Ta note
          </label>
          <textarea
            id="note-draft"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ta lecture, ta pensée, ta claque, ton désaccord…"
            rows={5}
            className="w-full bg-transparent text-ink placeholder:text-ink/40 font-serif resize-none focus:outline-none"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={cancel}
              className="min-h-[44px] text-xs uppercase tracking-widest text-ink/60 font-semibold px-3 py-1.5"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={publish}
              disabled={!draft.trim()}
              aria-label="Publier la note (bêta — pas de back-end)"
              className="min-h-[44px] text-xs uppercase tracking-widest font-bold bg-ink text-paper px-4 py-2 rounded-full disabled:opacity-40"
            >
              Publier
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 text-[12px] text-ink/70 bg-cream border border-ink/10 rounded-xl px-3 py-2"
        >
          {toast}
        </div>
      )}
    </>
  );
}
