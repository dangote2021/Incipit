// Incipit — Service Worker minimaliste
// Stratégie : cache-first pour les assets statiques, network-first pour le HTML.
// Objectif MVP : permettre la relecture offline des pages déjà visitées.

const CACHE_VERSION = "incipit-v3";
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
