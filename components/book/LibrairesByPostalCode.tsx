"use client";

import { useMemo, useState } from "react";
import { findLibrairiesByPostalCode } from "@/lib/mock-data";
import type { Book } from "@/lib/types";

type Props = {
  book: Book;
};

/**
 * Widget de prescription libraire par code postal. Demandé par Jean-Baptiste
 * (panel v7) : "vous envoyez vers placedeslibraires.fr, c'est bien, mais
 * vous ne dites pas QUELLE librairie est à côté du lecteur".
 *
 * Fonctionnement :
 *  - L'utilisateur saisit son code postal (5 chiffres).
 *  - On match sur département (2 premiers chiffres) puis région (1er).
 *  - On affiche 3 libraires indépendantes avec lien direct.
 *  - Fallback : lien Placedeslibraires.fr pour une recherche nationale.
 *
 * Aucun géo-API, aucun tracking : le code postal n'est pas envoyé sur le
 * réseau, juste stocké dans le state React le temps de la session.
 */
export default function LibrairesByPostalCode({ book }: Props) {
  const [cp, setCp] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const libraires = useMemo(() => {
    if (!submitted) return [];
    return findLibrairiesByPostalCode(cp, 3);
  }, [cp, submitted]);

  // Lien national fallback — toujours affiché
  const title = encodeURIComponent(book.fullTitle || book.title);
  const author = encodeURIComponent(book.author);
  const placedeslibrairesUrl = `https://www.placedeslibraires.fr/listeliv.php?MOTS=${title}+${author}&base=ean`;

  return (
    <section>
      <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
        Où le trouver en librairie
      </h2>
      <div className="bg-paper border border-ink/10 rounded-2xl p-5">
        <p className="text-sm text-ink/70 leading-relaxed mb-4">
          Entre ton code postal, on te propose trois libraires indépendantes
          de ta région. Aucun tracking : le code reste sur ton appareil.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="flex gap-2 mb-4"
        >
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{5}"
            maxLength={5}
            placeholder="75011"
            value={cp}
            onChange={(e) => {
              setCp(e.target.value.replace(/\D/g, ""));
              setSubmitted(false);
            }}
            className="flex-1 px-4 py-3 text-sm font-mono bg-paper border-2 border-ink/15 rounded-xl focus:border-bordeaux focus:outline-none text-ink placeholder:text-ink/30"
            aria-label="Code postal"
          />
          <button
            type="submit"
            disabled={cp.length !== 5}
            className="bg-ink text-paper px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-bordeaux transition"
          >
            Chercher
          </button>
        </form>

        {submitted && libraires.length > 0 && (
          <ul className="space-y-2">
            {libraires.map((l) => (
              <li key={l.name}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 bg-cream/60 border border-dust rounded-xl px-4 py-3 hover:border-bordeaux transition"
                >
                  <div className="min-w-0">
                    <div className="font-serif font-bold text-ink text-sm leading-tight truncate">
                      {l.name}
                    </div>
                    <div className="text-[11px] text-ink/60 uppercase tracking-widest font-semibold">
                      {l.city}
                      {l.postalCode ? ` · ${l.postalCode}` : ""}
                    </div>
                  </div>
                  <span className="text-ink/40 shrink-0">↗</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 pt-4 border-t border-ink/10">
          <a
            href={placedeslibrairesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-bordeaux hover:text-ink transition"
          >
            Recherche nationale sur Placedeslibraires.fr →
          </a>
        </div>
      </div>
    </section>
  );
}
