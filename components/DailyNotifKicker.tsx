"use client";

import { useEffect } from "react";
import { getDailyIncipit } from "@/lib/daily-incipit";
import { maybeFireDailyNotif } from "@/lib/notif-prefs";
import { track } from "@/lib/telemetry";

/**
 * Composant invisible — déclenche la notification "incipit du jour" si
 * les conditions sont réunies (opt-in, permission, heure passée, pas déjà
 * notifié ce jour). Cf. `lib/notif-prefs.ts`.
 *
 * Filet de rattrapage web : la vraie planif offline passe par Capacitor
 * Local Notifications (branchée dans #59).
 *
 * Émet aussi le track "incipit_viewed" une fois par session pour mesurer
 * l'engagement matinal (le composant ne mount qu'à l'affichage de la home).
 */
export default function DailyNotifKicker() {
  useEffect(() => {
    const { book } = getDailyIncipit();
    // Body court — iOS et Android tronquent à ~90 caractères visibles.
    const body = `${book.title} — ${book.author}. Deux minutes pour la première ligne.`;
    maybeFireDailyNotif(body);

    // Track view (anonymisé, session_id seulement). On guard avec un flag
    // sessionStorage pour ne pas tracker à chaque navigation interne.
    try {
      const flag = "incipit:tel:viewed";
      if (!sessionStorage.getItem(flag)) {
        track("incipit_viewed", { book_id: book.id });
        sessionStorage.setItem(flag, "1");
      }
    } catch {
      // ignore
    }
  }, []);

  return null;
}
