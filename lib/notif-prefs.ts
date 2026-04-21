// ─────────────────────────────────────────────────────────────────────────────
// Notifications quotidiennes — couche préférences + orchestration.
//
// Proposition #3 du panel v8 (Thibault, Sarah, Mehdi) : « sans notification
// quotidienne, je vais passer à côté sans faire exprès ». Mécanique la plus
// prouvée pour transformer un bon rituel en habitude installée.
//
// Architecture deux canaux :
//   - WEB (PWA) : Notification API, fonctionne quand l'app est ouverte.
//     Pas de vrai "planificateur" offline sans push serveur → on déclenche
//     la notif lors de la prochaine ouverture si on est passé l'heure cible
//     et que pas encore notifié ce jour. C'est un rappel *au retour*, pas
//     un réveil — mais c'est déjà la moitié du bénéfice (reinforcer le
//     rituel au moment de l'ouverture).
//   - NATIF (Capacitor, plateforme iOS/Android) : @capacitor/local-
//     notifications planifie vraiment hors-app. Intégration faite en #59.
//     On expose une hook `scheduleNative()` qui est no-op sur web et
//     branchée au moment de la compilation Capacitor.
//
// Stockage : localStorage only, pas d'envoi serveur (pas de backend).
// ─────────────────────────────────────────────────────────────────────────────

const KEY = "incipit:notif-prefs:v1";

export type NotifPrefs = {
  /** Activé par l'utilisateur (et permission navigateur accordée pour web). */
  enabled: boolean;
  /** Heure locale cible, 0-23. Défaut : 08 (rituel du matin). */
  hour: number;
  /** Dernière date où une notif a été affichée (yyyy-mm-dd local). */
  lastNotifiedOn: string;
  /** Dernière fois où on a demandé l'opt-in à l'utilisateur — évite de spammer. */
  lastAsked: string;
  /** L'utilisateur a dit "plus tard" → on n'insiste pas pour X jours. */
  snoozedUntil: string;
  /** L'utilisateur a explicitement refusé — on ne redemande plus. */
  declined: boolean;
};

const DEFAULT_PREFS: NotifPrefs = {
  enabled: false,
  hour: 8,
  lastNotifiedOn: "",
  lastAsked: "",
  snoozedUntil: "",
  declined: false,
};

function todayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function safeRead(): NotifPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<NotifPrefs>) };
  } catch {
    return DEFAULT_PREFS;
  }
}

function safeWrite(p: NotifPrefs) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

export function getNotifPrefs(): NotifPrefs {
  return safeRead();
}

export function updateNotifPrefs(patch: Partial<NotifPrefs>): NotifPrefs {
  const next = { ...safeRead(), ...patch };
  safeWrite(next);
  return next;
}

/**
 * True si on peut raisonnablement demander l'opt-in aujourd'hui. Conditions :
 *   - pas déjà activé
 *   - pas déjà refusé
 *   - pas snoozé
 *   - pas demandé dans les 24h (évite le "j'ai cliqué plus tard, on me
 *     redemande une minute après")
 */
export function shouldAskForOptIn(): boolean {
  const p = safeRead();
  if (p.enabled || p.declined) return false;
  const today = todayLocal();
  if (p.snoozedUntil && p.snoozedUntil > today) return false;
  if (p.lastAsked === today) return false;
  return true;
}

export function markAsked(): void {
  updateNotifPrefs({ lastAsked: todayLocal() });
}

export function snoozeFor(days: number): void {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const until = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
  updateNotifPrefs({ snoozedUntil: until, lastAsked: todayLocal() });
}

export function decline(): void {
  updateNotifPrefs({ declined: true, lastAsked: todayLocal() });
}

/**
 * Demande la permission navigateur. No-op côté serveur / SSR.
 * Retourne true si on a obtenu la permission.
 */
export async function requestBrowserPermission(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  try {
    const result = await Notification.requestPermission();
    return result === "granted";
  } catch {
    return false;
  }
}

/**
 * Affiche une notification "incipit du jour" si :
 *   - l'utilisateur a opt-in
 *   - la permission est accordée (ou on est sur Capacitor natif)
 *   - on est passé l'heure cible
 *   - pas déjà notifié aujourd'hui
 *
 * Appelé à l'ouverture de l'app (cf. DailyNotifKicker). Cette mécanique
 * ne remplace pas une vraie planif serveur/Capacitor — c'est un filet
 * de rattrapage au cas où l'utilisateur a loupé la plage cible.
 */
export function maybeFireDailyNotif(body: string, title = "Incipit du jour"): boolean {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) return false;
  if (Notification.permission !== "granted") return false;

  const p = safeRead();
  if (!p.enabled) return false;
  const today = todayLocal();
  if (p.lastNotifiedOn === today) return false;

  const now = new Date();
  if (now.getHours() < p.hour) return false;

  try {
    new Notification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: `incipit-daily-${today}`,
      silent: false,
    });
    updateNotifPrefs({ lastNotifiedOn: today });
    return true;
  } catch {
    return false;
  }
}

/**
 * Placeholder pour Capacitor Local Notifications — branché à la compilation
 * native dans lib/capacitor-bridge.ts (à créer en #59). Sur web, no-op.
 * On laisse l'interface en place pour que le reste du code (UX/UI/toggle)
 * soit déjà finalisé et n'ait qu'à être "nourri" par le natif.
 */
export async function scheduleNativeDaily(hour: number): Promise<void> {
  void hour;
  // TODO(#59) : brancher @capacitor/local-notifications.schedule({ at: ... })
  // quand Capacitor sera setup. Sur web, on ne peut pas planifier offline.
}

export async function cancelNativeDaily(): Promise<void> {
  // TODO(#59) : @capacitor/local-notifications.cancel()
}
