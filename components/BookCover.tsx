import type { Book } from "@/lib/types";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_MAP: Record<Size, string> = {
  xs: "w-12 h-16 text-[10px]",
  sm: "w-16 h-24 text-xs",
  md: "w-24 h-36 text-sm",
  lg: "w-36 h-52 text-base",
  xl: "w-48 h-72 text-lg",
};

export default function BookCover({
  book,
  size = "md",
  className = "",
}: {
  book: Book;
  size?: Size;
  className?: string;
}) {
  return (
    <div
      className={`relative ${SIZE_MAP[size]} rounded-sm overflow-hidden book-shadow shrink-0 bg-gradient-to-br ${book.cover} ${className}`}
    >
      {/* Tranche de livre à gauche */}
      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-black/25" />
      {/* Reflet */}
      <span className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0" />
      <div className="relative h-full flex flex-col justify-between p-2.5 text-white/95">
        <div className="font-serif font-bold leading-tight ink-drop line-clamp-4">
          {book.title}
        </div>
        <div className="text-[0.7em] uppercase tracking-wider font-semibold opacity-90">
          {book.author.split(" ").slice(-1)}
        </div>
      </div>
    </div>
  );
}
