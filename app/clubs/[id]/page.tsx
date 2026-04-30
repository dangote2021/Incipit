"use client";

import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BookCover from "@/components/BookCover";
import VibeBadge from "@/components/VibeBadge";
import {
  getClub,
  getBook,
  getUser,
  USERS,
  ME,
  timeAgo,
} from "@/lib/mock-data";

type Post = {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  likes: number;
};

const MOCK_POSTS: Record<string, Post[]> = {
  "club-russes": [
    {
      id: "p-1",
      userId: "u-lise",
      text:
        "Quelqu'un d'autre a relevé le parallèle entre Meursault et Raskolnikov ? Deux meurtres, deux logiques radicalement différentes du remords. Ça mérite un chapitre à soi tout seul.",
      createdAt: "2026-04-19T19:42:00",
      likes: 14,
    },
    {
      id: "p-2",
      userId: "u-me",
      text:
        "Je bloque sur la scène du confessionnal. J'ai jamais réussi à savoir si Meursault méprise l'aumônier ou s'il est juste perdu. Des avis ?",
      createdAt: "2026-04-18T21:10:00",
      likes: 7,
    },
  ],
  "club-decadence": [
    {
      id: "p-3",
      userId: "u-nora",
      text:
        "Ma sélection perso pour la prochaine session : « Spleen LXXVIII », « Le Voyage », « Recueillement », « À une passante ». On vote ?",
      createdAt: "2026-04-19T10:30:00",
      likes: 22,
    },
  ],
  "club-nouveaux-classiques": [
    {
      id: "p-4",
      userId: "u-tom",
      text:
        "Je viens de finir la première partie. Le passage où Maheu rentre chez lui épuisé, la gamine qui tête sa mère, la vieille Bonnemort qui crache noir. C'est du Ken Loach 140 ans avant.",
      createdAt: "2026-04-17T22:45:00",
      likes: 9,
    },
  ],
  "club-polars": [
    {
      id: "p-5",
      userId: "u-karim",
      text:
        "Céline dans un club polar, fight me. L'errance de Bardamu, la paranoïa, la descente : c'est du noir à l'état pur même sans flic.",
      createdAt: "2026-04-19T08:15:00",
      likes: 5,
    },
  ],
};

export default function ClubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const club = getClub(id);
  if (!club) notFound();

  const book = getBook(club.currentBookId);
  const joined = ME.joinedClubs.includes(club.id);
  const [isJoined, setJoined] = useState(joined);
  const [draft, setDraft] = useState("");
  const [posted, setPosted] = useState(false);

  // Auto-clear "publié" toast après 2.5s
  useEffect(() => {
    if (!posted) return;
    const t = window.setTimeout(() => setPosted(false), 2500);
    return () => window.clearTimeout(t);
  }, [posted]);

  const posts = MOCK_POSTS[club.id] ?? [];
  // Sample members = 5 first users
  const members = USERS.slice(0, 5);

  return (
    <>
      <AppHeader back subtitle="Book club" />

      {/* Hero */}
      <section className="px-6 py-8 bg-bordeaux text-paper">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-3xl bg-paper/15 flex items-center justify-center text-4xl backdrop-blur-sm">
            {club.emoji}
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.25em] font-bold opacity-70 mb-1">
              {club.vibe}
            </div>
            <h1 className="font-serif text-3xl font-black leading-[1.05]">
              {club.name}
            </h1>
            <div className="text-xs text-paper/80 mt-1">
              {club.members.toLocaleString("fr-FR")} membres
            </div>
          </div>
        </div>
        <p className="mt-4 text-paper/90 text-sm leading-relaxed">
          {club.description}
        </p>

        <button
          type="button"
          onClick={() => setJoined(!isJoined)}
          className={`mt-5 w-full min-h-[44px] py-3 rounded-full text-xs font-bold uppercase tracking-widest transition ${
            isJoined
              ? "bg-paper/15 text-paper border border-paper/30"
              : "bg-gold text-ink hover:scale-[1.02]"
          }`}
        >
          {isJoined ? "✓ Membre du club" : "Rejoindre le club"}
        </button>
      </section>

      <main className="px-5 py-6 space-y-8">
        {/* Livre du mois */}
        {book && (
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
              Livre du mois
            </h2>
            <Link
              href={`/book/${book.id}`}
              className={`block bg-gradient-to-br ${book.cover} rounded-2xl p-5 text-paper overflow-hidden relative`}
            >
              <div className="absolute inset-0 bg-ink/35" />
              <div className="relative flex gap-4 items-start">
                <BookCover book={book} size="md" />
                <div className="flex-1">
                  <VibeBadge vibe={book.vibe} />
                  <h3 className="font-serif text-2xl font-black mt-2 leading-tight">
                    {book.title}
                  </h3>
                  <div className="text-xs text-paper/80 mt-1">
                    {book.author} · {book.year}
                  </div>
                  <p className="mt-3 font-serif italic text-paper/95 text-sm leading-snug">
                    « {book.hook} »
                  </p>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Prochaine session */}
        {club.nextMeeting && (
          <section className="bg-cream border border-ink/10 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-ink text-paper flex items-center justify-center text-xl">
                📅
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-widest font-bold text-ink/50">
                  Prochaine session
                </div>
                <div className="font-serif text-lg font-bold text-ink">
                  {formatDate(club.nextMeeting)}
                </div>
              </div>
              <button
                type="button"
                aria-label="Confirmer ta présence (bientôt — bêta)"
                className="text-xs uppercase tracking-widest font-bold text-bordeaux min-h-[44px] px-3"
              >
                Je viens
              </button>
            </div>
          </section>
        )}

        {/* Membres aperçu */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
            Membres actifs
          </h2>
          <div className="flex -space-x-2">
            {members.map((m) => (
              <div
                key={m.id}
                className="w-10 h-10 rounded-full bg-paper border-2 border-paper flex items-center justify-center text-lg shadow-sm"
              >
                {m.avatar}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-ink/5 border-2 border-paper flex items-center justify-center text-[10px] font-bold text-ink/70">
              +{club.members - members.length}
            </div>
          </div>
        </section>

        {/* Discussions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50">
              Discussions
            </h2>
          </div>

          {isJoined && (
            <div className="mb-4 bg-paper border border-ink/10 rounded-2xl p-4">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Lance une discussion sur le livre du mois…"
                rows={3}
                className="w-full bg-transparent text-ink placeholder:text-ink/40 resize-none focus:outline-none text-sm"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!draft.trim()) return;
                    setDraft("");
                    setPosted(true);
                  }}
                  disabled={!draft.trim()}
                  className="text-xs uppercase tracking-widest font-bold bg-ink text-paper min-h-[44px] px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publier
                </button>
              </div>
              {posted && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-3 text-[11px] text-ink/70 bg-cream border border-ink/10 rounded-xl px-3 py-2"
                >
                  Discussion lancée — bêta : pas encore de back-end clubs, ton
                  brouillon est juste vidé en local.
                </div>
              )}
            </div>
          )}

          <ul className="space-y-3">
            {posts.map((p) => {
              const user = getUser(p.userId)!;
              return (
                <li
                  key={p.id}
                  className="bg-paper border border-ink/10 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{user.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-ink truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-ink/50">
                        {timeAgo(p.createdAt)}
                      </div>
                    </div>
                  </div>
                  <p className="text-[15px] text-ink/90 leading-relaxed">
                    {p.text}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-[11px] text-ink/50 font-semibold">
                    <button
                      type="button"
                      aria-label={`Aimer (${p.likes} j'aime — bientôt)`}
                      className="hover:text-bordeaux min-h-[44px] px-2"
                    >
                      ♡ {p.likes}
                    </button>
                    <button
                      type="button"
                      aria-label="Répondre (bientôt — bêta)"
                      className="hover:text-ink min-h-[44px] px-2"
                    >
                      💬 Répondre
                    </button>
                  </div>
                </li>
              );
            })}
            {posts.length === 0 && (
              <li className="text-center py-6 text-ink/50 text-sm">
                Aucune discussion pour le moment.
              </li>
            )}
          </ul>
        </section>
      </main>
    </>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const hour = d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day} à ${hour}`;
}
