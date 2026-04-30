"use client";

import Link from "next/link";
import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import BookCover from "@/components/BookCover";
import { BOOKS, MY_LIBRARY, ME } from "@/lib/mock-data";
import type { ReadingStatus } from "@/lib/types";

const TABS: { key: ReadingStatus | "all"; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "reading", label: "En cours" },
  { key: "to-read", label: "À lire" },
  { key: "read", label: "Lus" },
];

export default function LibraryPage() {
  const [tab, setTab] = useState<ReadingStatus | "all">("all");

  const entries =
    tab === "all" ? MY_LIBRARY : MY_LIBRARY.filter((e) => e.status === tab);

  const counts = {
    all: MY_LIBRARY.length,
    reading: MY_LIBRARY.filter((e) => e.status === "reading").length,
    "to-read": MY_LIBRARY.filter((e) => e.status === "to-read").length,
    read: MY_LIBRARY.filter((e) => e.status === "read").length,
  } as Record<string, number>;

  return (
    <>
      <AppHeader
        title="Ma bibliothèque"
        subtitle={`${ME.booksRead} livres traversés`}
      />

      <main className="px-5 pt-4">
        {/* Scan CTA */}
        <Link
          href="/scan"
          className="mb-5 flex items-center gap-3 bg-gradient-to-r from-ink via-bordeaux to-red-900 text-paper rounded-2xl p-4 shadow-lg hover:scale-[1.01] transition"
        >
          <div className="w-12 h-12 rounded-full bg-paper/15 flex items-center justify-center text-2xl shrink-0">
            📸
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-gold font-bold">
              Incipit Lens
            </div>
            <div className="font-serif text-base font-bold leading-tight">
              Scanner un livre papier
            </div>
            <div className="text-xs text-paper/70 truncate">
              Couverture ou passage · on reconnaît, on ajoute
            </div>
          </div>
          <span className="text-paper/60 text-xl">›</span>
        </Link>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="En cours" value={counts.reading} accent="bg-gold/20 text-gold" />
          <StatCard label="À lire" value={counts["to-read"]} accent="bg-sage/20 text-sage" />
          <StatCard label="Lus" value={counts.read} accent="bg-bordeaux/15 text-bordeaux" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`shrink-0 text-xs uppercase tracking-widest font-bold min-h-[44px] px-4 py-2 rounded-full transition ${
                tab === t.key
                  ? "bg-ink text-paper"
                  : "bg-ink/5 text-ink/70 hover:bg-ink/10"
              }`}
            >
              {t.label} · {counts[t.key]}
            </button>
          ))}
        </div>

        {/* Liste */}
        {entries.length === 0 ? (
          <div className="text-center py-16 text-ink/50">
            <div className="text-5xl mb-4">📖</div>
            <p>Rien ici pour l'instant.</p>
            <Link href="/" className="mt-4 inline-block text-bordeaux font-semibold">
              Découvrir des livres →
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {entries.map((e) => {
              const book = BOOKS.find((b) => b.id === e.bookId)!;
              return (
                <li key={e.bookId}>
                  <Link
                    href={`/book/${book.id}`}
                    className="flex gap-4 items-center bg-paper border border-ink/10 rounded-2xl p-3 hover:border-ink/25 transition"
                  >
                    <BookCover book={book} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-lg font-bold text-ink leading-tight truncate">
                        {book.title}
                      </div>
                      <div className="text-xs text-ink/60 mb-1.5">
                        {book.author} · {book.year}
                      </div>
                      <StatusPill status={e.status} />
                    </div>
                    <span className="text-ink/40">›</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="bg-paper border border-ink/10 rounded-2xl p-3">
      <div className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">
        {label}
      </div>
      <div
        className={`mt-1 inline-flex items-center justify-center font-serif text-2xl font-bold px-2 py-0.5 rounded-lg ${accent}`}
      >
        {value}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: ReadingStatus }) {
  const map = {
    reading: { label: "En cours", cls: "bg-gold/20 text-gold" },
    "to-read": { label: "À lire", cls: "bg-sage/20 text-sage" },
    read: { label: "Lu", cls: "bg-bordeaux/15 text-bordeaux" },
  } as const;
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${s.cls}`}
    >
      {s.label}
    </span>
  );
}
