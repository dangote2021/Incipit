"use client";

// ─────────────────────────────────────────────────────────────────────────────
// <EmptyAuthState /> — affiché sur les pages qui exigent un compte connecté
// (feed communautaire, bibliothèque perso, clubs). Remplace le contenu mocké
// qui faisait croire au nouvel utilisateur qu'il avait un compte / des amis
// (panel test virtuel : 4 personas pensaient être sur le compte de quelqu'un
// d'autre).
//
// Trois états gérés en interne :
//   - hydratation pas finie     → skeleton silencieux (pas de flash)
//   - Supabase pas configuré    → CTA "L'auth arrive bientôt", lien /about
//   - user pas connecté         → CTA "Se connecter" / "Créer un compte"
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/supabase/use-auth";

type Props = {
  /** Titre du contexte (ex: 'Ta bibliothèque', 'Le feed') */
  title: string;
  /** Pitch éditorial sous le titre, 1-2 phrases */
  pitch: string;
  /** Si user connecté → afficher ce children (la page normale) */
  children: ReactNode;
  /** Page sur laquelle revenir après login (par défaut la route courante) */
  loginNext?: string;
};

export default function EmptyAuthState({
  title,
  pitch,
  children,
  loginNext = "/",
}: Props) {
  const { user, ready, configured } = useAuth();

  // Skeleton durant l'hydratation — évite le flash du contenu mocké
  if (!ready) {
    return (
      <main className="px-5 pt-12 pb-20" aria-busy="true">
        <div className="h-6 w-32 bg-ink/5 rounded animate-pulse mb-4" />
        <div className="h-4 w-3/4 bg-ink/5 rounded animate-pulse" />
      </main>
    );
  }

  // User connecté : on rend la page normale
  if (user) return <>{children}</>;

  // Pas connecté → écran d'invitation
  return (
    <main className="px-6 pt-12 pb-20 max-w-md mx-auto">
      <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-bordeaux mb-3">
        Connexion requise
      </div>
      <h1 className="font-serif text-3xl font-black text-ink leading-tight mb-3">
        {title}
      </h1>
      <p className="font-serif text-base text-ink/75 leading-relaxed italic mb-8">
        {pitch}
      </p>

      {configured ? (
        <div className="flex flex-col gap-3">
          <Link
            href={`/auth/login?next=${encodeURIComponent(loginNext)}`}
            className="block w-full text-center bg-ink text-paper py-3.5 rounded-full text-[11px] uppercase tracking-widest font-bold hover:bg-bordeaux transition"
          >
            Se connecter
          </Link>
          <Link
            href="/"
            className="block w-full text-center text-[12px] font-semibold text-ink/60 hover:text-bordeaux transition"
          >
            Continuer sans compte →
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-ink/15 bg-cream/60 p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-2">
            Bientôt
          </div>
          <p className="text-sm text-ink/75 leading-relaxed">
            Cette section nécessite un compte. La connexion sera activée à
            l'ouverture publique. En attendant, profite des pitches, des
            quiz et de l'incipit du jour — pas besoin d'inscription.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-[11px] uppercase tracking-widest font-bold text-bordeaux hover:underline"
          >
            Retour aux pitches →
          </Link>
        </div>
      )}
    </main>
  );
}
