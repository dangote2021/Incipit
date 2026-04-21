// ─────────────────────────────────────────────────────────────────────────────
// État "Premium" (mock, côté client uniquement).
//
// Pas de paiement réel, pas de backend : on persiste un booléen + une date
// d'activation dans localStorage, et on expose un hook React pour piloter
// les gates d'UX (quiz chaîné, incipit illimité, citations illimitées, etc.).
//
// L'objectif est double :
//  1. Donner à Guillaume de quoi démo Premium en investor pitch sans avoir
//     à brancher Stripe.
//  2. Laisser une API propre (`usePremium`, `FEATURES`) à recâbler plus tard
//     sur un vrai paywall.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState, useCallback } from "react";

const KEY = "incipit:premium:v1";

export type PremiumState = {
  /** `true` si l'utilisateur a activé le Premium (mock ou réel plus tard). */
  isPremium: boolean;
  /** ISO date d'activation (pour afficher "membre depuis…"). */
  activatedAt: string | null;
  /** Essai gratuit : ISO date de fin si en cours. */
  trialEndsAt: string | null;
};

export const DEFAULT_PREMIUM: PremiumState = {
  isPremium: false,
  activatedAt: null,
  trialEndsAt: null,
};

// ─── Feature flags : on centralise tout ici pour pouvoir auditer rapidement
// ─── ce qui est gratuit vs verrouillé.
export const FEATURES = {
  /** Quiz : enchaîner les parties sans limite journalière. */
  quizChain: {
    id: "quizChain",
    label: "Enchaîner les quiz",
    free: "3 parties / jour",
    premium: "Illimité + Mode série",
  },
  /** Incipit du jour : accès à l'archive des 30 derniers jours. */
  incipitArchive: {
    id: "incipitArchive",
    label: "Archive Incipit du jour",
    free: "Incipit d'aujourd'hui",
    premium: "30 jours + cartes HD",
  },
  /** Citations / punchlines : enchaîner sans limite. */
  punchlinesChain: {
    id: "punchlinesChain",
    label: "Punchlines illimitées",
    free: "3 cartes / session",
    premium: "Illimité",
  },
  /** Reading buddy : nombre de livres suivis en parallèle. */
  buddyMulti: {
    id: "buddyMulti",
    label: "Reading Buddy",
    free: "1 livre suivi",
    premium: "Tous les livres en parallèle",
  },
  /** Passages clés : accès aux passages complets au lieu des 2 premiers. */
  passagesFull: {
    id: "passagesFull",
    label: "Tous les passages clés",
    free: "2 premiers",
    premium: "Tous, avec contexte",
  },
} as const;

export type FeatureId = keyof typeof FEATURES;

// ─── Quotas free (session) — pour les compteurs anti-abus côté client.
export const FREE_QUOTAS = {
  quizRounds: 3,
  punchlineCards: 3,
} as const;

function safeGet(): PremiumState {
  if (typeof window === "undefined") return DEFAULT_PREMIUM;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PREMIUM;
    const parsed = JSON.parse(raw) as Partial<PremiumState>;
    return { ...DEFAULT_PREMIUM, ...parsed };
  } catch {
    return DEFAULT_PREMIUM;
  }
}

function safeSet(state: PremiumState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    // On notifie les autres onglets / hooks via un CustomEvent.
    window.dispatchEvent(new CustomEvent("incipit:premium:change"));
  } catch {
    // ignore
  }
}

/**
 * Lecture synchrone (SSR-safe : renvoie DEFAULT_PREMIUM côté serveur).
 */
export function getPremium(): PremiumState {
  return safeGet();
}

/**
 * Active le Premium en mock (essai gratuit 7 jours).
 * Remplacer par l'appel Stripe / RevenueCat le moment venu.
 */
export function activatePremium(): PremiumState {
  const now = new Date();
  const trialEnd = new Date(now);
  trialEnd.setDate(trialEnd.getDate() + 7);
  const next: PremiumState = {
    isPremium: true,
    activatedAt: now.toISOString(),
    trialEndsAt: trialEnd.toISOString(),
  };
  safeSet(next);
  return next;
}

/**
 * Désactive le Premium (debug / retour à un compte free).
 */
export function deactivatePremium(): PremiumState {
  safeSet(DEFAULT_PREMIUM);
  return DEFAULT_PREMIUM;
}

/**
 * Hook React : renvoie l'état Premium + actions, avec synchro multi-onglets.
 */
export function usePremium() {
  const [state, setState] = useState<PremiumState>(DEFAULT_PREMIUM);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(safeGet());
    setHydrated(true);

    const refresh = () => setState(safeGet());
    window.addEventListener("storage", refresh);
    window.addEventListener("incipit:premium:change", refresh as EventListener);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(
        "incipit:premium:change",
        refresh as EventListener
      );
    };
  }, []);

  const activate = useCallback(() => {
    const next = activatePremium();
    setState(next);
    return next;
  }, []);

  const deactivate = useCallback(() => {
    const next = deactivatePremium();
    setState(next);
    return next;
  }, []);

  return {
    ...state,
    hydrated,
    activate,
    deactivate,
    /** Raccourci : cette feature est-elle accessible avec le plan actuel ? */
    canUse: (id: FeatureId) => state.isPremium || !FEATURES[id],
  };
}

/**
 * Formatte une fin d'essai en "plus que X jours" / "expiré".
 */
export function formatTrialRemaining(trialEndsAt: string | null): string {
  if (!trialEndsAt) return "";
  const end = new Date(trialEndsAt).getTime();
  const now = Date.now();
  const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Essai terminé";
  if (days === 1) return "Encore 1 jour d'essai";
  return `Encore ${days} jours d'essai`;
}
