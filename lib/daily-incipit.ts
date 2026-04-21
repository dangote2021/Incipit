import { BOOKS } from "@/lib/mock-data";
import type { Book } from "@/lib/types";

// Incipit du jour : un livre par jour, roulement déterministe sur BOOKS.
// Partagé entre DailyIncipit (home), l'archive (/incipit-du-jour) et le
// générateur de carte partageable (/api/incipit-card/[id]).

// Epoch interne stable : on utilise le nombre de jours écoulés depuis le
// 1er janvier 2024 (UTC). Même résultat côté serveur et côté client,
// pas de drift au passage minuit fuseau local.
const EPOCH_UTC = Date.UTC(2024, 0, 1);

function daysSinceEpoch(date: Date = new Date()): number {
  const today = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
  return Math.floor((today - EPOCH_UTC) / 86_400_000);
}

export function getDailyIncipit(daysAgo = 0): { book: Book; date: Date } {
  const now = new Date();
  const d = new Date(now);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  const idx = ((daysSinceEpoch(d) % BOOKS.length) + BOOKS.length) % BOOKS.length;
  return { book: BOOKS[idx], date: d };
}

export function getRecentDailyIncipits(n = 30) {
  return Array.from({ length: n }, (_, i) => getDailyIncipit(i));
}

// Extrait les 1-2 premières phrases de l'incipit pour affichage "carte".
export function incipitTeaser(book: Book, maxChars = 220): string {
  const sentences = book.openingLines
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  let out = "";
  for (const s of sentences) {
    if ((out + " " + s).length > maxChars && out.length > 0) break;
    out = out ? `${out} ${s}` : s;
  }
  if (!out) out = book.openingLines.slice(0, maxChars).trim();
  // Nettoie la ponctuation terminale : on préserve le . mais pas les …
  return out.replace(/\s*…\s*$/, "…");
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatShortDate(d: Date): string {
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}
