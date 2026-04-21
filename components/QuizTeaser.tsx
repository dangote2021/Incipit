import Link from "next/link";

export default function QuizTeaser() {
  return (
    <section className="snap-start min-h-screen flex flex-col justify-center px-6 py-14 bg-gradient-to-b from-ink via-ink to-bordeaux text-paper relative overflow-hidden">
      <div className="absolute -top-20 -right-10 w-72 h-72 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute bottom-10 -left-10 w-56 h-56 rounded-full bg-bordeaux/30 blur-3xl" />

      <div className="relative max-w-md mx-auto text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-5">
          Pause · Jeu
        </div>

        <div className="font-serif text-7xl text-paper/30 leading-none mb-2">
          ?
        </div>

        <h2 className="font-serif text-4xl font-black leading-tight mb-4">
          Devine l'incipit<span className="text-gold">.</span>
        </h2>

        <p className="font-serif italic text-lg text-paper/80 leading-snug mb-8">
          8 premières lignes. 4 choix par question. Un verdict, un score
          partageable. Tu connais tes classiques ?
        </p>

        <Link
          href="/quiz"
          className="inline-block px-8 py-4 rounded-full bg-paper text-ink font-serif font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-gold transition"
        >
          Commencer la partie
        </Link>

        <p className="mt-4 text-[11px] uppercase tracking-widest text-paper/50">
          Ça prend 3 minutes.
        </p>
      </div>
    </section>
  );
}
