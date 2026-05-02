"use client";

// ─────────────────────────────────────────────────────────────────────────────
// <WeeklyAuthorCard /> — card "Semaine de l'auteur" dans le feed pitches.
//
// Concept produit (panel test in-app, 'cadeau de l'avent' / pochette surprise) :
//   1. Chaque semaine est dédiée à un auteur (Kundera, Tesson, Kessel…)
//   2. Chaque jour de la semaine, une nouvelle citation à découvrir
//   3. La citation arrive cachée derrière une "pochette" — on la révèle
//      au tap, comme un calendrier de l'avent
//   4. Le dimanche, la pochette du dimanche contient EN PLUS un lien vers
//      une vidéo YouTube de/sur l'auteur — récompense de fin de semaine
//
// Layout aligné sur le pattern des autres interludes du feed (snap-start
// h-screen, fond paper, CTA en pied).
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import {
  currentWeekAuthor,
  dayInWeek,
  DAY_LABELS_FR,
  type AuthorWeek,
} from "@/lib/weekly-authors";

export default function WeeklyAuthorCard() {
  const author: AuthorWeek = currentWeekAuthor();
  const dayIndex = dayInWeek();
  const dayLabel = DAY_LABELS_FR[dayIndex];
  const quote = author.quotes[Math.min(dayIndex, author.quotes.length - 1)];
  const isSunday = dayIndex === 6;

  const [revealed, setReveal] = useState(false);

  return (
    <section className="snap-start min-h-screen flex flex-col justify-center px-6 py-14 bg-gradient-to-b from-paper via-cream to-dust relative overflow-hidden">
      <div className="absolute top-12 -left-12 w-64 h-64 rounded-full bg-bordeaux/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 -right-16 w-72 h-72 rounded-full bg-gold/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-md mx-auto w-full">
        {/* Overline horizontal */}
        <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-bordeaux mb-2">
          La semaine de {author.name.split(" ").slice(-1)[0]}
        </div>

        {/* Identité auteur */}
        <h2 className="font-serif text-3xl font-black text-ink leading-tight">
          <span className="mr-2" aria-hidden>{author.emoji}</span>
          {author.name}
        </h2>
        <p className="mt-2 text-sm text-ink/65 font-serif italic leading-snug">
          {author.tagline}
        </p>

        {/* Calendrier de la semaine — 7 jours, le jour courant est mis en
            avant, les passés sont cochés, les futurs en pointillés */}
        <div className="mt-5 flex items-center gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => {
            const past = i < dayIndex;
            const today = i === dayIndex;
            return (
              <div
                key={i}
                className={`flex-1 h-7 rounded-md flex items-center justify-center text-[10px] font-bold uppercase tracking-widest transition ${
                  today
                    ? "bg-ink text-paper"
                    : past
                    ? "bg-bordeaux/20 text-bordeaux"
                    : "bg-ink/5 text-ink/40 border border-dashed border-ink/20"
                }`}
                aria-label={`${DAY_LABELS_FR[i]}${today ? " (aujourd'hui)" : past ? " (déjà ouvert)" : " (à venir)"}`}
              >
                {today ? "▾" : past ? "✓" : DAY_LABELS_FR[i].charAt(0)}
              </div>
            );
          })}
        </div>

        {/* POCHETTE SURPRISE — fermée par défaut, on tape pour révéler */}
        <div className="mt-7">
          {!revealed ? (
            <button
              type="button"
              onClick={() => setReveal(true)}
              className="w-full group relative overflow-hidden rounded-2xl border-2 border-bordeaux/30 bg-paper hover:border-bordeaux transition px-6 py-10 text-left"
              aria-label={`Découvrir la citation du ${dayLabel.toLowerCase()}`}
            >
              {/* Effet papier kraft / cadeau */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(139,30,63,0.08) 0px, rgba(139,30,63,0.08) 2px, transparent 2px, transparent 12px)",
                }}
              />
              <div className="relative">
                <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-2">
                  {dayLabel} · Pochette du jour
                </div>
                <div className="font-serif text-2xl font-black text-ink leading-tight">
                  Touche pour découvrir
                </div>
                <div className="mt-3 text-xs text-ink/60 italic">
                  Une citation par jour, scellée jusqu'au matin.
                  {isSunday && (
                    <span className="block mt-1 text-bordeaux font-bold not-italic uppercase tracking-widest text-[10px]">
                      ⊛ Bonus dimanche : vidéo offerte
                    </span>
                  )}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-bordeaux">
                  Ouvrir <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </button>
          ) : (
            <div className="rounded-2xl bg-paper border-2 border-bordeaux/30 px-6 py-7 animate-fade-up">
              <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-3">
                La citation qui claque · {dayLabel}
              </div>
              <blockquote className="font-serif text-xl italic text-ink leading-snug">
                « {quote.text} »
              </blockquote>
              {quote.source && (
                <div className="mt-3 text-xs text-ink/60 font-serif italic">
                  — {quote.source}, {author.name}
                </div>
              )}

              {/* DIMANCHE : bonus vidéo YouTube */}
              {isSunday && (
                <div className="mt-6 pt-5 border-t border-bordeaux/15">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-2">
                    ⊛ Bonus dimanche
                  </div>
                  <a
                    href={author.youtube.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="font-serif text-base font-black text-ink leading-snug group-hover:text-bordeaux transition">
                      ▶ {author.youtube.title}
                    </div>
                    <div className="mt-1 text-xs text-ink/60">
                      {author.youtube.source}
                      {author.youtube.durationMin
                        ? ` · ${author.youtube.durationMin} min`
                        : ""}
                    </div>
                  </a>
                </div>
              )}

              <button
                type="button"
                onClick={() => setReveal(false)}
                className="mt-5 text-[11px] uppercase tracking-widest font-bold text-ink/50 hover:text-bordeaux transition"
              >
                ↺ Refermer la pochette
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-ink/45 font-bold">
          {WEEKLY_AUTHORS_COUNT} auteurs en rotation · Nouvelle pochette demain
        </p>
      </div>
    </section>
  );
}

// On évite l'import direct du tableau pour pas alourdir le bundle —
// le compteur est déclaré ici.
const WEEKLY_AUTHORS_COUNT = 3;
