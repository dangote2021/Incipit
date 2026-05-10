// ─────────────────────────────────────────────────────────────────────────────
// GET /api/incipit/today — endpoint public JSON pour widgets / intégrations
// externes (blogs, RSS, Discord bots, automatisations).
//
// Retourne l'incipit du jour en JSON minimal : titre, auteur, première
// phrase, lien fiche livre. CORS ouvert (cross-origin), cache 1h pour ne
// pas hammer le serveur si plusieurs widgets pollent.
//
// Réponse type :
// {
//   "date": "2026-05-10",
//   "book": {
//     "id": "etranger",
//     "title": "L'Étranger",
//     "author": "Albert Camus",
//     "year": 1942,
//     "url": "https://incipit-navy.vercel.app/book/etranger"
//   },
//   "incipit": "Aujourd'hui, maman est morte. Ou peut-être hier...",
//   "permalink": "https://incipit-navy.vercel.app/book/etranger"
// }
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { getDailyIncipit, incipitTeaser } from "@/lib/daily-incipit";

export const runtime = "edge";
export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://incipit-navy.vercel.app";

export async function GET() {
  const { book, date } = getDailyIncipit(0);
  const incipit = incipitTeaser(book, 280);
  const permalink = `${SITE_URL}/book/${book.id}`;

  const payload = {
    date: date.toISOString().slice(0, 10),
    book: {
      id: book.id,
      title: book.title,
      author: book.author,
      year: book.year,
      url: permalink,
    },
    incipit,
    permalink,
    attribution: "Incipit — incipit-navy.vercel.app",
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}

// Préflight CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
