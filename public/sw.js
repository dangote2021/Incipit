// Incipit — Service Worker minimaliste
// Stratégie : cache-first pour les assets statiques, network-first pour le HTML.
// Objectif MVP : permettre la relecture offline des pages déjà visitées.
// Ajout v4 : push event handler pour Web Push (VAPID) — notif quotidienne
// envoyée par /api/cron/daily-push.

const CACHE_VERSION = "incipit-v4";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Pré-cache minimal : le shell offline
const PRECACHE_URLS = ["/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // On ne gère que GET
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Ne pas toucher aux routes API ou aux requêtes croisées
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  // Bundles Next.js : pairés avec le HTML, surtout ne pas cache-first —
  // sinon on sert un vieux chunk incompatible après un deploy.
  if (url.pathname.startsWith("/_next/")) return;

  // HTML : network-first, fallback cache, fallback page offline
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(request);
          return cached || (await caches.match("/offline.html"));
        }
      })()
    );
    return;
  }

  // Assets : cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((resp) => {
          const cache = caches.open(RUNTIME_CACHE);
          cache.then((c) => c.put(request, resp.clone())).catch(() => {});
          return resp;
        })
        .catch(() => cached || new Response("", { status: 408 }));
    })
  );
});

// ─── Push notifications (Web Push / VAPID) ───────────────────────────────
// Le serveur envoie un payload JSON :
//   { title, body, url, tag }
// On l'affiche, et on memorise l'URL pour la relancer au clic.
self.addEventListener("push", (event) => {
  let data = { title: "Incipit du jour", body: "Un nouveau classique t'attend.", url: "/", tag: "incipit-daily" };
  try {
    if (event.data) {
      const json = event.data.json();
      data = { ...data, ...json };
    }
  } catch (e) {
    // payload non-JSON → on garde le défaut
    if (event.data) data.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: data.tag,
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const c of clients) {
        if ("focus" in c) {
          c.focus();
          if ("navigate" in c) c.navigate(url);
          return;
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
