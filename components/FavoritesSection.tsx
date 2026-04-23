"use client";

import Link from "next/link";
import { useFavorites, type FavoriteKind } from "@/lib/favorites";

// ─── Section "Mes marque-pages" rendue dans /profile.
// ─── Affiche la liste des favoris persistés (localStorage), groupés par type.
// ─── Chaque entrée renvoie vers son href d'origine + bouton retirer.
// ─── Tap targets ≥ 44×44 pour la croix, conformément iOS HIG.

const KIND_LABEL: Record<FavoriteKind, string> = {
  incipit: "Incipit",
  quote: "Citation",
  punchline: "Punchline",
  passage: "Passage clé",
  book: "Livre",
};

const KIND_ACCENT: Record<FavoriteKind, string> = {
  incipit: "text-bordeaux",
  quote: "text-ink/70",
  punchline: "text-gold",
  passage: "text-sage",
  book: "text-ink",
};

export default function FavoritesSection() {
  const { list, hydrated, remove } = useFavorites();

  // Avant hydratation : on rend un squelette minimal pour éviter le flash
  // "aucun marque-page" quand l'utilisateur en a en localStorage.
  if (!hydrated) {
    return (
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
          Mes marque-pages
        </h2>
        <div className="bg-paper border border-ink/10 rounded-2xl p-5 text-center text-sm text-ink/40">
          Chargement…
        </div>
      </section>
    );
  }

  if (list.length === 0) {
    return (
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
          Mes marque-pages
        </h2>
        <div className="bg-cream/50 border border-dust rounded-2xl p-5">
          <p className="font-serif text-[15px] text-ink/80 leading-relaxed">
            Rien de marqué pour l'instant.
          </p>
          <p className="text-[13px] text-ink/60 leading-relaxed mt-2">
            Appuie sur l'étoile à côté d'un incipit, d'une punchline ou d'un
            passage clé pour le retrouver ici — à relire, à partager, à citer.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50">
          Mes marque-pages · {list.length}
        </h2>
      </div>
      <ul className="space-y-2">
        {list.map((fav) => (
          <li
            key={fav.id}
            className="bg-paper border border-ink/10 rounded-2xl p-3 flex items-center gap-3"
          >
            <Link
              href={fav.href}
              className="flex-1 min-w-0 flex items-center gap-3 min-h-[44px]"
            >
              <span
                className={`text-[9px] uppercase tracking-[0.25em] font-black shrink-0 ${KIND_ACCENT[fav.kind]}`}
              >
                {KIND_LABEL[fav.kind]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-[15px] font-bold text-ink leading-tight truncate">
                  {fav.label}
                </div>
                {fav.sub && (
                  <div className="text-[11px] text-ink/60 truncate mt-0.5">
                    {fav.sub}
                  </div>
                )}
              </div>
            </Link>
            <button
              type="button"
              onClick={() => remove(fav.id)}
              aria-label={`Retirer ${fav.label} des marque-pages`}
              className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-ink/40 hover:text-bordeaux hover:bg-bordeaux/5 transition"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="w-[18px] h-[18px]"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
