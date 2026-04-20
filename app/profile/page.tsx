"use client";

import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BookCover from "@/components/BookCover";
import {
  ME,
  MY_LIBRARY,
  getBook,
  getNotesByUser,
  getAnnotationsByUser,
  BADGES,
  READING_SESSIONS,
  CLUBS,
  timeAgo,
  formatMinutes,
  formatDateShort,
} from "@/lib/mock-data";

export default function ProfilePage() {
  const read = MY_LIBRARY.filter((e) => e.status === "read");
  const reading = MY_LIBRARY.filter((e) => e.status === "reading");
  const myNotes = getNotesByUser(ME.id);
  const myAnnotations = getAnnotationsByUser(ME.id);
  const myClubs = CLUBS.filter((c) => ME.joinedClubs.includes(c.id));
  const earnedBadges = BADGES.filter((b) => b.earned);
  const lockedBadges = BADGES.filter((b) => !b.earned);

  // Stats lecture
  const totalMinutes = READING_SESSIONS.reduce((s, r) => s + r.minutes, 0);
  const avgPerDay = Math.round(totalMinutes / READING_SESSIONS.length);
  const longestSession = READING_SESSIONS.reduce(
    (max, r) => (r.minutes > max ? r.minutes : max),
    0
  );
  const maxMin = READING_SESSIONS.reduce(
    (max, r) => (r.minutes > max ? r.minutes : max),
    0
  );

  return (
    <>
      <AppHeader
        title="Profil"
        action={
          <button className="text-xs uppercase tracking-widest font-bold text-ink/60">
            Modifier
          </button>
        }
      />

      {/* Carte profil */}
      <section className="px-5 pt-4">
        <div className="bg-gradient-to-br from-ink via-ink to-bordeaux rounded-3xl p-6 text-paper relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-gold/20 rounded-full blur-3xl" />
          <div className="relative flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-paper/15 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0">
              {ME.avatar}
            </div>
            <div className="flex-1">
              <h1 className="font-serif text-2xl font-bold leading-tight">
                {ME.name}
              </h1>
              <div className="text-xs text-paper/70 mb-2">{ME.handle}</div>
              <p className="text-sm text-paper/90 font-serif italic leading-snug">
                « {ME.bio} »
              </p>
            </div>
          </div>

          <div className="relative mt-5 grid grid-cols-3 gap-2">
            <Stat value={read.length} label="Lus" />
            <Stat value={myNotes.length} label="Notes" />
            <Stat value={earnedBadges.length} label="Badges" />
          </div>
        </div>
      </section>

      <main className="px-5 py-6 space-y-8">
        {/* Stats intimes */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
            Temps passé avec les livres
          </h2>
          <div className="bg-paper border border-ink/10 rounded-2xl p-5">
            <div className="grid grid-cols-3 gap-3 mb-5">
              <MiniStat
                value={formatMinutes(totalMinutes)}
                label="30 derniers jours"
                accent="text-bordeaux"
              />
              <MiniStat
                value={formatMinutes(avgPerDay)}
                label="Moyenne / jour"
                accent="text-sage"
              />
              <MiniStat
                value={formatMinutes(longestSession)}
                label="Plus longue session"
                accent="text-gold"
              />
            </div>

            {/* Chart en barres minimaliste */}
            <div className="mt-2">
              <div className="flex items-end gap-[3px] h-24">
                {READING_SESSIONS.map((s) => (
                  <div
                    key={s.date}
                    className="flex-1 bg-bordeaux/80 rounded-t hover:bg-bordeaux transition"
                    style={{
                      height: `${Math.max((s.minutes / maxMin) * 100, 4)}%`,
                      opacity: s.minutes === 0 ? 0.15 : 1,
                    }}
                    title={`${formatDateShort(s.date)} · ${formatMinutes(
                      s.minutes
                    )}`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-ink/40 font-bold mt-2">
                <span>{formatDateShort(READING_SESSIONS[0].date)}</span>
                <span>
                  {formatDateShort(
                    READING_SESSIONS[READING_SESSIONS.length - 1].date
                  )}
                </span>
              </div>
            </div>
            <p className="text-[11px] italic text-ink/50 mt-3 leading-relaxed">
              Pas de streak. Pas de classement. Juste un temps qui t'appartient.
            </p>
          </div>
        </section>

        {/* Étagère 3D — livres lus */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50">
              Mon étagère
            </h2>
            <Link
              href="/library"
              className="text-xs uppercase tracking-widest font-bold text-bordeaux"
            >
              Tout voir
            </Link>
          </div>
          <div className="relative bg-gradient-to-b from-ink via-ink/95 to-ink/80 rounded-2xl p-4 pb-7 overflow-hidden">
            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
              {read.map((e) => {
                const book = getBook(e.bookId)!;
                return (
                  <Link
                    key={book.id}
                    href={`/book/${book.id}`}
                    className={`shrink-0 w-[42px] h-32 rounded-sm bg-gradient-to-br ${book.cover} shadow-md hover:-translate-y-1 transition-transform flex items-end p-1`}
                    title={`${book.title} — ${book.author}`}
                    style={{
                      transform: `rotate(${
                        (parseInt(book.id.slice(0, 2), 36) % 5) - 2
                      }deg)`,
                    }}
                  >
                    <span
                      className="font-serif text-[9px] font-bold text-paper leading-tight"
                      style={{ writingMode: "vertical-rl" }}
                    >
                      {book.title}
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-b from-transparent to-ink/90" />
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
            Badges · {earnedBadges.length} / {BADGES.length}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {earnedBadges.map((b) => (
              <BadgeCard key={b.id} badge={b} />
            ))}
            {lockedBadges.map((b) => (
              <BadgeCard key={b.id} badge={b} />
            ))}
          </div>
        </section>

        {/* En cours */}
        {reading.length > 0 && (
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
              En cours
            </h2>
            <ul className="space-y-3">
              {reading.map((e) => {
                const book = getBook(e.bookId)!;
                const progress = e.progress ?? 0;
                return (
                  <li key={book.id}>
                    <Link
                      href={`/book/${book.id}`}
                      className="flex gap-3 items-center bg-paper border border-ink/10 rounded-2xl p-3"
                    >
                      <BookCover book={book} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="font-serif text-lg font-bold text-ink truncate">
                          {book.title}
                        </div>
                        <div className="text-xs text-ink/60 mb-2">
                          {book.author}
                        </div>
                        <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden">
                          <div
                            className="h-full bg-gold rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-ink/50 mt-1 uppercase tracking-widest font-semibold">
                          {progress}%
                          {e.minutesRead &&
                            ` · ${formatMinutes(e.minutesRead)} lus`}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Annotations */}
        {myAnnotations.length > 0 && (
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
              Mes passages soulignés · {myAnnotations.length}
            </h2>
            <ul className="space-y-3">
              {myAnnotations.map((a) => {
                const book = getBook(a.bookId);
                if (!book) return null;
                return (
                  <li
                    key={a.id}
                    className="bg-cream/50 border border-dust rounded-2xl p-4"
                  >
                    <Link
                      href={`/book/${book.id}`}
                      className="block text-[11px] uppercase tracking-widest font-bold text-ink/50 mb-2"
                    >
                      {book.title} · {book.author}
                    </Link>
                    <div className="font-serif italic text-ink/90 text-[15px] leading-snug border-l-2 border-bordeaux pl-3 mb-2">
                      « {a.excerpt} »
                    </div>
                    {a.note && (
                      <p className="text-xs text-ink/70 leading-relaxed">
                        {a.note}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Notes publiques */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
            Mes notes publiques · {myNotes.length}
          </h2>
          <ul className="space-y-3">
            {myNotes.map((n) => {
              const book = getBook(n.bookId)!;
              return (
                <li
                  key={n.id}
                  className="bg-paper border border-ink/10 rounded-2xl p-4"
                >
                  <Link
                    href={`/book/${book.id}`}
                    className="flex items-center gap-2 mb-3"
                  >
                    <BookCover book={book} size="xs" />
                    <div className="flex-1 min-w-0">
                      <div className="font-serif font-bold text-ink leading-tight truncate">
                        {book.title}
                      </div>
                      <div className="text-[11px] text-ink/50">
                        {timeAgo(n.createdAt + "T12:00:00")}
                      </div>
                    </div>
                    {n.rating && (
                      <span className="text-gold">
                        {"★".repeat(n.rating)}
                      </span>
                    )}
                  </Link>
                  <p className="font-serif text-[15px] text-ink/90 leading-relaxed">
                    {n.text}
                  </p>
                </li>
              );
            })}
            {myNotes.length === 0 && (
              <li className="text-center py-6 text-ink/50 text-sm">
                Tu n'as pas encore écrit de note.
              </li>
            )}
          </ul>
        </section>

        {/* Mes clubs */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
            Mes clubs
          </h2>
          <ul className="space-y-3">
            {myClubs.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/clubs/${c.id}`}
                  className="flex items-center gap-3 bg-paper border border-ink/10 rounded-2xl p-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-bordeaux text-paper flex items-center justify-center text-xl">
                    {c.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-lg font-bold text-ink truncate">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-ink/60">
                      {c.members} membres · {c.vibe}
                    </div>
                  </div>
                  <span className="text-ink/40">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Actions */}
        <section className="pt-2 space-y-2">
          <Link
            href="/onboarding"
            className="block text-center text-xs uppercase tracking-widest font-bold text-ink/60 py-3 border border-ink/10 rounded-full"
          >
            Préférences de lecture
          </Link>
        </section>
      </main>
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-paper/15 backdrop-blur-sm rounded-xl p-3 text-center">
      <div className="font-serif text-2xl font-black leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-widest font-bold opacity-80 mt-1">
        {label}
      </div>
    </div>
  );
}

function MiniStat({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <div className="text-center">
      <div className={`font-serif text-lg font-black leading-none ${accent}`}>
        {value}
      </div>
      <div className="text-[9px] uppercase tracking-widest font-bold text-ink/50 mt-1 leading-tight">
        {label}
      </div>
    </div>
  );
}

function BadgeCard({
  badge,
}: {
  badge: {
    id: string;
    label: string;
    emoji: string;
    description: string;
    earned: boolean;
    rarity: "commun" | "rare" | "légendaire";
  };
}) {
  const rarityColor = {
    commun: "text-ink/60",
    rare: "text-sage",
    légendaire: "text-gold",
  }[badge.rarity];

  return (
    <div
      className={`rounded-2xl p-3 text-center border ${
        badge.earned
          ? "bg-paper border-ink/10"
          : "bg-ink/5 border-ink/10 opacity-50"
      }`}
      title={badge.description}
    >
      <div className={`text-3xl mb-1 ${!badge.earned && "grayscale"}`}>
        {badge.emoji}
      </div>
      <div className="font-serif text-sm font-bold text-ink leading-tight">
        {badge.label}
      </div>
      <div
        className={`text-[9px] uppercase tracking-widest font-bold mt-1 ${rarityColor}`}
      >
        {badge.rarity}
      </div>
    </div>
  );
}
