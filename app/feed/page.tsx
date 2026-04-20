import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BookCover from "@/components/BookCover";
import {
  FEED,
  getBook,
  getClub,
  getUser,
  timeAgo,
} from "@/lib/mock-data";

export default function FeedPage() {
  return (
    <>
      <AppHeader
        title="Le feed"
        subtitle="Ce que lit la communauté"
      />

      <main className="px-5 pt-4">
        <ul className="space-y-3">
          {FEED.map((item) => {
            const user = getUser(item.userId)!;
            const book = item.bookId ? getBook(item.bookId) : undefined;
            const club = item.clubId ? getClub(item.clubId) : undefined;

            return (
              <li
                key={item.id}
                className="bg-paper border border-ink/10 rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Link
                    href={`/profile`}
                    className="flex items-center gap-2 flex-1 min-w-0"
                  >
                    <span className="text-2xl">{user.avatar}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-ink truncate">
                        {user.name}{" "}
                        <span className="text-ink/50 font-normal">
                          {verbFor(item.type)}
                        </span>
                      </div>
                      <div className="text-[11px] text-ink/50">
                        {user.handle} · {timeAgo(item.createdAt)}
                      </div>
                    </div>
                  </Link>
                </div>

                {book && (
                  <Link
                    href={`/book/${book.id}`}
                    className="flex gap-3 items-center bg-cream/60 rounded-xl p-3 hover:bg-cream transition"
                  >
                    <BookCover book={book} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-base font-bold text-ink leading-tight truncate">
                        {book.title}
                      </div>
                      <div className="text-xs text-ink/60 truncate">
                        {book.author}
                      </div>
                      {item.type === "note" && item.noteText && (
                        <p className="mt-2 font-serif text-sm text-ink/80 italic line-clamp-3">
                          « {item.noteText} »
                        </p>
                      )}
                    </div>
                  </Link>
                )}

                {club && (
                  <Link
                    href={`/clubs/${club.id}`}
                    className="flex gap-3 items-center bg-cream/60 rounded-xl p-3 hover:bg-cream transition"
                  >
                    <div className="w-14 h-14 rounded-xl bg-bordeaux text-paper flex items-center justify-center text-2xl">
                      {club.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-base font-bold text-ink truncate">
                        {club.name}
                      </div>
                      <div className="text-xs text-ink/60">
                        {club.members} membres
                      </div>
                    </div>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}

function verbFor(type: string) {
  switch (type) {
    case "started": return "a commencé";
    case "finished": return "a terminé";
    case "note": return "a écrit une note sur";
    case "joined-club": return "a rejoint";
    case "added": return "a ajouté à sa bibli";
    default: return "";
  }
}
