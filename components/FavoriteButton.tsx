"use client";

import { useEffect, useState } from "react";
import { useFavorites, type Favorite } from "@/lib/favorites";
import { track } from "@/lib/telemetry";

// ─── Bouton marque-page générique : star pleine si favori, contour sinon.
// ─── Accepte le "fav" à persister (sans addedAt qui est rempli par le hook).
// ─── Deux variantes visuelles :
//  - "icon" : petit rond compact (44x44 tap target), idéal barre d'actions.
//  - "chip" : pastille texte+icône, à mettre en bas d'une carte.

type Props = {
  fav: Omit<Favorite, "addedAt">;
  variant?: "icon" | "chip";
  /** Force l'apparence sur fond sombre (texte/icon clair). */
  onDark?: boolean;
  className?: string;
};

export default function FavoriteButton({
  fav,
  variant = "icon",
  onDark = false,
  className = "",
}: Props) {
  const { has, toggle, hydrated } = useFavorites();
  const [justAdded, setJustAdded] = useState(false);

  const active = hydrated && has(fav.id);

  // Petit flash visuel sur ajout pour feedback tactile.
  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 500);
    return () => clearTimeout(t);
  }, [justAdded]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowActive = toggle(fav);
    if (nowActive) setJustAdded(true);
    // Telemetry — anonymisé, on capture juste l'action et le type d'objet
    // pour mesurer le funnel "j'ai aimé → je reviens".
    track("favorite_toggled", {
      action: nowActive ? "added" : "removed",
      kind: fav.kind,
      surface: variant,
    });
  };

  // Étoile pleine / contour en SVG pour netteté sur petit format.
  const Star = ({ filled }: { filled: boolean }) =>
    filled ? (
      <svg viewBox="0 0 24 24" aria-hidden className="w-[18px] h-[18px]">
        <path
          fill="currentColor"
          d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6L2.5 9.3l6.6-.7z"
        />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" aria-hidden className="w-[18px] h-[18px]">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
          d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6L2.5 9.3l6.6-.7z"
        />
      </svg>
    );

  if (variant === "chip") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        aria-label={
          active ? "Retirer des marque-pages" : "Ajouter aux marque-pages"
        }
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-[11px] uppercase tracking-widest font-bold transition ${
          active
            ? onDark
              ? "bg-gold text-ink border-gold"
              : "bg-ink text-paper border-ink"
            : onDark
              ? "bg-transparent text-paper/80 border-paper/30 hover:border-paper/70"
              : "bg-paper text-ink/70 border-ink/20 hover:border-ink/50"
        } ${justAdded ? "scale-105" : "scale-100"} ${className}`}
      >
        <Star filled={active} />
        <span>{active ? "Marqué" : "Marquer"}</span>
      </button>
    );
  }

  // variant === "icon"
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={
        active ? "Retirer des marque-pages" : "Ajouter aux marque-pages"
      }
      className={`inline-flex items-center justify-center w-11 h-11 rounded-full border transition ${
        active
          ? onDark
            ? "bg-gold text-ink border-gold"
            : "bg-ink text-paper border-ink"
          : onDark
            ? "bg-paper/10 text-paper border-paper/30 hover:border-paper/70"
            : "bg-paper text-ink/70 border-ink/20 hover:border-ink/50"
      } ${justAdded ? "scale-110" : "scale-100"} ${className}`}
    >
      <Star filled={active} />
    </button>
  );
}
