"use client";

import { useState } from "react";

// Ilot client : composer de note. Gère à la fois le bouton "+ Écrire"
// et l'apparition du textarea. La liste des notes existantes reste SSR.
export default function NoteComposer() {
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState("");

  const cancel = () => {
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
          onClick={() => setWriting((v) => !v)}
          className="text-xs font-bold uppercase tracking-widest text-bordeaux"
        >
          {writing ? "Fermer" : "+ Écrire"}
        </button>
      </div>

      {writing && (
        <div className="mb-4 bg-cream border border-ink/10 rounded-2xl p-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ta lecture, ta pensée, ta claque, ton désaccord…"
            rows={5}
            className="w-full bg-transparent text-ink placeholder:text-ink/40 font-serif resize-none focus:outline-none"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={cancel}
              className="text-xs uppercase tracking-widest text-ink/60 font-semibold px-3 py-1.5"
            >
              Annuler
            </button>
            <button
              onClick={cancel}
              className="text-xs uppercase tracking-widest font-bold bg-ink text-paper px-4 py-2 rounded-full"
            >
              Publier
            </button>
          </div>
        </div>
      )}
    </>
  );
}
