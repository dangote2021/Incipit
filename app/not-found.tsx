import Link from "next/link";

export const metadata = {
  title: "Page introuvable · Incipit",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-16 bg-paper">
      <div className="max-w-md w-full text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-4">
          Erreur 404
        </div>
        <h1 className="font-serif text-5xl font-black text-ink leading-[1.05] mb-4">
          Cette page n'existe pas.
        </h1>
        <p className="font-serif text-xl text-ink/70 italic leading-relaxed mb-8">
          « Longtemps, je me suis couché de bonne heure… » — mais pas ici.
        </p>
        <p className="text-sm text-ink/60 mb-10 leading-relaxed">
          Soit le lien est cassé, soit on a bougé la page. Dans tous les cas,
          retour au rayon principal.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-ink text-paper text-sm font-bold uppercase tracking-widest px-6 py-3.5 rounded-full hover:bg-ink/90 transition"
          >
            Retour à l'accueil →
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center justify-center text-[13px] font-semibold text-bordeaux hover:underline"
          >
            Explorer par thèmes
          </Link>
        </div>
      </div>
    </div>
  );
}
