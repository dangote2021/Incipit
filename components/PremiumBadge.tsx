"use client";

import Link from "next/link";
import { usePremium, formatTrialRemaining } from "@/lib/premium";

// Petit badge réutilisable : affiche "Premium" quand actif, ou un CTA
// discret "Passer Premium" sinon. On évite de crier — c'est Incipit, pas
// une app de productivité qui agresse.
export default function PremiumBadge({
  variant = "inline",
}: {
  variant?: "inline" | "block";
}) {
  const { isPremium, trialEndsAt, hydrated } = usePremium();

  if (!hydrated) return null;

  if (isPremium) {
    if (variant === "block") {
      return (
        <div className="rounded-2xl bg-ink text-paper p-4 border border-gold/40">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">
                Premium actif
              </div>
              <div className="font-serif text-base font-bold mt-1">
                L'app complète est à toi.
              </div>
              {trialEndsAt && (
                <div className="text-[11px] text-paper/60 italic mt-1">
                  {formatTrialRemaining(trialEndsAt)}
                </div>
              )}
            </div>
            <Link
              href="/premium"
              className="text-[10px] uppercase tracking-widest text-paper/70 font-bold hover:text-gold transition"
            >
              Gérer →
            </Link>
          </div>
        </div>
      );
    }
    return (
      <Link
        href="/premium"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/15 border border-gold/40 text-[9px] uppercase tracking-widest text-gold font-black"
      >
        <span className="h-1 w-1 rounded-full bg-gold" />
        Premium
      </Link>
    );
  }

  if (variant === "block") {
    return (
      <Link
        href="/premium"
        className="block rounded-2xl bg-gradient-to-br from-gold/20 to-bordeaux/10 border border-gold/30 p-4 hover:from-gold/30 transition"
      >
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-black">
          Premium · 7 jours offerts
        </div>
        <div className="font-serif text-base font-bold text-ink mt-1">
          Enchaîne les quiz, l'archive, les punchlines.
        </div>
        <div className="text-[11px] uppercase tracking-widest text-ink/60 font-bold mt-2">
          Débloquer →
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/premium"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/5 border border-ink/15 text-[9px] uppercase tracking-widest text-ink/70 font-black hover:bg-gold/10 hover:text-bordeaux hover:border-bordeaux/40 transition"
    >
      Passer Premium
    </Link>
  );
}
