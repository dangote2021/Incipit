// ─────────────────────────────────────────────────────────────────────────────
// Web Push — helpers client.
//
// Pipeline :
//   1. Demander la permission Notification (lib/notif-prefs gère déjà ça).
//   2. Récupérer/créer le PushSubscription via le SW (pushManager.subscribe)
//      avec la clé publique VAPID (NEXT_PUBLIC_VAPID_PUBLIC_KEY).
//   3. POST /api/push/subscribe → la sub est stockée en DB, lié au user.id
//      si connecté.
//
// Tous les helpers sont défensifs : si Push API pas dispo, ou pas de clé
// VAPID exposée, on retourne { supported: false } sans planter.
// ─────────────────────────────────────────────────────────────────────────────

export type PushStatus = {
  supported: boolean;
  permission: NotificationPermission | "default";
  subscribed: boolean;
};

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(b64);
  // Allocate via ArrayBuffer pour rester sur un Uint8Array<ArrayBuffer>
  // strict (PushManager n'accepte pas SharedArrayBuffer).
  const buf = new ArrayBuffer(raw.length);
  const out = new Uint8Array(buf);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function isSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

function vapidKey(): string | null {
  const k = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  return k && k.length > 0 ? k : null;
}

async function getRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!isSupported()) return null;
  try {
    return (
      (await navigator.serviceWorker.getRegistration()) ??
      (await navigator.serviceWorker.ready)
    );
  } catch {
    return null;
  }
}

export async function getPushStatus(): Promise<PushStatus> {
  if (!isSupported()) {
    return { supported: false, permission: "default", subscribed: false };
  }
  const reg = await getRegistration();
  if (!reg) {
    return {
      supported: true,
      permission: Notification.permission,
      subscribed: false,
    };
  }
  const sub = await reg.pushManager.getSubscription();
  return {
    supported: true,
    permission: Notification.permission,
    subscribed: !!sub,
  };
}

/**
 * Souscrit aux push notifications. Demande la permission si nécessaire.
 * Retourne true si la sub est créée et envoyée au serveur.
 */
export async function subscribePush(): Promise<{
  ok: boolean;
  reason?: string;
}> {
  if (!isSupported()) return { ok: false, reason: "unsupported" };
  const key = vapidKey();
  if (!key) return { ok: false, reason: "no_vapid_key" };

  // Permission
  if (Notification.permission === "default") {
    const result = await Notification.requestPermission();
    if (result !== "granted") return { ok: false, reason: "permission_denied" };
  } else if (Notification.permission !== "granted") {
    return { ok: false, reason: "permission_denied" };
  }

  const reg = await getRegistration();
  if (!reg) return { ok: false, reason: "no_sw" };

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    try {
      // Cast pour contourner la stricte typage Uint8Array<ArrayBuffer>
      // — l'API navigateur accepte BufferSource sans distinction.
      const appKey = urlBase64ToUint8Array(key) as unknown as BufferSource;
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: appKey,
      });
    } catch (e) {
      console.warn("[web-push] subscribe failed:", e);
      return { ok: false, reason: "subscribe_failed" };
    }
  }

  // Envoie au backend (silently ignored si VAPID/admin pas configuré).
  try {
    const json = sub.toJSON();
    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint: json.endpoint,
        keys: json.keys,
      }),
    });
    if (!res.ok && res.status !== 503) {
      // 503 = backend pas configuré, on ne casse pas l'UX local.
      console.warn("[web-push] /subscribe non-200:", res.status);
    }
  } catch (e) {
    console.warn("[web-push] /subscribe network error:", e);
  }

  return { ok: true };
}

/**
 * Désabonne (côté navigateur + côté serveur).
 */
export async function unsubscribePush(): Promise<{ ok: boolean }> {
  if (!isSupported()) return { ok: false };
  const reg = await getRegistration();
  if (!reg) return { ok: true };
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return { ok: true };

  const endpoint = sub.endpoint;
  try {
    await sub.unsubscribe();
  } catch {
    // ignore — on essaie quand même de notifier le serveur
  }
  try {
    await fetch("/api/push/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint }),
    });
  } catch {
    // ignore
  }
  return { ok: true };
}
