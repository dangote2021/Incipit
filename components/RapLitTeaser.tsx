"use client";

import Link from "next/link";

/**
 * Teaser Rap & Lit — placé dans le feed pour faire le pont entre les pitches
 * de classiques et la section punchlines. Esthétique dark, or, bordeaux —
 * on change de registre mais on reste dans la même famille éditoriale.
 */
export default function RapLitTeaser() {
  return (
    <section className="snap-start relative min-h-[calc(100vh-6rem)] flex items-center justify-center px-6 bg-ink text-paper overflow-hidden">
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 70% 20%, rgba(218,165,32,0.4) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(139,0,0,0.5) 0%, transparent 50%)",
        }}
      />
      <div className="relative max-w-sm text-center">
        <div className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-6">
          Interlude · Rap & Lit
        </div>

        <h2 className="font-serif text-4xl font-black leading-[1.1] mb-6 ink-drop">
          Booba cite Baudelaire.
          <br />
          Damso écrit comme Céline.
          <br />
          <span className="text-gold">On te prouve tout.</span>
        </h2>

        <p className="text-paper/80 text-[15px] leading-relaxed mb-8">
          Punchlines de rap français décortiquées comme des poèmes. Métaphores filées, chiasmes, anaphores : les mêmes figures de style que tes classiques au lycée, mais sur un beat.
        </p>

        <Link
          href="/punchlines"
          className="inline-flex items-center gap-2 bg-gold text-ink text-sm font-bold px-6 py-3.5 rounded-full hover:bg-gold/90 transition"
        >
          Entrer dans la section →
        </Link>

        <div className="mt-8 text-[11px] uppercase tracking-widest text-paper/40">
          8 analyses · de MC Solaar à Damso
        </div>
      </div>
    </section>
  );
}
