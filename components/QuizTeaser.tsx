import Link from "next/link";

// Quiz en milieu de feed : appel au jeu. On reformule pour refléter la
// nouvelle mouture multi-catégories (incipits + auteurs + personnages +
// dates + mouvements + figures), et on mentionne les jalons culturels —
// sans basculer en gamif toxique.
export default function QuizTeaser() {
  return (
    <section className="snap-start min-h-screen flex flex-col justify-center px-6 py-14 bg-gradient-to-b from-ink via-ink to-bordeaux text-paper relative overflow-hidden">
      <div className="absolute -top-20 -right-10 w-72 h-72 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute bottom-10 -left-10 w-56 h-56 rounded-full bg-bordeaux/30 blur-3xl" />

      <div className="relative max-w-md mx-auto text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-5">
          Pause · Quiz littéraire
        </div>

        <div className="font-serif text-7xl text-paper/30 leading-none mb-2">
          ?
        </div>

        <h2 className="font-serif text-4xl font-black leading-tight mb-4">
          Incipits, auteurs, figures<span className="text-gold">.</span>
        </h2>

        <p className="font-serif italic text-lg text-paper/80 leading-snug mb-8">
          6 catégories, 8 questions par partie. Reconnais un oxymore, date une
          parution, replace un personnage. Les jalons culturels se débloquent
          en silence.
        </p>

        <Link
          href="/quiz"
          className="inline-block px-8 py-4 rounded-full bg-paper text-ink font-serif font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-gold transition"
        >
          Commencer la partie
        </Link>

        <div className="mt-6 flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest text-paper/60 font-bold">
          <span>3 min</span>
          <span className="w-1 h-1 rounded-full bg-paper/30" />
          <span>12 jalons à débloquer</span>
        </div>
      </div>
    </section>
  );
}
