"use client";

import { useEffect, useState } from "react";
import { getStreak } from "@/lib/streak";
import {
  decline,
  markAsked,
  requestBrowserPermission,
  scheduleNativeDaily,
  shouldAskForOptIn,
  snoozeFor,
  updateNotifPrefs,
} from "@/lib/notif-prefs";

type Phase = "hidden" | "invite" | "hour" | "confirmed" | "denied";

/**
 * Carte "active la notif quotidienne" — s'affiche une fois que l'utilisateur
 * a une habitude émergente (streak ≥ 3). On ne propose pas dès J1 parce que
 * demander une permission navigateur tôt tue le taux d'acceptation (retour
 * produits à notifications : 50% d'acceptation quand on demande après une
 * preuve de valeur, 12% quand on demande à l'ouverture).
 *
 * Parcours :
 *   1. Invite  : "on t'envoie l'incipit à 8h ?" + choix "non merci / plus tard / oui"
 *   2. Hour    : si "oui", on demande l'heure préférée (8 / 12 / 20)
 *   3. Confirmed : "c'est calé", dismissible
 *   4. Denied  : si le navigateur refuse, on montre le pourquoi + comment
 *                réactiver dans les réglages système.
 *
 * S'intègre au carrousel vertical (snap-start). Client-only, retourne null
 * tant qu'on n'a pas décidé de montrer quoi que ce soit.
 */
export default function NotifOptIn() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [hour, setHour] = useState(8);

  useEffect(() => {
    // Gate côté habitude : streak ≥ 3 (ou ≥ 3 ouvertures distinctes) = la
    // flamme a été méritée, l'app a déjà rendu service. On ne pollue pas
    // les premiers jours avec un prompt de permission.
    const s = getStreak();
    if (s.current < 3 && s.totalDays < 3) return;
    if (!shouldAskForOptIn()) return;
    setPhase("invite");
  }, []);

  if (phase === "hidden") return null;

  return (
    <section className="snap-start min-h-[calc(100vh-6rem)] flex items-center justify-center px-6 py-10 bg-paper">
      {phase === "denied" && (
        <aside className="max-w-sm w-full bg-paper border-2 border-ink/10 rounded-2xl p-5 text-sm">
          <div className="font-serif text-base font-bold text-ink mb-1">
            Notifications bloquées par ton navigateur.
          </div>
          <p className="text-ink/70 leading-relaxed text-[13px]">
            Tu peux les réactiver depuis les réglages du site (icône cadenas
            dans la barre d'URL). Sinon, pas grave — on sera là demain.
          </p>
          <button
            type="button"
            onClick={() => {
              decline();
              setPhase("hidden");
            }}
            className="mt-3 text-[11px] uppercase tracking-widest font-bold text-ink/50 hover:text-ink"
          >
            OK, fermer
          </button>
        </aside>
      )}

      {phase === "confirmed" && (
        <aside className="max-w-sm w-full bg-sage/10 border-2 border-sage/40 rounded-2xl p-5 text-sm">
          <div className="font-serif text-base font-bold text-ink mb-1">
            C'est calé. On se voit à {hour}h.
          </div>
          <p className="text-ink/70 leading-relaxed text-[13px]">
            Tu pourras changer ou désactiver dans ton profil.
          </p>
          <button
            type="button"
            onClick={() => setPhase("hidden")}
            className="mt-3 text-[11px] uppercase tracking-widest font-bold text-ink/50 hover:text-ink"
          >
            Fermer
          </button>
        </aside>
      )}

      {phase === "hour" && (
        <aside className="max-w-sm w-full bg-paper border-2 border-ink/15 rounded-2xl p-5 text-sm shadow-sm">
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-2">
            À quelle heure ?
          </div>
          <div className="font-serif text-lg font-black text-ink mb-4 leading-tight">
            On te l'envoie quand, ton incipit ?
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { h: 8, label: "8h", sub: "Matin" },
              { h: 12, label: "12h", sub: "Midi" },
              { h: 20, label: "20h", sub: "Soir" },
            ].map((opt) => (
              <button
                key={opt.h}
                type="button"
                onClick={() => setHour(opt.h)}
                className={`rounded-2xl border-2 py-3 transition ${
                  hour === opt.h
                    ? "border-bordeaux bg-bordeaux text-paper"
                    : "border-ink/10 bg-paper text-ink hover:border-ink/30"
                }`}
              >
                <div className="font-serif text-xl font-black">{opt.label}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold mt-0.5 opacity-80">
                  {opt.sub}
                </div>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={async () => {
              const granted = await requestBrowserPermission();
              markAsked();
              if (!granted) {
                setPhase("denied");
                return;
              }
              updateNotifPrefs({ enabled: true, hour });
              // Hook natif (no-op sur web, branchera Capacitor en #59).
              await scheduleNativeDaily(hour);
              setPhase("confirmed");
            }}
            className="w-full bg-ink text-paper py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-bordeaux transition"
          >
            C'est parti, à {hour}h →
          </button>
        </aside>
      )}

      {phase === "invite" && (
        <aside className="max-w-sm w-full bg-gradient-to-br from-cream via-paper to-dust border-2 border-ink/10 rounded-2xl p-5 text-sm shadow-sm">
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-2">
            Un pas de plus
          </div>
          <div className="font-serif text-lg font-black text-ink mb-1 leading-tight">
            On t'envoie l'incipit chaque matin ?
          </div>
          <p className="text-ink/70 leading-relaxed text-[13px] mb-4">
            Deux minutes, une fois par jour. Pas de ping parasite, pas de
            notifs chelou — juste le classique du matin. Tu pourras couper
            quand tu veux.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                markAsked();
                setPhase("hour");
              }}
              className="flex-1 bg-ink text-paper py-2.5 rounded-full text-[11px] uppercase tracking-widest font-bold hover:bg-bordeaux transition"
            >
              OK, activer
            </button>
            <button
              type="button"
              onClick={() => {
                snoozeFor(7);
                setPhase("hidden");
              }}
              className="px-4 py-2.5 rounded-full text-[11px] uppercase tracking-widest font-bold text-ink/60 hover:text-ink"
            >
              Plus tard
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              decline();
              setPhase("hidden");
            }}
            className="mt-2 text-[10px] uppercase tracking-widest font-bold text-ink/40 hover:text-ink/70"
          >
            Non merci, ne plus demander
          </button>
        </aside>
      )}
    </section>
  );
}
