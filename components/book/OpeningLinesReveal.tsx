type Props = {
  openingLines: string;
};

// Utilise <details>/<summary> pour rester JS-free : le contenu est dans le HTML
// dès le premier paint, les crawlers le voient, pas besoin de client island.
export default function OpeningLinesReveal({ openingLines }: Props) {
  const teaser =
    openingLines.length > 120
      ? `${openingLines.slice(0, 120)}…`
      : openingLines;

  return (
    <details className="group bg-cream/70 border border-dust rounded-2xl overflow-hidden">
      <summary className="cursor-pointer list-none p-5 hover:bg-cream transition">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest text-bordeaux font-bold">
            Ouvre le livre
          </span>
          <span className="text-ink/40 group-open:hidden">▼</span>
          <span className="text-ink/40 hidden group-open:inline">▲</span>
        </div>
        <p className="font-serif text-sm text-ink/60 leading-relaxed italic group-open:hidden">
          {teaser}
        </p>
      </summary>
      <div className="px-5 pb-5">
        <p className="font-serif text-base text-ink/90 leading-relaxed italic">
          {openingLines}
        </p>
      </div>
    </details>
  );
}
