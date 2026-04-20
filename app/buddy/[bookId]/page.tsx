"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useMemo, useState, use } from "react";
import AppHeader from "@/components/AppHeader";
import BookCover from "@/components/BookCover";
import {
  getBook,
  getBuddyForBook,
  getUser,
  ME,
  timeAgo,
} from "@/lib/mock-data";

export default function BuddyPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = use(params);
  const book = getBook(bookId);
  if (!book) notFound();

  const buddy = getBuddyForBook(bookId);
  if (!buddy) notFound();

  const myProgress =
    buddy.participants.find((p) => p.userId === ME.id)?.progress ?? 0;
  const [progress, setProgress] = useState(myProgress);
  const [draft, setDraft] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  // Messages visibles = ceux dont atProgress <= mon progrès
  // (sauf si on a volontairement déverrouillé les spoilers)
  const visibleMessages = useMemo(() => {
    if (unlocked) return buddy.messages;
    return buddy.messages.filter((m) => m.atProgress <= progress);
  }, [buddy.messages, progress, unlocked]);

  const hiddenCount = buddy.messages.length - visibleMessages.length;

  return (
    <>
      <AppHeader back title="Reading buddy" subtitle={book.title} />

      <main className="px-5 pt-4 pb-10 space-y-6">
        {/* En-tête du buddy */}
        <section className="flex items-center gap-4 bg-paper border border-ink/10 rounded-2xl p-4">
          <BookCover book={book} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="font-serif text-xl font-bold text-ink leading-tight">
              {book.title}
            </div>
            <div className="text-xs text-ink/60 mb-2">
              {book.author} · démarré {timeAgo(buddy.startedAt)}
            </div>
            <div className="flex -space-x-2">
              {buddy.participants.map((p) => {
                const u = getUser(p.userId);
                if (!u) return null;
                return (
                  <div
                    key={p.userId}
                    title={`${u.name} · ${p.progress}%`}
                    className="w-8 h-8 rounded-full bg-cream border-2 border-paper flex items-center justify-center text-base"
                  >
                    {u.avatar}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Barres de progression */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
            Où en sont les lecteurs
          </h2>
          <ul className="space-y-3">
            {buddy.participants.map((p) => {
              const u = getUser(p.userId);
              if (!u) return null;
              const isMe = u.id === ME.id;
              return (
                <li key={p.userId} className="flex items-center gap-3">
                  <span className="text-2xl">{u.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-semibold text-sm text-ink truncate">
                        {u.name}
                        {isMe && (
                          <span className="ml-2 text-[10px] uppercase tracking-widest text-bordeaux font-bold">
                            toi
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-ink/60">
                        {isMe ? progress : p.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-ink/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          isMe ? "bg-bordeaux" : "bg-sage"
                        }`}
                        style={{
                          width: `${isMe ? progress : p.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Mettre à jour ma progression */}
        <section className="bg-cream/70 border border-dust rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] uppercase tracking-widest font-bold text-ink/60">
              Où j'en suis
            </div>
            <div className="font-serif text-lg font-bold text-bordeaux">
              {progress}%
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full accent-bordeaux"
          />
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-ink/40 font-bold mt-1">
            <span>Début</span>
            <span>Fin</span>
          </div>
        </section>

        {/* Messages avec spoiler-guard */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50">
              Discussion · spoiler-guard ON
            </h2>
            {hiddenCount > 0 && (
              <button
                onClick={() => setUnlocked((v) => !v)}
                className="text-[11px] uppercase tracking-widest font-bold text-ink/50"
              >
                {unlocked
                  ? "Reprotéger"
                  : `Lever le filtre (${hiddenCount})`}
              </button>
            )}
          </div>

          <ul className="space-y-3">
            {visibleMessages.map((m) => {
              const u = getUser(m.userId);
              if (!u) return null;
              return (
                <li
                  key={m.id}
                  className="bg-paper border border-ink/10 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{u.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-ink truncate">
                        {u.name}
                      </div>
                      <div className="text-[11px] text-ink/50">
                        {timeAgo(m.createdAt)} · à {m.atProgress}%
                      </div>
                    </div>
                  </div>
                  <p className="font-serif text-[15px] text-ink/90 leading-relaxed">
                    {m.text}
                  </p>
                </li>
              );
            })}

            {hiddenCount > 0 && !unlocked && (
              <li className="border-2 border-dashed border-ink/20 rounded-2xl p-5 text-center">
                <div className="text-3xl mb-2">🫥</div>
                <div className="text-sm text-ink/70 font-medium">
                  {hiddenCount} message
                  {hiddenCount > 1 ? "s" : ""} cachés — ils parlent de passages
                  que tu n'as pas encore lus.
                </div>
                <div className="text-[11px] text-ink/50 mt-2">
                  Avance dans le livre (ou lève le filtre si tu assumes).
                </div>
              </li>
            )}
          </ul>
        </section>

        {/* Composer */}
        <section className="bg-ink text-paper rounded-2xl p-4">
          <div className="text-[10px] uppercase tracking-widest text-paper/60 font-bold mb-2">
            Laisse un message à {progress}%
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="Une réaction, une question, un passage que tu viens de lire…"
            className="w-full bg-transparent text-paper placeholder:text-paper/40 font-serif resize-none focus:outline-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-[11px] text-paper/60">
              Ton message ne sera visible que des lecteurs arrivés à {progress}%.
            </span>
            <button
              onClick={() => setDraft("")}
              className="bg-paper text-ink text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full"
            >
              Envoyer
            </button>
          </div>
        </section>

        <div className="pt-2">
          <Link
            href={`/book/${book.id}`}
            className="text-xs uppercase tracking-widest font-bold text-ink/50"
          >
            ← Retour à la fiche
          </Link>
        </div>
      </main>
    </>
  );
}
