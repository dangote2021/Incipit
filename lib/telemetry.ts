// ─────────────────────────────────────────────────────────────────────────────
// Helper client pour envoyer des events anonymes.
//
// Principe "privacy by default" :
//   - Pas de user_id. On génère un session_id aléatoire qui rotate toutes
//     les 24h (dans sessionStorage, pas localStorage).
//   - Les appels sont best-effort (beacon API quand possible).
//   - Si l'utilisateur a demandé DNT, on n'envoie rien.
// ─────────────────────────────────────────────────────────────────────────────

const SESSION_KEY = "incipit:tel:sid";
const SESSION_EXP_KEY = "incipit:tel:sid_exp";
const DAY_MS = 24 * 60 * 60 * 1000;

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const now = Date.now();
    const exp = Number(sessionStorage.getItem(SESSION_EXP_KEY) || "0");
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing && exp > now) return existing;
    const sid = randomId();
    sessionStorage.setItem(SESSION_KEY, sid);
    sessionStorage.setItem(SESSION_EXP_KEY, String(now + DAY_MS));
    return sid;
  } catch {
    return "";
  }
}

function randomId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function dntEnabled(): boolean {
  if (typeof navigator === "undefined") return false;
  // @ts-expect-error — non standard mais largement supporté
  const dnt = navigator.doNotTrack || window.doNotTrack;
  return dnt === "1" || dnt === "yes";
}

export function track(
  event: string,
  metadata?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;
  if (dntEnabled()) return;

  const sid = getSessionId();
  if (!sid) return;

  const body = JSON.stringify({ event, session_id: sid, metadata: metadata ?? {} });
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/telemetry/event", blob);
      return;
    }
  } catch {
    // fallback fetch
  }
  try {
    fetch("/api/telemetry/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // silent
    });
  } catch {
    // silent
  }
}
