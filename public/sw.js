/**
 * Shoppr Service Worker
 * Estrategia:
 *   - Cache First: assets estáticos (_next/static, iconos, fuentes)
 *   - Network First: páginas de navegación (HTML)
 *   - Offline fallback: public/offline.html si no hay conexión
 */

const CACHE_VERSION = "shoppr-v1";
const OFFLINE_URL = "/offline.html";

const STATIC_ASSETS = [
  OFFLINE_URL,
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// ── Install ────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  // Activar inmediatamente sin esperar que el SW anterior termine
  self.skipWaiting();
});

// ── Activate ───────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    )
  );
  // Tomar control de todas las pestañas abiertas
  self.clients.claim();
});

// ── Fetch ──────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar same-origin y http/https
  if (url.origin !== location.origin) return;
  if (!["http:", "https:"].includes(url.protocol)) return;

  // Assets estáticos de Next.js (_next/static) → Cache First
  if (url.pathname.startsWith("/_next/static") || url.pathname.startsWith("/icons")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Peticiones de navegación (HTML) → Network First con fallback a offline
  if (request.mode === "navigate") {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // API routes → siempre Network (nunca cachear datos de la API)
  if (url.pathname.startsWith("/api/")) {
    return; // deja que el browser lo maneje normalmente
  }

  // Todo lo demás → Network First
  event.respondWith(networkFirst(request));
});

// ── Estrategias ────────────────────────────────────────────────────────────

/** Cache First: devuelve desde caché si existe; si no, red y guarda en caché. */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Asset no disponible offline", { status: 503 });
  }
}

/** Network First: intenta red primero; si falla, caché. */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? new Response("No disponible offline", { status: 503 });
  }
}

/** Network First para navegación; si falla, devuelve offline.html. */
async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    const offlinePage = await caches.match(OFFLINE_URL);
    return offlinePage ?? new Response("<h1>Sin conexión</h1>", {
      status: 503,
      headers: { "Content-Type": "text/html" },
    });
  }
}
