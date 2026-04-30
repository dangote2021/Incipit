"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import CharacterSheet from "@/components/CharacterSheet";
import type { Book, Character } from "@/lib/types";
import { LIBRAIRIES } from "@/lib/mock-data";

type Props = {
  book: Book;
  characters: Character[];
  passagesCount: number;
};

// Ilot client : les 4 boutons "Pour t'accompagner" + les modals associés.
// Le titre de section est rendu côté serveur, seuls les boutons sont ici.
export default function BookActionPanel({ book, characters, passagesCount }: Props) {
  const [aiOpen, setAiOpen] = useState(false);
  const [librairiesOpen, setLibrairiesOpen] = useState(false);
  const [charsOpen, setCharsOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setAiOpen(true)}
          className="bg-ink text-paper rounded-2xl p-4 text-left hover:bg-ink/90 transition"
        >
          <div className="text-xl mb-1">🧠</div>
          <div className="font-serif font-bold text-base leading-tight">
            Compagnon
          </div>
          <div className="text-[11px] text-paper/70 mt-0.5">
            Pose une question
          </div>
        </button>
        {characters.length > 0 && (
          <button
            type="button"
            onClick={() => setCharsOpen(true)}
            className="bg-sage text-paper rounded-2xl p-4 text-left hover:bg-sage/90 transition"
          >
            <div className="text-xl mb-1">🎭</div>
            <div className="font-serif font-bold text-base leading-tight">
              Personnages
            </div>
            <div className="text-[11px] text-paper/70 mt-0.5">
              {characters.length} fiches
            </div>
          </button>
        )}
        {passagesCount > 0 && (
          <Link
            href={`/book/${book.id}/read`}
            className="bg-gold text-ink rounded-2xl p-4 text-left hover:bg-gold/90 transition"
          >
            <div className="text-xl mb-1">📖</div>
            <div className="font-serif font-bold text-base leading-tight">
              Mode lecture
            </div>
            <div className="text-[11px] text-ink/70 mt-0.5">
              {passagesCount} passage{passagesCount > 1 ? "s" : ""} clé
              {passagesCount > 1 ? "s" : ""}
            </div>
          </Link>
        )}
        <button
          type="button"
          onClick={() => setLibrairiesOpen(true)}
          className="bg-bordeaux text-paper rounded-2xl p-4 text-left hover:bg-bordeaux/90 transition"
        >
          <div className="text-xl mb-1">🏛️</div>
          <div className="font-serif font-bold text-base leading-tight">
            Chez ton libraire
          </div>
          <div className="text-[11px] text-paper/70 mt-0.5">
            Indé, pas Amazon
          </div>
        </button>
      </div>

      {/* Modal : Compagnon IA */}
      {aiOpen && (
        <Modal onClose={() => setAiOpen(false)} title="Compagnon de lecture">
          <p className="text-sm text-ink/75 leading-relaxed mb-4">
            Pose une question sur {book.title} — un personnage, un contexte
            historique, un passage que tu n'as pas compris. Le compagnon répond
            sans te spoiler plus que ta progression.
          </p>
          <div className="space-y-2 mb-4">
            <Suggestion text={`Qui est vraiment ${book.author} ?`} />
            <Suggestion text="Que se passe-t-il au chapitre précédent ?" />
            <Suggestion text="C'est quoi le contexte historique ?" />
            <Suggestion text="Explique-moi cette phrase…" />
          </div>
          <div className="bg-cream border border-ink/10 rounded-xl p-3">
            <input
              type="text"
              aria-label={`Pose une question sur ${book.title}`}
              placeholder="Ta question…"
              enterKeyHint="send"
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
            />
          </div>
          <div className="text-[11px] text-ink/50 mt-3 italic">
            Bêta — les réponses sont relues par un humain avant publication.
          </div>
        </Modal>
      )}

      {/* Drawer : Personnages */}
      <CharacterSheet
        characters={characters}
        open={charsOpen}
        onClose={() => setCharsOpen(false)}
      />

      {/* Modal : Libraires */}
      {librairiesOpen && (
        <Modal
          onClose={() => setLibrairiesOpen(false)}
          title="Chez ton libraire"
        >
          <a
            href={`https://www.placedeslibraires.fr/listeliv.php?mots_recherche=${encodeURIComponent(
              `${book.title} ${book.author}`
            )}&form_recherche_avancee=ok`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-br from-ink via-bordeaux to-red-900 text-paper rounded-2xl p-5 mb-5 hover:scale-[1.01] transition"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl shrink-0">📍</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-gold font-bold">
                  Priorité · librairies indépendantes
                </div>
                <h4 className="font-serif text-lg font-black leading-tight mt-1">
                  Placedeslibraires.fr
                </h4>
                <p className="text-xs text-paper/80 leading-relaxed mt-1">
                  2 800 libraires indépendantes en France.
                  Dispo en stock, retrait 2h, livraison rapide.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 bg-paper/15 border border-paper/25 rounded-full px-3 py-1.5">
                  <span className="text-[10px] uppercase tracking-widest font-bold">
                    Trouver en librairie
                  </span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </a>

          <p className="text-xs text-ink/70 leading-relaxed mb-4 italic">
            Chez Incipit, on redirige vers le réseau des libraires indés avant
            tout le reste. Aucun partenariat avec Amazon.
          </p>

          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-widest text-bordeaux font-bold mb-2">
              Repérées près de chez toi
            </div>
            <ul className="space-y-2">
              {LIBRAIRIES.map((l) => (
                <li
                  key={l.name}
                  className="flex items-center justify-between bg-cream border border-ink/10 rounded-xl p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-serif font-bold text-ink truncate">
                      {l.name}
                    </div>
                    <div className="text-[11px] text-ink/60">
                      {l.city} · {l.distanceKm.toFixed(1)} km
                    </div>
                  </div>
                  <a
                    href={`https://www.placedeslibraires.fr/listeliv.php?mots_recherche=${encodeURIComponent(
                      `${book.title} ${book.author}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-widest font-bold text-bordeaux shrink-0 ml-3"
                  >
                    Voir stock →
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <details className="mt-4">
            <summary className="text-[10px] uppercase tracking-widest text-ink/50 font-bold cursor-pointer hover:text-ink/70 transition">
              Autres plateformes
            </summary>
            <ul className="mt-3 space-y-2">
              {[
                {
                  name: "Lalibrairie.com",
                  note: "Réseau coop de libraires indépendants",
                  url: `https://www.lalibrairie.com/recherche/?q=${encodeURIComponent(
                    book.title + " " + book.author
                  )}`,
                },
                {
                  name: "Leslibraires.fr",
                  note: "Plateforme de plus de 400 librairies",
                  url: `https://www.leslibraires.fr/recherche/?q=${encodeURIComponent(
                    book.title + " " + book.author
                  )}`,
                },
                {
                  name: "Librairie Mollat",
                  note: "La plus grande indé de France",
                  url: `https://www.mollat.com/recherche?query=${encodeURIComponent(
                    book.title + " " + book.author
                  )}`,
                },
              ].map((opt) => (
                <li key={opt.name}>
                  <a
                    href={opt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-ink/5 rounded-xl p-3 hover:bg-ink/10 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-sm font-bold text-ink">
                        {opt.name}
                      </div>
                      <div className="text-[11px] text-ink/60 truncate">
                        {opt.note}
                      </div>
                    </div>
                    <span className="text-ink/40 shrink-0">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </details>

          <div className="mt-5 bg-sage/10 border border-sage/30 rounded-xl p-3 text-[11px] text-ink/70 leading-relaxed">
            <span className="font-bold text-sage">Bon à savoir : </span>
            acheter en librairie indépendante, c'est soutenir 15 000 emplois
            non-délocalisables et un maillage culturel fin dans toute la France.
          </div>
        </Modal>
      )}
    </>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  // Fermeture clavier (Escape) — l'overlay est cliquable mais sans clavier
  // l'utilisateur était bloqué sans souris.
  const titleId = useId();
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-paper rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[85vh] overflow-auto p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 id={titleId} className="font-serif text-xl font-bold text-ink">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-ink/50 text-xl font-bold px-2"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Suggestion({ text }: { text: string }) {
  return (
    <button
      type="button"
      className="w-full text-left text-sm bg-ink/5 hover:bg-ink/10 text-ink/80 px-3 py-2 rounded-xl transition"
    >
      {text}
    </button>
  );
}
