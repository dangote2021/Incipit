// ─────────────────────────────────────────────────────────────────────────────
// Favoris / marque-pages (retour panel v9 : Aïssatou, Léa).
//
// On persiste côté client un set de "marque-pages" hétérogènes :
//  - un incipit du jour (bookId + date)
//  - une citation (quoteId)
//  - une punchline (punchlineId)
//  - un passage clé (bookId + passageOrder)
//  - un livre entier (bookId)
//
// Pas de backend : même logique que premium.ts (localStorage + CustomEvent
// pour synchro multi-onglets + hook React).
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useCallback, useEffect, useState } from "react";
import type { Favorite, FavoriteKind } from "./favorites-ids";

// Re-exports pour compat : le reste de l'app importe { favId, Favorite,
// FavoriteKind, useFavorites } depuis "@/lib/favorites".
export { favId } from "./favorites-ids";
export type { Favorite, FavoriteKind } from "./favorites-ids";

const KEY = "incipit:favorites:v1";
const EVT = "incipit:favorites:change";

// ─── Helpers internes ─────────────────────────────────────────────────────

function safeRead(): Favorite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Favorite[];
  } catch {
    return [];
  }
}

function safeWrite(list: Favorite[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVT));
  } catch {
    // ignore
  }
}

// ─── API impérative (utilisée depuis des handlers non-React) ─────────────

export function toggleFavorite(fav: Omit<Favorite, "addedAt">): boolean {
  const list = safeRead();
  const idx = list.findIndex((f) => f.id === fav.id);
  if (idx >= 0) {
    list.splice(idx, 1);
    safeWrite(list);
    return false;
  }
  list.unshift({ ...fav, addedAt: new Date().toISOString() });
  safeWrite(list);
  return true;
}

export function isFavorite(id: string): boolean {
  return safeRead().some((f) => f.id === id);
}

export function listFavorites(): Favorite[] {
  return safeRead();
}

export function removeFavorite(id: string) {
  const list = safeRead().filter((f) => f.id !== id);
  safeWrite(list);
}

// ─── Hook React ──────────────────────────────────────────────────────────

export function useFavorites() {
  const [list, setList] = useState<Favorite[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setList(safeRead());
    setHydrated(true);

    const refresh = () => setList(safeRead());
    window.addEventListener("storage", refresh);
    window.addEventListener(EVT, refresh as EventListener);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(EVT, refresh as EventListener);
    };
  }, []);

  const toggle = useCallback((fav: Omit<Favorite, "addedAt">) => {
    return toggleFavorite(fav);
  }, []);

  const remove = useCallback((id: string) => {
    removeFavorite(id);
  }, []);

  const has = useCallback(
    (id: string) => list.some((f) => f.id === id),
    [list]
  );

  return { list, hydrated, toggle, remove, has };
}
