"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  dismissReEngagement,
  peekReEngagement,
  type ReEngagementSignal,
} from "@/lib/re-engagement";

/**
 * Banner "bon retour" affiché en tête de home quand l'utilisateur revient
 * après ≥ 3 jours d'absence. Trois paliers (J3, J7, J30) avec ton gradué.
 *
 * Le signal est posé par recordOpen() (lib/streak.ts) dès que l'app détecte
 * un gap. Le banner le consomme au dismiss (X ou clic CTA) pour ne pas
 * le re-jouer le lendemain si la personne est revenue.
 *
 * Client-only : skeleton h-0 → on ne réserve pas d'espace, c'est une
 * section surprise qui s'ajoute au flux quand applicable. Pour ne pas
 * pousser le contenu "normal", on la place en snap-start avant le feed.
 */
export default function ReEngagementBanner() {
  const [signal, setSignal] = useState<ReEngagementSignal | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const s = peekReEngagement();
    setSignal(s);
  }, []);

  if (!signal || dismissed) return null;

  const handleDismiss = () => {
    dismissReEngagement();
    setDismissed(true);
  };

  const { title, lead, ctaLabel, ctaHref, dayLabel } = variantCopy(signal);

  return (
    <section className="snap-start min-h-[calc(100vh-6rem)] flex items-center justify-center px-6 py-10 bg-gradient-to-b from-bordeaux/10 via-cream to-paper">
      <div className="max-w-md w-full mx-auto">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-3 text-center">
          {dayLabel}
        </div>
        <h2 className="font-serif text-4xl font-black text-ink leading-[1.05] text-center mb-4">
          {title}
        </h2>
        <p className="text-[15px] text-ink/75 leading-relaxed text-center mb-7 max-w-sm mx-auto">
          {lead}
        </p>

        <div className="space-y-2">
          <Link
            href={ctaHref}
            onClick={() => {
              // On consomme le signal à l'acceptation : si l'utilisateur
              // clique, il n'a pas besoin qu'on lui reraconte demain.
              dismissReEngagement();
              setDismissed(true);
            }}
            className="block w-full text-center bg-ink text-paper py-3.5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-bordeaux transition"
          >
            {ctaLabel}
          </Link>
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full text-center py-2.5 rounded-full text-[11px] uppercase tracking-widest font-bold text-ink/50 hover:text-ink transition"
          >
            Continuer comme d'habitude
          </button>
        </div>
      </div>
    </section>
  );
}

// Ton adapté à la durée d'absence. Règle édito :
//   - J3 : "on t'a gardé ta place" (léger, amical)
//   - J7 : "une semaine est passée" (reprise douce, on oriente vers court)
//   - J30 : "beaucoup de choses depuis" (retrouvailles, on déroule l'archive)
function variantCopy(signal: ReEngagementSignal): {
  dayLabel: string;
  title: string;
  lead: string;
  ctaLabel: string;
  ctaHref: string;
} {
  if (signal.kind === "j30") {
    return {
      dayLabel: `De retour après ${signal.days} jours`,
      title: "Ça fait un mois. Bon retour.",
      lead: "Pas mal de choses sont passées depuis — de nouveaux incipits, une rubrique rap, des quiz. On te fait un tour d'horizon pour te remettre dans le bain ?",
      ctaLabel: "Voir ce qui est nouveau →",
      ctaHref: "/incipit-du-jour",
    };
  }
  if (signal.kind === "j7") {
    return {
      dayLabel: "Une semaine plus tard",
      title: "Tu nous as manqué.",
      lead: "Pas de jugement — on reprend en douceur. Voltaire, 160 pages, chapitres courts : le plus simple pour retrouver le rythme.",
      ctaLabel: "Ouvrir Candide →",
      ctaHref: "/book/candide",
    };
  }
  return {
    dayLabel: `Retour après ${signal.days} jours`,
    title: "On t'a gardé ta place.",
    lead: "Ton rituel est toujours là, intact. L'incipit du jour t'attend — deux minutes, pas plus, pour reprendre le fil.",
    ctaLabel: "Voir l'incipit du jour →",
    ctaHref: "/",
  };
}
