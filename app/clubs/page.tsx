import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BookCover from "@/components/BookCover";
import { CLUBS, getBook, ME } from "@/lib/mock-data";

export default function ClubsPage() {
  const myClubs = CLUBS.filter((c) => ME.joinedClubs.includes(c.id));
  const otherClubs = CLUBS.filter((c) => !ME.joinedClubs.includes(c.id));

  return (
    <>
      <AppHeader
        title="Book clubs"
        subtitle="Lire ensemble, c'est mieux"
      />

      <main className="px-5 pt-4 space-y-8">
        {myClubs.length > 0 && (
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
              Tes clubs · {myClubs.length}
            </h2>
            <ul className="space-y-3">
              {myClubs.map((c) => (
                <ClubRow key={c.id} club={c} joined />
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
            Explorer · {otherClubs.length}
          </h2>
          <ul className="space-y-3">
            {otherClubs.map((c) => (
              <ClubRow key={c.id} club={c} />
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

function ClubRow({
  club,
  joined,
}: {
  club: (typeof CLUBS)[number];
  joined?: boolean;
}) {
  const book = getBook(club.currentBookId);
  return (
    <li>
      <Link
        href={`/clubs/${club.id}`}
        className="block bg-paper border border-ink/10 rounded-2xl p-4 hover:border-ink/25 transition"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-bordeaux text-paper flex items-center justify-center text-2xl shrink-0">
            {club.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-xl font-bold text-ink leading-tight">
                {club.name}
              </h3>
              {joined && (
                <span className="text-[10px] uppercase tracking-widest font-bold bg-sage/20 text-sage px-2 py-0.5 rounded-full">
                  Membre
                </span>
              )}
            </div>
            <div className="text-xs text-ink/60 mt-0.5">
              {club.members} membres · {club.vibe}
            </div>
            <p className="text-sm text-ink/75 mt-2 line-clamp-2">
              {club.description}
            </p>
          </div>
        </div>

        {book && (
          <div className="mt-3 pt-3 border-t border-ink/10 flex items-center gap-3">
            <BookCover book={book} size="xs" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">
                Livre du mois
              </div>
              <div className="text-sm font-serif font-bold text-ink truncate">
                {book.title}
              </div>
              <div className="text-[11px] text-ink/60 truncate">
                {book.author}
              </div>
            </div>
          </div>
        )}
      </Link>
    </li>
  );
}
