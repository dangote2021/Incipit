"use client";

import { useEffect } from "react";
import { getDailyIncipit } from "@/lib/daily-incipit";
import { maybeFireDailyNotif } from "@/lib/notif-prefs";

/**
 * Composant invisible — déclenche la notification "incipit du jour" si
 * les conditions sont réunies (opt-in, permission, heure passée, pas déjà
 * notifié ce jour). Cf. `lib/notif-prefs.ts`.
 *
 * Filet de rattrapage web : la vraie planif offline passe par Capacitor
 * Local Notifications (branchée dans #59).
 */
export default function DailyNotifKicker() {
  useEffect(() => {
    const { book } = getDailyIncipit();
    // Body court — iOS et Android tronquent à ~90 caractères visibles.
    const body = `${book.title} — ${book.author}. Deux minutes pour la première ligne.`;
    maybeFireDailyNotif(body);
  }, []);

  return null;
}
